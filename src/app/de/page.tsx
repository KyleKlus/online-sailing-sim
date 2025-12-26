import type { Metadata, Viewport } from 'next'
import { siteConfig } from "../../siteConfig";
import Simulator from "../_components/SimulatorView";

export const metadata: Metadata = {
    ...siteConfig.metadata.de,
    openGraph: {
        ...siteConfig.metadata.de.openGraph,
        url: `${siteConfig.metadata.de.openGraph.url}/de`
    }
}

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
}

export default function Page() {
    return (
        <Simulator locale="de" />
    );
}