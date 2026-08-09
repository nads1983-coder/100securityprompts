export const amazonAffiliateConfig = {
  baseDomain: "https://www.amazon.co.uk",
  storeId: "npierreltd1-21",
  disclosure:
    "As an Amazon Associate, Nadine Pierre LTD earns from qualifying purchases. This does not affect the price you pay.",
  rel: "sponsored nofollow noopener noreferrer",
  target: "_blank",
} as const;

export function buildAmazonUkSearchUrl(searchTerm: string) {
  const url = new URL("/s", amazonAffiliateConfig.baseDomain);
  url.searchParams.set("k", searchTerm);
  url.searchParams.set("tag", amazonAffiliateConfig.storeId);

  return url.toString();
}

export function amazonAffiliateLinkProps() {
  return {
    rel: amazonAffiliateConfig.rel,
    target: amazonAffiliateConfig.target,
  } as const;
}
