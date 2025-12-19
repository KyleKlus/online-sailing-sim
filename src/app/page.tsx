import Content from "@/lib/container/Content";

import type { Metadata, Viewport } from 'next'
import styles from './Page.module.css';
import Tools from "./_components/Tools";
import { siteConfig } from "../siteConfig";

export const metadata: Metadata = {
    ...siteConfig.metadata.en,
}

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
}

export default function Page() {
    return (
        <Content className={[styles.toolPage, 'applyHeaderOffset', 'applyBottomPadding', 'crossed'].join(' ')}>
            <h1>QR Code Generator</h1>
            <Tools locale="en" />
        </Content>
    );
}