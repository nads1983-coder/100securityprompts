import { redirect } from "next/navigation";

type InsightsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function InsightPostPage({ params }: InsightsPageProps) {
  const { slug } = await params;

  redirect(`/blog/${slug}`);
}
