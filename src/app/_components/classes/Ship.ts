import { IPosition } from "../interfaces/IPosition";
import Wind from "./Wind";

class Ship {
    width: number = 5; // in meters
    length: number = 15; // in meters
    position: IPosition;
    speed: number = 0; // in knots
    maxSpeed: number = 10; // maximum ship speed in knots
    isAnchored: boolean = true;

    constructor(position: IPosition) {
        this.position = position;
    }

    getPosition(): IPosition {
        return this.position;
    }

    getSpeed(): number {
        return this.speed;
    }

    anchor() {
        this.isAnchored = true;
        this.speed = 0;
    }

    release() {
        this.isAnchored = false;
    }

    toggleAnchor() {
        if (this.isAnchored) {
            this.release();
        }
        else {
            this.anchor();
        }
    }

    updateShip(wind: Wind) {
        if (this.isAnchored) {
            return;
        }

        const orientationDiff = Math.abs(this.position.orientation - wind.getOrientation());

        this.speed = Math.min((1 - (orientationDiff / 360)) * (wind.getSpeed() / 10), this.maxSpeed);

        this.position.x += this.speed * Math.cos(this.position.orientation * Math.PI / 180);
        this.position.y += this.speed * Math.sin(this.position.orientation * Math.PI / 180);
    }
}

export default Ship;