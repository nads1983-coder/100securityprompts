"use client";

import { useMemo, useState, useTransition, type ReactNode } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Database,
  ExternalLink,
  FileText,
  Filter,
  KeyRound,
  Lock,
  RadioTower,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  XCircle,
} from "lucide-react";
import type { AutomationSettings, DashboardSnapshot } from "@/lib/types";

type Props = {
  authenticated: boolean;
  initialSnapshot: DashboardSnapshot | null;
};

const navItems = [
  ["Status", Activity],
  ["Content", FileText],
  ["Queue", RadioTower],
  ["Opportunities", Sparkles],
  ["Reports", CalendarDays],
  ["Settings", ShieldCheck],
] as const;

export function SeoAutomationDashboard({ authenticated, initialSnapshot }: Props) {
  const [isAuthed, setIsAuthed] = useState(authenticated);
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [secret, setSecret] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function login() {
    setError(null);
    const response = await fetch("/api/admin/seo-automation/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret }),
    });
    if (!response.ok) {
      setError("That admin secret did not work.");
      return;
    }
    const data = await fetchSnapshot();
    setSnapshot(data);
    setIsAuthed(true);
  }

  async function fetchSnapshot() {
    const response = await fetch("/api/admin/seo-automation/data", { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to load dashboard data.");
    return (await response.json()) as DashboardSnapshot;
  }

  function refresh() {
    startTransition(async () => {
      setSnapshot(await fetchSnapshot());
    });
  }

  async function patchSettings(patch: Partial<AutomationSettings>) {
    const response = await fetch("/api/admin/seo-automation/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!response.ok) {
      setError("Unable to update settings.");
      return;
    }
    const settings = (await response.json()) as AutomationSettings;
    setSnapshot((current) => (current ? { ...current, settings } : current));
  }

  async function runAgents(path: "daily-run" | "weekly-report") {
    setError(null);
    const response = await fetch("/api/admin/seo-automation/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: path }),
    });
    if (!response.ok) {
      setError("Manual run failed. Use the admin secret in the login field before triggering runs.");
      return;
    }
    refresh();
  }

  const filteredContent = useMemo(() => {
    if (!snapshot) return [];
    const term = query.toLowerCase();
    return snapshot.generatedContent.filter((item) => {
      const matchesQuery = [item.brand, item.platform ?? "", item.content_type, item.title, item.status].join(" ").toLowerCase().includes(term);
      const matchesFilter = filter === "all" || item.brand === filter || item.status === filter || item.platform === filter;
      return matchesQuery && matchesFilter;
    });
  }, [snapshot, query, filter]);

  if (!isAuthed || !snapshot) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-soft px-5 py-10">
        <section className="w-full max-w-md rounded-lg bg-panel p-6 shadow-line">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-ink text-white">
            <Lock size={20} />
          </div>
          <h1 className="text-2xl font-semibold tracking-normal text-ink">SEO Automation Admin</h1>
          <p className="mt-2 text-sm leading-6 text-muted">Private operating console for autonomous off-page SEO agents.</p>
          <label className="mt-6 block text-sm font-medium text-ink" htmlFor="secret">
            Admin secret
          </label>
          <input
            id="secret"
            type="password"
            value={secret}
            onChange={(event) => setSecret(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") void login();
            }}
            className="mt-2 w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-teal"
          />
          {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
          <button
            type="button"
            onClick={login}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-black"
          >
            <KeyRound size={16} />
            Unlock dashboard
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-soft text-ink">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[248px_1fr]">
        <aside className="border-b border-line bg-panel px-4 py-4 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-ink text-white">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold">AI SEO OS</p>
              <p className="text-xs text-muted">Private automation</p>
            </div>
          </div>
          <nav className="mt-6 grid gap-1">
            {navItems.map(([label, Icon]) => (
              <a key={label} href={`#${label.toLowerCase()}`} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted hover:bg-soft hover:text-ink">
                <Icon size={16} />
                {label}
              </a>
            ))}
          </nav>
        </aside>

        <section className="px-4 py-5 sm:px-6 lg:px-8">
          <header className="flex flex-col gap-4 border-b border-line pb-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-normal">SEO Automation Control Room</h1>
              <p className="mt-1 text-sm text-muted">Agents, publishing safety, authority opportunities, and operational logs.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <IconButton label="Refresh" onClick={refresh} busy={isPending} icon={<RefreshCw size={16} />} />
              <IconButton label="Daily run" onClick={() => void runAgents("daily-run")} icon={<RadioTower size={16} />} />
              <IconButton label="Weekly report" onClick={() => void runAgents("weekly-report")} icon={<CalendarDays size={16} />} />
            </div>
          </header>

          {error ? <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-danger">{error}</div> : null}

          <section id="status" className="mt-6 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
            <Panel title="Live Agent Status" icon={<Activity size={18} />}>
              <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber">
                Phase 1 draft-only mode is active. Approved content is queued for human review and will not auto-publish.
              </div>
              <div className="grid gap-3 sm:grid-cols-4">
                <Metric label="Latest run" value={snapshot.latestRun?.status ?? "idle"} tone={snapshot.latestRun?.status === "failed" ? "danger" : "good"} />
                <Metric label="Generated" value={String(snapshot.generatedContent.length)} />
                <Metric label="Queued" value={String(snapshot.publishingQueue.length)} />
                <Metric label="SEO ops" value={String(snapshot.seoOpportunities.length)} />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <SwitchRow
                  label="Emergency pause"
                  active={snapshot.settings.emergencyPaused}
                  danger
                  onToggle={() => void patchSettings({ emergencyPaused: !snapshot.settings.emergencyPaused })}
                />
                <SwitchRow
                  label="Autopublish"
                  active={snapshot.settings.autopublishEnabled}
                  onToggle={() => void patchSettings({ autopublishEnabled: !snapshot.settings.autopublishEnabled })}
                />
              </div>
            </Panel>

            <Panel title="Credential Status" icon={<Database size={18} />}>
              <div className="grid gap-2">
                {snapshot.platformCredentials.map((credential) => (
                  <div key={credential.platform} className="flex items-center justify-between rounded-md border border-line px-3 py-2 text-sm">
                    <span className="font-medium">{credential.platform}</span>
                    <span className={credential.configured ? "text-teal" : "text-amber"}>
                      {credential.configured ? "configured" : `missing ${credential.missingKeys.length}`}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
          </section>

          <section id="content" className="mt-5">
            <Panel title="Generated Content" icon={<FileText size={18} />}>
              <Toolbar query={query} setQuery={setQuery} filter={filter} setFilter={setFilter} snapshot={snapshot} />
              <Table
                rows={filteredContent.map((item) => [
                  item.brand,
                  item.platform ?? "none",
                  item.content_type,
                  <Link key={item.id} className="font-medium text-teal hover:underline" href={`/admin/seo-automation/content/${encodeURIComponent(item.id)}`}>
                    {item.title}
                  </Link>,
                  `${item.quality_score}`,
                  item.safety_status,
                  item.status,
                ])}
                headers={["Brand", "Platform", "Type", "Title", "Score", "Safety", "Status"]}
              />
            </Panel>
          </section>

          <section id="queue" className="mt-5 grid gap-5 xl:grid-cols-2">
            <Panel title="Publishing Queue" icon={<RadioTower size={18} />}>
              <List
                empty="No queued content yet."
                items={snapshot.publishingQueue.slice(0, 8).map((item) => ({
                  title: item.title,
                  meta: `${item.brand} / ${item.platform ?? "no platform"} / ${item.status}`,
                  tone: item.status === "blocked" ? "danger" : "neutral",
                }))}
              />
            </Panel>
            <Panel title="Safety Warnings" icon={<AlertTriangle size={18} />}>
              <List
                empty="No active warnings."
                items={snapshot.generatedContent
                  .filter((item) => item.safety_status !== "approved")
                  .slice(0, 8)
                  .map((item) => ({
                    title: item.title,
                    meta: item.safety_reasons.join("; "),
                    tone: item.safety_status === "blocked" ? "danger" : "warning",
                  }))}
              />
            </Panel>
          </section>

          <section id="opportunities" className="mt-5">
            <Panel title="SEO And Authority Opportunities" icon={<Sparkles size={18} />}>
              <Table
                headers={["Brand", "Type", "Title", "Target", "Priority"]}
                rows={snapshot.seoOpportunities.slice(0, 14).map((item) => [item.brand, item.opportunity_type, item.title, item.target, `${item.priority_score}`])}
              />
            </Panel>
          </section>

          <section id="reports" className="mt-5 grid gap-5 xl:grid-cols-2">
            <Panel title="Weekly Reports" icon={<CalendarDays size={18} />}>
              <List
                empty="No reports generated yet."
                items={snapshot.weeklyReports.map((report) => ({
                  title: `${report.week_start.slice(0, 10)} to ${report.week_end.slice(0, 10)}`,
                  meta: JSON.stringify(report.summary).slice(0, 220),
                  tone: "neutral",
                }))}
              />
            </Panel>
            <Panel title="Agent Logs" icon={<Activity size={18} />}>
              <List
                empty="No logs yet."
                items={snapshot.logs.map((log) => ({
                  title: log.message,
                  meta: `${log.level} / ${new Date(log.created_at).toLocaleString()}`,
                  tone: log.level === "error" ? "danger" : log.level === "warn" ? "warning" : "neutral",
                }))}
              />
            </Panel>
          </section>

          <section id="settings" className="mt-5">
            <Panel title="Brand And Platform Controls" icon={<ShieldCheck size={18} />}>
              <div className="grid gap-5 xl:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold">Brands</h3>
                  <div className="mt-3 grid gap-2">
                    {Object.entries(snapshot.settings.brandEnabled).map(([brand, enabled]) => (
                      <SwitchRow
                        key={brand}
                        label={brand}
                        active={enabled}
                        onToggle={() => void patchSettings({ brandEnabled: { [brand]: !enabled } as AutomationSettings["brandEnabled"] })}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Platforms</h3>
                  <div className="mt-3 grid gap-2">
                    {Object.entries(snapshot.settings.platformEnabled).map(([platform, enabled]) => (
                      <SwitchRow
                        key={platform}
                        label={platform}
                        active={enabled}
                        onToggle={() => void patchSettings({ platformEnabled: { [platform]: !enabled } as AutomationSettings["platformEnabled"] })}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Panel>
          </section>
        </section>
      </div>
    </main>
  );
}

function IconButton({ label, icon, onClick, busy }: { label: string; icon: ReactNode; onClick: () => void; busy?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-md border border-line bg-panel px-3 py-2 text-sm font-medium text-ink hover:bg-white"
      title={label}
    >
      <span className={busy ? "animate-spin" : ""}>{icon}</span>
      {label}
    </button>
  );
}

function Panel({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-line bg-panel p-4 shadow-line">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-teal">{icon}</span>
        <h2 className="text-sm font-semibold uppercase tracking-normal text-ink">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Metric({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "good" | "danger" }) {
  const icon = tone === "danger" ? <XCircle size={16} /> : tone === "good" ? <CheckCircle2 size={16} /> : <Activity size={16} />;
  return (
    <div className="rounded-md border border-line px-3 py-3">
      <div className="flex items-center justify-between text-muted">
        <span className="text-xs">{label}</span>
        {icon}
      </div>
      <p className="mt-2 text-xl font-semibold">{value}</p>
    </div>
  );
}

function SwitchRow({ label, active, onToggle, danger }: { label: string; active: boolean; onToggle: () => void; danger?: boolean }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center justify-between rounded-md border border-line px-3 py-2 text-left text-sm hover:bg-soft"
    >
      <span className="font-medium">{label}</span>
      <span className={active ? (danger ? "text-danger" : "text-teal") : "text-muted"}>{active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}</span>
    </button>
  );
}

function Toolbar({
  query,
  setQuery,
  filter,
  setFilter,
  snapshot,
}: {
  query: string;
  setQuery: (value: string) => void;
  filter: string;
  setFilter: (value: string) => void;
  snapshot: DashboardSnapshot;
}) {
  const options = ["all", ...Object.keys(snapshot.settings.brandEnabled), ...Object.keys(snapshot.settings.platformEnabled), "queued", "blocked", "published"];
  return (
    <div className="mb-3 flex flex-col gap-2 sm:flex-row">
      <label className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-line px-3 py-2">
        <Search size={16} className="text-muted" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search content, brand, platform, status" className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none" />
      </label>
      <label className="flex items-center gap-2 rounded-md border border-line px-3 py-2">
        <Filter size={16} className="text-muted" />
        <select value={filter} onChange={(event) => setFilter(event.target.value)} className="bg-transparent text-sm outline-none">
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: ReactNode[][] }) {
  if (rows.length === 0) {
    return <p className="rounded-md border border-dashed border-line px-3 py-8 text-center text-sm text-muted">Nothing to show yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line text-xs uppercase text-muted">
            {headers.map((header) => (
              <th key={header} className="whitespace-nowrap px-3 py-2 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b border-line last:border-0">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="max-w-[340px] px-3 py-3 align-top text-sm text-ink">
                  <span className="line-clamp-2">{cell}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function List({ items, empty }: { items: Array<{ title: string; meta: string; tone: "neutral" | "warning" | "danger" }>; empty: string }) {
  if (items.length === 0) return <p className="rounded-md border border-dashed border-line px-3 py-8 text-center text-sm text-muted">{empty}</p>;
  return (
    <div className="grid gap-2">
      {items.map((item, index) => (
        <div key={`${item.title}-${index}`} className="rounded-md border border-line px-3 py-2">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium">{item.title}</p>
            <ExternalLink size={14} className="shrink-0 text-muted" />
          </div>
          <p className={item.tone === "danger" ? "mt-1 text-xs text-danger" : item.tone === "warning" ? "mt-1 text-xs text-amber" : "mt-1 text-xs text-muted"}>
            {item.meta}
          </p>
        </div>
      ))}
    </div>
  );
}
