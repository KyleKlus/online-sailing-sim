import { convertToRadians } from "../handlers/converter";
import Vector2D from "./Vector2D";

class Wind {
    private windVector: Vector2D;
    private maxSpeed: number = 20; // maximum wind speed in knots
    private minSpeed: number = 3; // minimum wind speed in knots
    private lastModification: number = 0;
    private lastModificationInterval: number = 1 * 30; // in milliseconds

    constructor(orientation: number, speed: number) {
        const rad = convertToRadians(orientation);
        this.windVector = new Vector2D(Math.cos(rad) * speed, Math.sin(rad) * speed);
    }

    getVector(): Vector2D {
        return this.windVector.clone();
    }

    modifyWind() {
        // Modify wind every 30 Frames
        this.lastModification = this.lastModification + 1;
        if (this.lastModification < this.lastModificationInterval) {
            return;
        }

        this.lastModification = 0;

        const orientationChangeInDeg = Math.random() > 0.5 ? 1 : -1;
        const speedChange = Math.random() > 0.5 ? 1 : -1;

        let newOrientationInDeg = this.windVector.getAngleInDeg() + orientationChangeInDeg;
        if (newOrientationInDeg < 0) {
            newOrientationInDeg = 360 + newOrientationInDeg;
        } else if (newOrientationInDeg > 360) {
            newOrientationInDeg = newOrientationInDeg - 360;
        }

        const newSpeed = Math.min(Math.max(this.windVector.signedLength() + speedChange, this.minSpeed), this.maxSpeed);

        const newVector = new Vector2D(newSpeed, 0).rotate(convertToRadians(newOrientationInDeg));

        this.windVector = newVector.clone();
    }
}

export default Wind;