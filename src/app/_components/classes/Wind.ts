class Wind {
    orientation: number; // in degrees
    speed: number; // in knots
    maxSpeed: number = 10; // maximum wind speed in knots
    lastModification: number = 0;
    lastModificationInterval: number = 5 * 30; // in milliseconds

    constructor(orientation: number, speed: number) {
        this.orientation = orientation;
        this.speed = speed;
    }

    getOrientation(): number {
        return this.orientation;
    }

    getSpeed(): number {
        return this.speed;
    }

    modifyWind() {
        this.lastModification = this.lastModification + 1;
        if (this.lastModification < this.lastModificationInterval) {
            return;
        }

        this.lastModification = 0;

        const orientationChange = Math.random() > 0.5 ? 1 : -1;
        const speedChange = Math.random() > 0.5 ? 1 : -1;

        const newOrientation = this.orientation + orientationChange;
        if (newOrientation < 0) {
            this.orientation = 360 + newOrientation;
        } else if (newOrientation > 360) {
            this.orientation = newOrientation - 360;
        } else {
            this.orientation = newOrientation;
        }

        this.speed = Math.min(Math.max(this.speed + speedChange, 1), this.maxSpeed);
    }
}

export default Wind;