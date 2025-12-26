"use client";

import { useEffect, useRef, useState } from "react";
import styles from './SimulatorView.module.css';
import { useKeyPress } from "./hooks/useKeyPress";
import Ship from "./classes/Ship";
import Wind from "./classes/Wind";
import Simulator from "./classes/Simulator";

export default function SimulatorView(props: { locale: 'en' | 'de' }) {
    const [infoText, setInfoText] = useState<string>('');

    const isWPressed = useKeyPress('w');
    const isSPressed = useKeyPress('s');
    const isAPressed = useKeyPress('a');
    const isDPressed = useKeyPress('d');
    const isKPressed = useKeyPress('k');
    const isLPressed = useKeyPress('l');
    const isTPressed = useKeyPress('t');

    const simulatorRef = useRef<Simulator | null>(null);

    useEffect(() => {
        if (!simulatorRef.current) return;
        simulatorRef.current.setKeyPress([isWPressed, isSPressed, isAPressed, isDPressed, isKPressed, isLPressed, isTPressed]);

    }, [isAPressed, isDPressed, isWPressed, isSPressed, isKPressed, isLPressed, isTPressed]);

    useEffect(() => {
        simulatorRef.current = new Simulator((ship: Ship, wind: Wind) => {
            setText(ship, wind);
        });

        simulatorRef.current.start();

        // Clean up on component unmount
        return () => {
            if (!simulatorRef.current) throw new Error('Simulator not initialized & was not started');
            simulatorRef.current.stop();
        };
    }, []);

    function setText(ship: Ship, wind: Wind) {
        const anchorStateText = ship.getAnchorState()
            ? (props.locale === 'de' ? 'Anker gelichtet' : 'Anchor dropped')
            : (props.locale === 'de' ? 'Anker gesetzt' : 'Anchor raised');

        const sailFurledRatioText = `Sail Open: ${Math.round(ship.getSail().getUnFurledRatio() * 100)}%`;

        const sailOrientationText = `Sail Angle: ${ship.getSail().getSailVector().getAngleInDeg().toFixed(0)}°`;

        const shipOrientationText = `Ship Angle: ${ship.getShipOrientationVector().getAngleInDeg().toFixed(0)}°`;

        const speedText = `Speed: ${(ship.getSpeedVector().signedLength()).toFixed(2)}kn`;

        const positionText = `Position: ${ship.getPositionVector().x.toFixed(1)}m, ${ship.getPositionVector().y.toFixed(1)}m`;

        const windOrientationText = `Wind Angle: ${wind.getVector().getAngleInDeg().toFixed(0)}°`;

        const windSpeedText = `Wind Speed: ${(wind.getVector().length()).toFixed(2)}kn`;

        setInfoText(`${anchorStateText} | ${sailFurledRatioText} | ${sailOrientationText} | ${shipOrientationText} | ${speedText} | ${positionText} | ${windOrientationText} | ${windSpeedText}`);
    }

    return (
        <div className={styles.simulator}>
            <canvas className={styles.simulatorView} id='simulatorCanvas' />
            <div className={styles.simulatorInfo}>
                <p>{infoText}</p>
            </div>
        </div>
    );
}