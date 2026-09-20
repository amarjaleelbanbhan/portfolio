/**
 * /admin/<section>/<id> — the record editor, and `/new` for creating one.
 *
 * A thin route: the schema decides the fields, `RecordEditor` decides the
 * behaviour, and this file only resolves which is which.
 */
import { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AdminShell from '@/components/admin/AdminShell';
import RecordEditor from '@/components/admin/RecordEditor';
import { createCms } from '@/lib/cms/client';
import { schemaForSection } from '@/lib/cms/schemas';

function Editor({ schema, recordId, session, setSession }) {
  const cms = useMemo(() => createCms(() => session, setSession), [session, setSession]);

  return (
    <div>
      <p className="mb-5">
        <Link
          href={`/admin/${schema.section}`}
          className="font-code text-xs text-slate-500 transition-colors hover:text-teal-300"
        >
          ← {schema.plural}
        </Link>
      </p>
      <RecordEditor schema={schema} cms={cms} recordId={recordId} />
    </div>
  );
}

export default function RecordPage() {
  const router = useRouter();
  const section = String(router.query.section ?? '');
  const recordId = String(router.query.id ?? '');
  const schema = schemaForSection(section);

  if (!schema || !recordId) {
    return (
      <AdminShell title="Not found" description="That record does not exist">
        {() => (
          <p className="text-sm text-slate-400">
            <Link href="/admin" className="text-teal-300 hover:text-teal-200">
              Back to the dashboard
            </Link>
          </p>
        )}
      </AdminShell>
    );
  }

  const isNew = recordId === 'new';

  return (
    <AdminShell
      title={isNew ? `New ${schema.label.toLowerCase()}` : schema.label}
      description={isNew ? `Create a ${schema.label.toLowerCase()}` : 'Edit, publish or delete this record'}
    >
      {({ session, setSession }) => (
        <Editor schema={schema} recordId={recordId} session={session} setSession={setSession} />
      )}
    </AdminShell>
  );
}
