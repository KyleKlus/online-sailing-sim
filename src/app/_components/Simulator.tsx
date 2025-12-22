"use client";

import { useEffect, useRef, useState } from "react";
import styles from './Simulator.module.css';
import { useKeyPress } from "./hooks/useKeyPress";
import Ship from "./classes/Ship";
import Wind from "./classes/Wind";
import Vector2D from "./classes/Vector2D";

export default function Simulator(props: { locale: 'en' | 'de' }) {
    const scale = 4;

    const [infoText, setInfoText] = useState<string>('');

    const isWPressed = useKeyPress('w');
    const isSPressed = useKeyPress('s');
    const isAPressed = useKeyPress('a');
    const isDPressed = useKeyPress('d');
    const isKPressed = useKeyPress('k');
    const isLPressed = useKeyPress('l');
    const isTPressed = useKeyPress('t');

    const isAPressedRef = useRef(isAPressed);
    const isDPressedRef = useRef(isDPressed);
    const isWPressedRef = useRef(isWPressed);
    const isSPressedRef = useRef(isSPressed);
    const isKPressedRef = useRef(isKPressed);
    const isLPressedRef = useRef(isLPressed);

    const shipRef = useRef<Ship | null>(null);
    const windRef = useRef<Wind>(new Wind(90, 1));

    const animationRef = useRef<number | null>(null);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvasXSize = useRef(canvasRef.current?.clientWidth || 0);
    const canvasYSize = useRef(canvasRef.current?.clientHeight || 0);

    useEffect(() => {
        if (isTPressed && shipRef.current) {
            shipRef.current.toggleAnchor();
        }
    }, [isTPressed]);


    useEffect(() => {
        if (!shipRef.current) return;

        isAPressedRef.current = isAPressed;
        isDPressedRef.current = isDPressed;
        isWPressedRef.current = isWPressed;
        isSPressedRef.current = isSPressed;
        isKPressedRef.current = isKPressed;
        isLPressedRef.current = isLPressed;

    }, [isAPressed, isDPressed, isWPressed, isSPressed, isKPressed, isLPressed]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set canvas size
        canvasXSize.current = canvas.clientWidth;
        canvasYSize.current = canvas.clientHeight;
        canvas.width = canvasXSize.current;
        canvas.height = canvasYSize.current;

        // Initialize ship
        shipRef.current = new Ship(canvasXSize.current / 2, canvasYSize.current / 2, 0);

        // Start the animation
        render();

        // Clean up on component unmount
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    function drawShip(ctx: CanvasRenderingContext2D) {
        if (!shipRef.current) return;

        const shipTopLeftX = -(shipRef.current.length / 2) * scale;
        const shipTopLeftY = 0;

        const shipLength = shipRef.current.length * scale;
        const shipWidth = shipRef.current.width * scale;
        const shipBackRadius = shipWidth / 2;

        const shipOrientationVector = shipRef.current.getShipOrientationVector();
        const shipPositionVector = shipRef.current.getPositionVector();

        ctx.save();
        ctx.fillStyle = 'white';

        ctx.translate(shipPositionVector.x, shipPositionVector.y);
        ctx.rotate(shipOrientationVector.getAngleInRad());
        ctx.translate(shipTopLeftX, shipTopLeftY);

        ctx.fillRect(-shipLength / 3, -shipWidth / 2, shipLength, shipWidth);

        ctx.beginPath();
        ctx.arc(-shipLength / 3, 0, shipBackRadius, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(shipLength / 2, 0, shipLength, shipWidth / 2, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
        drawSail(ctx, scale);

        drawVector(ctx, 'green', shipRef.current.getAccelerationVector());
        drawVector(ctx, 'red', shipRef.current.getDragVector(), 5);
        drawVector(ctx, 'orange', shipRef.current.getKeelResistanceVector());

        drawVector(ctx, 'black', shipRef.current.getSpeedVector());
        drawVector(ctx, 'blue', shipRef.current.getSail().getWindEffectVector());
    }

    function drawVector(ctx: CanvasRenderingContext2D, color: string, vector: Vector2D, enhancedLength: number = 1) {
        if (!shipRef.current) return;

        const shipLength = vector.length() * scale * enhancedLength;
        const shipWidth = 1 * scale;
        const shipBackRadius = shipWidth / 2;

        ctx.save();
        ctx.fillStyle = color;

        ctx.translate(canvasXSize.current / 2, canvasYSize.current / 2);
        ctx.rotate(vector.getAngleInRad());
        ctx.fillRect(0, -shipWidth / 2, shipLength, shipWidth);

        ctx.beginPath();
        ctx.arc(0, 0, shipBackRadius, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(shipLength, 0, Math.abs(shipLength), shipWidth / 2, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }

    function drawSail(ctx: CanvasRenderingContext2D, scale: number) {
        if (!shipRef.current) return;

        const sailLength = shipRef.current.getSail().sailLength * scale;
        const sailWidth = shipRef.current.getSail().sailWidth * scale;
        const sailBackRadius = sailWidth / 2;

        const shipTopLeftX = shipRef.current.getPositionVector().x;
        const shipTopLeftY = shipRef.current.getPositionVector().y;

        const sailVector = shipRef.current.getSail().getSailVector();

        ctx.save();
        ctx.fillStyle = 'brown';

        ctx.translate(shipTopLeftX, shipTopLeftY);
        ctx.rotate((sailVector.getAngleInRad()));
        ctx.fillRect(0, -sailWidth / 2, sailLength, sailWidth);

        ctx.beginPath();
        ctx.arc(0, 0, sailBackRadius, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(sailLength, 0, sailLength, sailWidth / 2, 0, 0, 2 * Math.PI);
        ctx.fill();

        ctx.restore();
    }

    function drawWind(ctx: CanvasRenderingContext2D) {
        if (!shipRef.current) return;

        const windVector = windRef.current.getVector();
        const windMagnitude = Math.max(windVector.length(), 3) * scale;

        ctx.save();
        ctx.translate(50, 50);
        ctx.rotate(windVector.getAngleInRad());

        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.ellipse(windMagnitude, 0, windMagnitude, 4 / 2, 0, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = 'red';

        ctx.fillRect(0, -4 / 2, windMagnitude / 3, 4);
        ctx.fillStyle = 'white';
        ctx.fillRect(windMagnitude / 3, -4 / 2, windMagnitude / 3, 4);
        ctx.fillStyle = 'red';
        ctx.fillRect(windMagnitude * 2 / 3, -4 / 2, windMagnitude / 3, 4);

        ctx.restore();
    }

    function drawScene(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, canvasXSize.current, canvasYSize.current);
        drawWind(ctx);
        drawShip(ctx);
    }

    function calcScene() {
        windRef.current.modifyWind();
        if (!shipRef.current) return;
        const shipOrientationVector = shipRef.current.getShipOrientationVector();

        if (isAPressedRef.current && !isDPressedRef.current) {
            shipRef.current.turnLeft();
        }

        if (isDPressedRef.current && !isAPressedRef.current) {
            shipRef.current.turnRight();
        }

        if (isWPressedRef.current && !isSPressedRef.current) {
            shipRef.current.getSail().furlSail();
        }

        if (isSPressedRef.current && !isWPressedRef.current) {
            shipRef.current.getSail().unfurlSail();
        }

        if (isKPressedRef.current && !isLPressedRef.current) {
            shipRef.current.getSail().increaseOrientation();
        }

        if (isLPressedRef.current && !isKPressedRef.current) {
            shipRef.current.getSail().decreaseOrientation();
        }

        shipRef.current.applyWind(windRef.current, canvasXSize.current, canvasYSize.current, true);
    }

    function setText() {
        if (!shipRef.current) return;

        const anchorStateText = shipRef.current.getAnchorState()
            ? (props.locale === 'de' ? 'Anker gelichtet' : 'Anchor dropped')
            : (props.locale === 'de' ? 'Anker gesetzt' : 'Anchor raised');

        const sailFurledRatioText = `Sail Open: ${Math.round(shipRef.current.getSail().getUnFurledRatio() * 100)}%`;

        const sailOrientationText = `Sail Angle: ${shipRef.current.getSail().getSailVector().getAngleInDeg()}°`;

        const shipOrientationText = `Ship Angle: ${shipRef.current.getShipOrientationVector().getAngleInDeg()}°`;

        const speedText = `Speed: ${shipRef.current.getSpeedVector().signedLength()}kn`;

        const positionText = `Position: ${Math.round(shipRef.current.getPositionVector().x * 10) / 10}m, ${Math.round(shipRef.current.getPositionVector().y * 10) / 10}m`;

        const windOrientationText = `Wind Angle: ${windRef.current.getVector().getAngleInDeg()}°`;

        const windSpeedText = `Wind Speed: ${Math.round(windRef.current.getVector().length() * 10) / 10}kn`;

        setInfoText(`${anchorStateText} | ${sailFurledRatioText} | ${sailOrientationText} | ${shipOrientationText} | ${speedText} | ${positionText} | ${windOrientationText} | ${windSpeedText}`);
    }

    function render() {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvasXSize.current = canvas.clientWidth;
        canvasYSize.current = canvas.clientHeight;
        const pixelRatio = window.devicePixelRatio || 1; // Get device pixel ratio

        canvas.width = canvasXSize.current * pixelRatio; // Set width to pixel value
        canvas.height = canvasYSize.current * pixelRatio; // Set height to pixel value

        // Scale the context to account for pixel ratio
        const context = canvas.getContext('2d');
        if (context) {
            context.scale(pixelRatio, pixelRatio);
        }

        // Clear the canvas
        if (!context) return;

        calcScene();
        setText();
        drawScene(context);

        // Request the next frame
        animationRef.current = requestAnimationFrame(() => {
            render();
        });
    }

    return (
        <div className={styles.simulator}>
            <canvas className={styles.simulatorView} ref={canvasRef} id='simulatorCanvas' />
            <div className={styles.simulatorInfo}>
                <p>{infoText}</p>
            </div>
        </div>
    );
}