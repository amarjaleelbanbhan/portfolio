/**
 * CRM operations.
 *
 * Leads are the one table with real data in it, and the only one where a
 * mistake loses something that cannot be recreated. So every operation here is
 * additive or a field update — nothing deletes a lead, and nothing overwrites
 * the intake fields a visitor actually wrote.
 *
 * ── Activity is written, not inferred ────────────────────────────────────────
 * A status change, a follow-up date, a priority change: each appends to
 * `lead_activity`. That is what turns a lead from a row into a history, and it
 * is the difference between "status: contacted" and "contacted on the 14th,
 * after two weeks in review".
 *
 * `actor_id` and `author_id` are always the signed-in user's own id, because
 * the insert policies require `= auth.uid()` and because an attributed note
 * whose author came from a form field is not attribution.
 */

export const LEAD_COLUMNS = [
  'id',
  'created_at',
  'updated_at',
  'name',
  'email',
  'company',
  'website',
  'problem',
  'source',
  'status',
  'service',
  'timeline',
  'priority',
  'estimated_value_usd',
  'next_follow_up_at',
  'last_contacted_at',
  'internal_tags',
  'notified_at',
].join(',');

/**
 * The pipeline, in the order a lead moves through it.
 *
 * `new`, `contacted`, `qualified`, `won` and `closed` predate the CRM columns
 * and are still valid; they are placed where they belong rather than pushed to
 * the end, so an old lead appears in the right column instead of a legacy bin.
 */
export const PIPELINE = [
  { id: 'new', label: 'New', tone: '#38bdf8' },
  { id: 'reviewing', label: 'Reviewing', tone: '#986ef7' },
  { id: 'contacted', label: 'Contacted', tone: '#14b8a6' },
  { id: 'qualified', label: 'Qualified', tone: '#22c55e' },
  { id: 'proposal', label: 'Proposal', tone: '#f59e0b' },
  { id: 'negotiation', label: 'Negotiation', tone: '#f97316' },
  { id: 'won', label: 'Won', tone: '#22c55e' },
  { id: 'lost', label: 'Lost', tone: '#8291aa' },
  { id: 'closed', label: 'Closed', tone: '#8291aa' },
  { id: 'archived', label: 'Archived', tone: '#475569' },
];

export const PRIORITIES = [
  { id: 'urgent', label: 'Urgent', tone: '#f87171' },
  { id: 'high', label: 'High', tone: '#f59e0b' },
  { id: 'normal', label: 'Normal', tone: '#94a3b8' },
  { id: 'low', label: 'Low', tone: '#8291aa' },
];

export const pipelineTone = (status) => PIPELINE.find((s) => s.id === status)?.tone ?? '#8291aa';
export const priorityTone = (priority) => PRIORITIES.find((p) => p.id === priority)?.tone ?? '#94a3b8';

/**
 * The contact form writes its category as the first line of the message,
 * because the intake policy pins `source`. Pulling it back out here is what
 * lets the CRM show "Research collaboration" instead of "studio_request".
 */
export function enquiryKind(lead) {
  const match = /^\[Contact form — ([^\]]+)\]/.exec(lead.problem ?? '');
  if (match) return { channel: 'Contact form', category: match[1] };
  return { channel: 'Studio request', category: null };
}

/** The message without the category marker, for display. */
export function enquiryBody(lead) {
  return String(lead.problem ?? '').replace(/^\[Contact form — [^\]]+\]\s*/, '');
}

