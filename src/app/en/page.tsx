import type { Metadata, Viewport } from 'next'
import { siteConfig } from "../../siteConfig";
import Simulator from "../_components/Simulator";

export const metadata: Metadata = {
    ...siteConfig.metadata.en,
    openGraph: {
        ...siteConfig.metadata.en.openGraph,
        url: `${siteConfig.metadata.en.openGraph.url}/en`
    }
}

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
}

export default function Page() {
    return (
        <Simulator locale="en" />
    );
}