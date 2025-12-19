"use client";

import { useEffect, useRef, useState } from "react";
import styles from './Simulator.module.css';
import { useKeyPress } from "./hooks/useKeyPress";
import Ship from "./classes/Ship";
import Wind from "./classes/Wind";

export default function Simulator(props: { locale: 'en' | 'de' }) {
    const isWPressed = useKeyPress('w');
    const isSPressed = useKeyPress('s');
    const isAPressed = useKeyPress('a');
    const isDPressed = useKeyPress('d');
    const isTPressed = useKeyPress('t');

    const isAPressedRef = useRef(isAPressed);
    const isDPressedRef = useRef(isDPressed);
    const shipRef = useRef<Ship | null>(null);
    const windRef = useRef<Wind>(new Wind(0, 1));

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

    }, [isAPressed, isDPressed]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set canvas size
        canvasXSize.current = canvas.clientWidth;
        canvasYSize.current = canvas.clientHeight;
        canvas.width = canvasXSize.current;
        canvas.height = canvasYSize.current;

        // Initialize ship
        shipRef.current = new Ship({ x: canvasXSize.current / 2, y: canvasYSize.current / 2, orientation: 0 });

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

        const shipTopLeftX = shipRef.current.position.x - shipRef.current.length / 2;
        const shipTopLeftY = shipRef.current.position.y - shipRef.current.width / 2;

        const shipLength = shipRef.current.length;
        const shipWidth = shipRef.current.width;
        const shipBackRadius = shipWidth / 2;

        ctx.save();
        ctx.fillStyle = 'white';

        ctx.translate(shipTopLeftX, shipTopLeftY);
        ctx.rotate(shipRef.current.position.orientation * Math.PI / 180);
        ctx.fillRect(0, -shipWidth / 2, shipLength, shipWidth);

        ctx.beginPath();
        ctx.arc(0, 0, shipBackRadius, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(shipLength, 0, shipLength, shipWidth / 2, 0, 0, 2 * Math.PI);
        ctx.fill();

        ctx.restore();
    }

    function drawWind(ctx: CanvasRenderingContext2D) {
        if (!shipRef.current) return;

        const windMagnitude = Math.max(windRef.current.getSpeed() * 3, 15);

        ctx.save();
        ctx.translate(30, 30);
        ctx.rotate(windRef.current.orientation * Math.PI / 180);

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

        if (isAPressedRef.current && !isDPressedRef.current) {
            const newOrientation = shipRef.current.position.orientation - 5;
            shipRef.current.position.orientation = newOrientation < 0 ? 360 + newOrientation : newOrientation;
        }

        if (isDPressedRef.current && !isAPressedRef.current) {
            const newOrientation = shipRef.current.position.orientation + 5;
            shipRef.current.position.orientation = newOrientation > 360 ? newOrientation - 360 : newOrientation;
        }

        console.log(
            `Wind Orientation: ${windRef.current.getOrientation()}`,
            `Ship Orientation: ${shipRef.current.position.orientation}`,
            `Wind Power: ${(Math.abs(windRef.current.getOrientation() - shipRef.current.position.orientation))}`,
        );
        shipRef.current.updateShip(windRef.current);
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
        drawScene(context);

        // Request the next frame
        animationRef.current = requestAnimationFrame(() => {
            render();
        });
    }

    return (
        <div className={styles.simulator}>
            <canvas className={styles.simulatorView} ref={canvasRef} id='simulatorCanvas' />
        </div>
    );
}