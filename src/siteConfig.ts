import { defaultSiteConfig } from "@/lib/defaultSiteConfig";

const basePath: string = '/online-sailing-sim';
const metadataEn = {
    title: "Kyle Klus | Sailing Sim",
    description: "A simple sailing simulator.",
    keywords: ["online games", "free games", "free", "games", "sailing", "sailing simulator", "kyle klus"],
    abstract: "A simple Sailing Sim.",
    applicationName: "Sailing Sim",
    category: "games",
    classification: "sailing simulator",
    openGraph: {
        type: "website",
        locale: "en_US",
        countryName: "US",
        url: `${defaultSiteConfig.url}${basePath}`,
        title: "Kyle Klus | Sailing Sim",
        description: "A simple Sailing Sim.",
    },
    authors: [{ name: defaultSiteConfig.author, url: defaultSiteConfig.url }],
    creator: defaultSiteConfig.author,
    publisher: defaultSiteConfig.author,
}

export const siteConfig = {
    ...defaultSiteConfig,
    basePath,
    metadata: {
        en: metadataEn,
        de: {
            ...metadataEn,
            description: "Ein einfacher Segel Simulator.",
            keywords: ["online spiele", "kostenlose spiele", "kostenlos", "spiele", "segeln", "segel simulator", "kyle klus"],
            abstract: "Ein einfacher Segel Simulator.",
            category: "Spiele",
            openGraph: {
                ...metadataEn.openGraph,
                locale: "de_DE",
                countryName: "DE",
                description: "Ein einfacher Segel Simulator.",
            },
        }
    }
};