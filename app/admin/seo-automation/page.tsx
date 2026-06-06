import { isAdminAuthenticated } from "@/lib/auth";
import { getDashboardSnapshot } from "@/lib/db/repository";
import { SeoAutomationDashboard } from "@/components/seo-automation-dashboard";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SeoAutomationPage() {
  const authenticated = await isAdminAuthenticated();
  const snapshot = authenticated ? await getDashboardSnapshot() : null;

  return <SeoAutomationDashboard authenticated={authenticated} initialSnapshot={snapshot} />;
}
