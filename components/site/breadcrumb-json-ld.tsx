import { siteUrl } from "@/lib/site/content";

type Crumb = {
  name: string;
  path: string;
};

export function BreadcrumbJsonLd({ crumbs }: { crumbs: Crumb[] }) {
  const itemListElement = crumbs.map((crumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: crumb.name,
    item: `${siteUrl}${crumb.path}`,
  }));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement,
        }),
      }}
    />
  );
}
