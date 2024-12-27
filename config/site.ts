export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Solid Catalog",
  description: "A catalog of the Solid Ecosystem",
  navItems: [],
  navMenuItems: [],
  links: {
    github: "https://github.com/jeswr/solid-catalog",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};

export const baseCatalogIri = "http://example.org/catalog#";
export const catalogIri = baseCatalogIri + "catalog";
