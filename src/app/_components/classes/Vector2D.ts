import { convertToDegrees } from "../handlers/converter";

class Vector2D {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public getAngleInRad(): number {
        return Math.atan2(this.y, this.x);
    }

    public getAngleInDeg(): number {
        return convertToDegrees(this.getAngleInRad());
    }

    public add(v: Vector2D): Vector2D {
        return new Vector2D(this.x + v.x, this.y + v.y);
    }

    public subtract(v: Vector2D): Vector2D {
        return new Vector2D(this.x - v.x, this.y - v.y);
    }

    public multiply(v: Vector2D): Vector2D {
        return new Vector2D(this.x * v.x, this.y * v.y);
    }

    public divide(v: Vector2D): Vector2D {
        return new Vector2D(this.x / v.x, this.y / v.y);
    }

    public dot(v: Vector2D): number {
        return this.x * v.x + this.y * v.y;
    }

    public cross(v: Vector2D): number {
        return this.x * v.y - this.y * v.x;
    }

    public angle(): number {
        return Math.atan2(this.y, this.x);
    }

    public rotate(angle: number): Vector2D {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vector2D(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
    }

    public scale(s: number): Vector2D {
        return new Vector2D(this.x * s, this.y * s);
    }

    public equals(v: Vector2D): boolean {
        return this.x === v.x && this.y === v.y;
    }

    public distance(v: Vector2D): number {
        return Math.sqrt((this.x - v.x) * (this.x - v.x) + (this.y - v.y) * (this.y - v.y));
    }

    public signedDistance(v: Vector2D): number {
        const distance = Math.sqrt(
            Math.pow(this.x - v.x, 2) +
            Math.pow(this.y - v.y, 2)
        );

        // Calculate the dot product
        const dotProduct = this.x * v.x + this.y * v.y;

        // If the dot product is negative, return negative distance
        return dotProduct < 0 ? -distance : distance;
    }

    public distanceSquared(v: Vector2D): number {
        return (this.x - v.x) * (this.x - v.x) + (this.y - v.y) * (this.y - v.y);
    }

    public lerp(v: Vector2D, t: number): Vector2D {
        return new Vector2D(this.x + (v.x - this.x) * t, this.y + (v.y - this.y) * t);
    }

    public clone(): Vector2D {
        return new Vector2D(this.x, this.y);
    }

    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public signedLength(): number {
        return this.signedDistance(new Vector2D(0, 0));
    }

    public normalize(): Vector2D {
        const length = this.length();
        return new Vector2D(this.x / length, this.y / length);
    }

    public toString(): string {
        return `(${this.x}, ${this.y})`;
    }
}

export default Vector2D;