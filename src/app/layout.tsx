/** @format */
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/lib/default-look.css';
import './globals.css';

import Main from '@/lib/container/Main';

import { Fira_Code } from "next/font/google";
import { ThemeProvider } from '@/lib/provider/theme-provider';
import ScrollToTargetButton from '@/lib/interaction/forms/buttons/ScrollToTargetButton';
import QuickInfoFooter from '@/lib/layouts/footer/QuickInfoFooter';
import AppHeader from '@/lib/layouts/header/AppHeader';

import Content from "@/lib/container/Content";

import styles from './Page.module.css';
import { KeyboardShortcutProvider } from './_components/contexts/KeyboardShortcutContext';

const firaCode = Fira_Code({ weight: '400', subsets: ['latin'] });

interface ILayoutProps {
    title?: string;
    className?: string;
}

export default function Layout(props: React.PropsWithChildren<ILayoutProps>) {
    return (
        <html style={{ fontFamily: firaCode.style.fontFamily }}>
            <body className={['theme-print-bg'].join(' ')}>
                <ThemeProvider>
                    <KeyboardShortcutProvider>
                        <AppHeader />
                        <Main>
                            <ScrollToTargetButton targetElementId='top' />
                            <div id={'top'}></div>
                            <Content className={[styles.simPage, 'applyBottomPadding'].join(' ')}>
                                {props.children}
                            </Content>
                            <QuickInfoFooter className='grainy-coarse-bg' />
                        </Main>
                    </KeyboardShortcutProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}