export function createLeads(cms, getUserId) {
  async function logActivity(leadId, action, detail = {}) {
    const actorId = getUserId();
    if (!actorId) return;
    try {
      await cms.request('lead_activity', {
        method: 'POST',
        prefer: 'return=minimal',
        body: { lead_id: leadId, actor_id: actorId, action, detail },
      });
    } catch {
      // Same rule as the audit log: never lose the operation because its
      // history line could not be written.
    }
  }

  return {
    async list() {
      return cms.list('studio_leads', {
        select: LEAD_COLUMNS,
        order: 'created_at.desc',
        limit: '500',
      });
    },

    async notes(leadId) {
      return cms.list('lead_notes', {
        select: 'id,note,created_at,author_id',
        lead_id: `eq.${leadId}`,
        order: 'created_at.desc',
      });
    },

    async activity(leadId) {
      return cms.list('lead_activity', {
        select: 'id,action,detail,created_at,actor_id',
        lead_id: `eq.${leadId}`,
        order: 'created_at.desc',
        limit: '100',
      });
    },

    /**
     * Update CRM fields only.
     *
     * The intake columns — name, email, company, website, problem — are never
     * written here. They are what the visitor said, and an internal tool has no
     * business editing someone else's words.
     */
    async updateFields(lead, patch) {
      const allowed = [
        'status',
        'priority',
        'estimated_value_usd',
        'next_follow_up_at',
        'last_contacted_at',
        'internal_tags',
      ];
      const body = {};
      for (const key of allowed) {
        if (key in patch) body[key] = patch[key];
      }
      if (Object.keys(body).length === 0) return lead;

      const updated = await cms.update('studio_leads', { id: `eq.${lead.id}` }, body, {
        entityLabel: lead.name,
      });

      // One activity line per meaningful change, with the before and after —
      // "status changed" on its own tells you nothing a month later.
      if ('status' in body && body.status !== lead.status) {
        await logActivity(lead.id, 'status_changed', { from: lead.status, to: body.status });
      }
      if ('priority' in body && body.priority !== lead.priority) {
        await logActivity(lead.id, 'priority_changed', { from: lead.priority, to: body.priority });
      }
      if ('next_follow_up_at' in body && body.next_follow_up_at !== lead.next_follow_up_at) {
        await logActivity(lead.id, body.next_follow_up_at ? 'follow_up_scheduled' : 'follow_up_cleared', {
          at: body.next_follow_up_at ?? '',
        });
      }
      if ('estimated_value_usd' in body && body.estimated_value_usd !== lead.estimated_value_usd) {
        await logActivity(lead.id, 'value_changed', {
          from: lead.estimated_value_usd ?? '',
          to: body.estimated_value_usd ?? '',
        });
      }
      if ('internal_tags' in body) {
        await logActivity(lead.id, 'tags_changed', { tags: (body.internal_tags ?? []).join(', ') });
      }

      return updated;
    },

    async addNote(lead, text) {
      const authorId = getUserId();
      if (!authorId) throw new Error('Not signed in.');
      const trimmed = String(text).trim();
      if (!trimmed) throw new Error('A note needs some text.');
      if (trimmed.length > 10000) throw new Error('That note is over 10,000 characters.');

      const [created] = await cms.request('lead_notes', {
        method: 'POST',
        prefer: 'return=representation',
        body: { lead_id: lead.id, author_id: authorId, note: trimmed },
      });
      await logActivity(lead.id, 'note_added', { length: trimmed.length });
      return created;
    },

    /**
     * Record that an email was sent.
     *
     * The mail client does the sending; this marks `last_contacted_at` and
     * writes the history line, because a CRM that opens a draft and forgets
     * about it is not tracking anything.
     */
    async markContacted(lead) {
      const now = new Date().toISOString();
      const updated = await cms.update(
        'studio_leads',
        { id: `eq.${lead.id}` },
        { last_contacted_at: now, ...(lead.status === 'new' ? { status: 'contacted' } : {}) },
        { entityLabel: lead.name }
      );
      await logActivity(lead.id, 'email_opened', { to: lead.email });
      return updated;
    },

    logActivity,
  };
}

/** A follow-up that has come due. */
export function followUpDue(lead) {
  if (!lead.next_follow_up_at) return false;
  return new Date(lead.next_follow_up_at).getTime() <= Date.now();
}

export function formatMoney(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return number.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

export function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
