import { convertToRadians } from "../handlers/converter";
import Sail from "./Sail";
import Vector2D from "./Vector2D";
import Wind from "./Wind";

class Ship {
    public width: number = 5; // in meters
    public depth: number = 4; // in meters
    public length: number = 15; // in meters

    private frontResistance: number = 0.002; // resistance factor per area
    private backwardResistance: number = 0.4; // resistance
    private keelResistance: number = 1; // How much the keel resists lateral movement
    private accelerationFactor: number = 0.008; // acceleration factor

    private isAnchored: boolean = true;
    private sail: Sail;
    private positionVector: Vector2D;
    private orientationVector: Vector2D;
    private speedScaledOrientationVector: Vector2D;
    private keelResistanceVector: Vector2D = new Vector2D(0, 0);
    private accelerationVector: Vector2D = new Vector2D(0, 0);
    private dragVector: Vector2D = new Vector2D(0, 0);

    constructor(x: number, y: number, defaultOrientation: number) {
        this.positionVector = new Vector2D(x, y);
        const defaultOrientationInRad = convertToRadians(defaultOrientation);
        this.orientationVector = new Vector2D(Math.cos(defaultOrientationInRad), Math.sin(defaultOrientationInRad));
        this.speedScaledOrientationVector = this.orientationVector.clone().scale(0);
        this.sail = new Sail(5, 0, 0, 180, this.orientationVector.clone());
    }

    getSail(): Sail {
        return this.sail;
    }

    getPositionVector(): Vector2D {
        return this.positionVector.clone();
    }

    getSpeedVector(): Vector2D {
        return this.speedScaledOrientationVector.clone();
    }

    getKeelResistanceVector(): Vector2D {
        return this.keelResistanceVector.clone();
    }

    getDragVector(): Vector2D {
        return this.dragVector.clone();
    }

    getAccelerationVector(): Vector2D {
        return this.accelerationVector.clone();
    }

    getShipOrientationVector(): Vector2D {
        return this.orientationVector.clone();
    }

    getAnchorState(): boolean {
        return this.isAnchored;
    }

    turnLeft() {
        const changeInRad = -convertToRadians(1);
        this.orientationVector = this.orientationVector.rotate(changeInRad);
        this.speedScaledOrientationVector = this.speedScaledOrientationVector.rotate(changeInRad);
        this.sail.applyShipOrientationChange(changeInRad);
    }

    turnRight() {
        const changeInRad = convertToRadians(1);
        this.orientationVector = this.orientationVector.rotate(changeInRad);
        this.speedScaledOrientationVector = this.speedScaledOrientationVector.rotate(changeInRad);
        this.sail.applyShipOrientationChange(changeInRad);
    }

    anchor() {
        if (this.isAnchored || this.speedScaledOrientationVector.length() > 0) {
            return;
        }
        this.isAnchored = true;
    }

    release() {
        this.isAnchored = false;
    }

    toggleAnchor() {
        if (this.speedScaledOrientationVector.length() > 0) {
            return;
        }

        if (this.isAnchored) {
            this.release();
        }
        else {
            this.anchor();
        }
    }

    applyWind(wind: Wind, canvasXSize: number, canvasYSize: number, debugStationary: boolean = false) {
        if (this.isAnchored && !debugStationary) {
            return;
        }

        // Calculate wind effect on sail
        this.sail.applyWind(wind);
        this.applyWindEffect();
        this.applyDrag();

        if (!debugStationary) {
            this.positionVector = this.positionVector.add(this.speedScaledOrientationVector.scale(wind.speedScale));
        }

        // Keep ship within bounds
        this.applyMapBounds(canvasXSize, canvasYSize);
    }

    private applyMapBounds(canvasXSize: number, canvasYSize: number) {
        this.positionVector.x = this.positionVector.x < 0 ? canvasXSize : this.positionVector.x;
        this.positionVector.x = this.positionVector.x > canvasXSize ? 0 : this.positionVector.x;

        this.positionVector.y = this.positionVector.y < 0 ? canvasYSize : this.positionVector.y;
        this.positionVector.y = this.positionVector.y > canvasYSize ? 0 : this.positionVector.y;
    }

    private calculateKeelResistanceVector(windEffectVector: Vector2D): Vector2D {
        const speedScaledNormalOrientationVector = this.orientationVector.clone().rotate(-Math.PI / 2);
        const keelResistanceVector = speedScaledNormalOrientationVector.clone().scale(
            speedScaledNormalOrientationVector.clone().dot(windEffectVector) * this.keelResistance
        );
        return keelResistanceVector;
    }

    private applyWindEffect() {
        const windEffectVector = this.sail.getWindEffectVector();

        this.keelResistanceVector = this.calculateKeelResistanceVector(windEffectVector);

        // Update speed vector
        const maxSpeedVector = windEffectVector.subtract(this.keelResistanceVector);
        let accelerationVector = windEffectVector.subtract(this.keelResistanceVector);
        accelerationVector = accelerationVector.scale(accelerationVector.signedLength() * this.accelerationFactor);
        this.accelerationVector = accelerationVector.clone();
        this.speedScaledOrientationVector = this.speedScaledOrientationVector.add(accelerationVector);

        this.speedScaledOrientationVector = this.speedScaledOrientationVector.signedLength() > maxSpeedVector.signedLength()
            ? maxSpeedVector.clone()
            : this.speedScaledOrientationVector.clone();
    }

    private applyDrag() {
        // gets the drag vector
        let dragVector = this.speedScaledOrientationVector.clone().rotate(Math.PI).normalize();

        if (this.speedScaledOrientationVector.signedLength() < 0) {
            dragVector = dragVector.normalize().scale(this.backwardResistance * this.width * this.depth);
        } else {
            dragVector = dragVector.normalize().scale(this.frontResistance * this.width * this.depth);
        }

        this.dragVector = dragVector.clone();

        const preDragSpeed = this.speedScaledOrientationVector.signedLength();
        let modifiedSpeedVector = this.speedScaledOrientationVector.add(dragVector);
        if (
            (preDragSpeed > 0 && modifiedSpeedVector.signedLength() < 0) ||
            (preDragSpeed < 0 && modifiedSpeedVector.signedLength() > 0) ||
            modifiedSpeedVector.signedLength().toString() === 'NaN' ||
            modifiedSpeedVector.length() <= 0.1
        ) {
            modifiedSpeedVector = new Vector2D(0, 0);
        }

        this.speedScaledOrientationVector = modifiedSpeedVector.signedLength().toString() === 'NaN'
            ? new Vector2D(0, 0)
            : modifiedSpeedVector.clone();
    }
}

export default Ship;