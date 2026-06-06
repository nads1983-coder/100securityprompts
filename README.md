# AI Off-Page SEO Automation OS

Private Next.js operating console for autonomous off-page SEO, authority content generation, platform-safe distribution, and weekly reporting.

## What It Does

- Runs daily AI agents through `/api/agents/daily-run`.
- Generates brand-specific authority content, short-form captions, article drafts, newsletter snippets, and AI-search content.
- Generates backlink, brand mention, collaboration, guest post, podcast, and entity SEO opportunities.
- Safety-checks content before queueing or publishing.
- Publishes only through enabled adapters with credentials and approved content.
- Logs generated content, queue decisions, failed/skipped publications, safety results, agent logs, and weekly reports.
- Provides a private admin dashboard at `/admin/seo-automation`.

## Brands

- `nadinepierre.com`
- `leadwithnadine.com`
- `getstratiq.co`
- `getcontentos.co`
- `calmauthority.co`

## Environment

Copy `.env.example` to `.env.local` for local development.

Required:

- `OPENAI_API_KEY`
- `SEO_AUTOMATION_SECRET`
- `AUTOPUBLISH_ENABLED=false`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Optional:

- `CRON_SECRET`, usually the same value as `SEO_AUTOMATION_SECRET`
- `LINKEDIN_ACCESS_TOKEN`
- `MEDIUM_ACCESS_TOKEN`
- `KIT_API_KEY`
- `X_API_KEY`
- `YOUTUBE_API_KEY`
- `INSTAGRAM_API_KEY`
- `TIKTOK_API_KEY`

If platform credentials are missing, the system skips safely and records the reason.

## Supabase Setup

Run the migration:

```bash
supabase db push
```

Or paste `supabase/migrations/202605240001_ai_seo_automation.sql` into the Supabase SQL editor.

All automation tables have RLS enabled. The app uses `SUPABASE_SERVICE_ROLE_KEY` only in server-only Route Handlers and repository modules.

## Local Development

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000/admin/seo-automation
```

Use `SEO_AUTOMATION_SECRET` to unlock the dashboard.

Checks:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Cron

`vercel.json` configures:

- Daily run: `0 7 * * *` to `/api/agents/daily-run`
- Weekly report: `0 9 * * 0` to `/api/agents/weekly-report`

Set `CRON_SECRET` or `SEO_AUTOMATION_SECRET` in Vercel. Requests must include:

```text
Authorization: Bearer <SEO_AUTOMATION_SECRET>
```

## GitHub Actions

Workflows:

- `.github/workflows/ci.yml`: install, typecheck, lint, test, build.
- `.github/workflows/seo-automation-backup.yml`: scheduled backup trigger and manual `workflow_dispatch`.

Set repository secrets:

- `SEO_AUTOMATION_BASE_URL`
- `SEO_AUTOMATION_SECRET`

## Autopublishing

V1 is queue-first safe mode.

Publishing only occurs when:

- global emergency pause is off
- `AUTOPUBLISH_ENABLED=true`
- dashboard autopublish toggle is on
- brand is enabled
- platform is enabled
- platform credentials exist
- Safety Agent approves the content
- publisher adapter supports the platform

Otherwise the item is queued, skipped, or blocked with logs.

## Emergency Controls

Use `/admin/seo-automation`:

- turn on Emergency pause to stop publishing immediately
- disable Autopublish to keep generation and queueing only
- disable individual brands or platforms
- review safety warnings and blocked content

Emergency pause blocks publishing but still allows logs and safe queue records.

## Production Checklist

- Apply Supabase migration.
- Set all required environment variables in Vercel.
- Keep `AUTOPUBLISH_ENABLED=false` for first smoke test.
- Deploy to Vercel.
- Unlock dashboard and run a manual Daily run.
- Verify Supabase rows in `agent_runs`, `generated_content`, `publishing_queue`, `agent_logs`, and `safety_logs`.
- Review generated content and skipped credential logs.
- Add one platform credential at a time.
- Enable platform in dashboard.
- Turn on Autopublish only after adapter behavior is verified.
- Keep Emergency pause visible and tested before live publishing.
