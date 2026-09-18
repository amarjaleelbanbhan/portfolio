# amarjaleel.me

Personal portfolio and client-enquiry site for Amar Jaleel.

**Live:** [amarjaleel.me](https://amarjaleel.me)

## Stack

- **Next.js 16** (Pages Router, Turbopack) + **React 19**
- **Tailwind CSS** for the portfolio surfaces; CSS Modules for the Studio pages
- **TypeScript** for the content layer; the UI is still JavaScript
- **Supabase** behind one API route, for client lead capture
- Deployed on **Vercel**

It is not a purely static site: `/api/studio-lead` validates and persists client
enquiries, and `/studio/admin` reads them back behind Supabase auth.

## Setup

```bash
npm install
npm run dev          # http://localhost:3000
```

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint, zero warnings tolerated |
| `npm run validate:content` | Content integrity checks (see below) |
| `npm run assets` | Regenerate derived images from `assets/` |

CI runs `validate:content`, `lint` and `build` on every pull request.

## Content

All site content lives in `content/` as typed TypeScript, and is read through a
selector layer:

```
content/*.ts  →  lib/content  →  UI
```

**Components never import `content/` directly.** They import `@/lib/content`,
which is the only content entry point. That boundary exists so the static files
can later be swapped for a CMS without rewriting the UI.

| File | Holds |
|---|---|
| `content/profile.ts` | Name, title, positioning, contact, social links |
| `content/projects.ts` | Project registry (slug, tier, status, links, proof) |
| `content/research.ts` | Research entries, modelled separately from products |
| `content/open-source.ts` | Verified upstream contributions |
| `content/skills.ts` | Technologies and the work that evidences them |
| `content/credentials.ts` | Certifications with verification URLs |
| `content/education.ts` | Education history |
| `content/types.ts` | The model contract for all of the above |

Full architecture: [`docs/portfolio-2026/content-architecture.md`](docs/portfolio-2026/content-architecture.md).

### Editing content

Edit the relevant file in `content/`, then:

```bash
npm run validate:content
```

Validation fails the build on integrity problems — duplicate slugs, invalid
statuses, a skill pointing at a project that does not exist, a private
repository carrying a URL that would render a broken link, unverified proof, and
similar. It exists because the site previously carried claims that had quietly
drifted from reality.

Two rules the model enforces rather than trusts:

- **Slugs are identity.** Display titles can change freely; slugs must not.
  Project card visuals are keyed by slug for this reason.
- **Nothing published is unverified.** Every `proof` entry records the primary
  source it was checked against and the date it was checked.

## Routes

| Route | Purpose |
|---|---|
| `/` | Homepage |
| `/projects` | Project registry grouped by tier, plus upstream contributions |
| `/skills` | Technologies with the work that evidences them |
| `/certifications` | Credentials with verification links |
| `/contact` | Contact |
| `/hire`, `/studio`, `/studio/request` | Client enquiry funnel (Amar Digital Systems) |
| `/studio/admin` | Private lead dashboard |
| `/api/studio-lead` | Lead capture endpoint |

Portfolio routes carry the full visual system (boot sequence, particle canvas,
scanlines); the Studio routes deliberately do not — see `lib/routeChrome.js`.

## Documentation

- [`docs/portfolio-2026/`](docs/portfolio-2026/) — current-state audit, content
  audit, content architecture, Codex salvage audit, Supabase security review
- [`docs/archive/`](docs/archive/) — superseded documents, kept for the record
- `PORTFOLIO_2026_IMPLEMENTATION.md` — the phased upgrade plan and its status

## License

MIT — see [LICENSE](LICENSE).
