import { convertToRadians } from "../handlers/converter";
import Vector2D from "./Vector2D";
import Wind from "./Wind";

class Sail {
    public sailLength: number = 8; // in meters
    public sailWidth: number = 2; // in meters

    private shipOrientationVector: Vector2D;

    private sailVector: Vector2D;
    private sailNormalVector: Vector2D;
    private windScaledNormalVector: Vector2D;

    private orientationBoundsLeftVector: Vector2D;
    private orientationBoundsRightVector: Vector2D;
    private boundsError: number = 0.08;

    private minUnFurledRatio: number = 0;
    private unFurledRatio: number = 0;
    private maxUnFurledRatio: number = 1;
    private defaultFurlingDelta: number = 0.01;

    constructor(sailOffsetX: number, sailOffsetY: number, defaultUnFurledRatio: number, defaultOrientation: number, shipOrientationVector: Vector2D) {
        this.unFurledRatio = defaultUnFurledRatio;
        this.shipOrientationVector = shipOrientationVector;
        this.orientationBoundsLeftVector = shipOrientationVector.clone().rotate(-Math.PI / 2);
        this.orientationBoundsRightVector = shipOrientationVector.clone().rotate(Math.PI / 2);
        const defaultOrientationBasedOnShipOrientation = defaultOrientation + this.shipOrientationVector.getAngleInDeg();
        this.sailVector = new Vector2D(Math.cos(convertToRadians(defaultOrientationBasedOnShipOrientation)), Math.sin(convertToRadians(defaultOrientationBasedOnShipOrientation)));
        const normalOrientationInRad = convertToRadians(defaultOrientationBasedOnShipOrientation + 90);
        this.sailNormalVector = new Vector2D(Math.cos(normalOrientationInRad), Math.sin(normalOrientationInRad));
        this.windScaledNormalVector = this.sailNormalVector.clone().scale(0);
    }

    getUnFurledRatio(): number {
        return this.unFurledRatio;
    }

    furlSail() {
        this.unFurledRatio = Math.min(this.unFurledRatio + this.defaultFurlingDelta, this.maxUnFurledRatio);
    }

    unfurlSail() {
        this.unFurledRatio = Math.max(this.unFurledRatio - this.defaultFurlingDelta, this.minUnFurledRatio);
    }

    increaseOrientation() {
        if (this.orientationBoundsLeftVector.subtract(this.sailVector.rotate(convertToRadians(1))).length() <= this.boundsError) {
            return;
        }

        this.sailVector = this.sailVector.rotate(convertToRadians(1));
        this.adjustNormalVectorsToSailOrientation();
    }

    decreaseOrientation() {
        if (this.orientationBoundsRightVector.subtract(this.sailVector.rotate(-convertToRadians(1))).length() <= this.boundsError) {
            return;
        }

        this.sailVector = this.sailVector.rotate(-convertToRadians(1));
        this.adjustNormalVectorsToSailOrientation();
    }

    getOrientationBoundsLeftVector(): Vector2D {
        return this.orientationBoundsLeftVector.clone();
    }

    getOrientationBoundsRightVector(): Vector2D {
        return this.orientationBoundsRightVector.clone();
    }

    getSailVector(): Vector2D {
        return this.sailVector.clone();
    }

    getSailNormalVector(): Vector2D {
        return this.sailNormalVector.clone();
    }

    getWindEffectVector(): Vector2D {
        return this.windScaledNormalVector.clone();
    }

    applyShipOrientationChange(changeInRad: number) {
        this.shipOrientationVector = this.shipOrientationVector.rotate(changeInRad);
        this.orientationBoundsLeftVector = this.orientationBoundsLeftVector.rotate(changeInRad);
        this.orientationBoundsRightVector = this.orientationBoundsRightVector.rotate(changeInRad);
        this.sailVector = this.sailVector.rotate(changeInRad);
        this.adjustNormalVectorsToSailOrientation();
    }

    applyWind(wind: Wind) {
        const windVector = wind.getVector();
        const windScaledNormalAccelleration = windVector.dot(this.sailNormalVector) * this.unFurledRatio;
        this.windScaledNormalVector = this.sailNormalVector.clone().normalize().scale(windScaledNormalAccelleration);
    }

    private adjustNormalVectorsToSailOrientation() {
        const flipNormalVector = this.shipOrientationVector.subtract(this.sailVector.clone().rotate(Math.PI / 2)).length() >= 1.4;
        this.sailNormalVector = this.sailVector.clone().rotate(flipNormalVector ? -Math.PI / 2 : Math.PI / 2);
        this.windScaledNormalVector = this.sailNormalVector.clone().scale(this.windScaledNormalVector.signedLength());
    }
}

export default Sail;