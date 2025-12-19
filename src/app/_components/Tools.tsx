"use client";

import { useState } from "react";
import styles from './Tools.module.css';

export default function Tools(props: { locale: 'en' | 'de' }) {
    return (
        <div className={styles.tools}>
            <div className={styles.toolPage}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1.5rem' }}>
                    <div className={styles.donationContainer}>
                        {props.locale === 'de'
                            ? <>
                                <div>Du magst dieses Tool?</div>
                                <a
                                    href='https://ko-fi.com/W7W1D5JTZ'
                                    target='_blank'
                                    className={styles.donateButton}
                                >
                                    Spende ☕
                                </a>
                            </>
                            : <>
                                <div>Like this tool?</div>
                                <a
                                    href='https://ko-fi.com/W7W1D5JTZ'
                                    target='_blank'
                                    className={styles.donateButton}
                                >
                                    Donate ☕
                                </a>
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}