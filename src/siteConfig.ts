import { defaultSiteConfig } from "@/lib/defaultSiteConfig";

const basePath: string = '/qr-code-generator';
const metadataEn = {
    title: "Kyle Klus | QR Code Generator",
    description: "A simple QR Code generator.",
    keywords: ["qr code", "qr code generator", "kyle klus", "tools", "online tools", "free tools",],
    abstract: "A simple QR Code generator.",
    applicationName: "QR Code Generator",
    category: "tools",
    classification: "qr code generator",
    openGraph: {
        type: "website",
        locale: "en_US",
        countryName: "US",
        url: `${defaultSiteConfig.url}${basePath}`,
        title: "Kyle Klus | QR Code Generator",
        description: "A simple QR Code generator.",
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
            description: "Ein einfacher QR Code Generator.",
            keywords: ["online tools", "free tools", "gratis", "kostenlos", "werkzeuge", "qr code", "qr code generator", "kyle klus"],
            abstract: "Ein einfacher QR Code Generator.",
            category: "werkzeuge",
            openGraph: {
                ...metadataEn.openGraph,
                locale: "de_DE",
                countryName: "DE",
                description: "Ein einfacher QR Code Generator.",
            },
        }
    }
};