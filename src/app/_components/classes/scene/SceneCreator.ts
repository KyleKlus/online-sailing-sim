import Ship from "../Ship";
import { SimulatorParams } from "../Simulator";
import Vector2D from "../Vector2D";
import Wind from "../Wind";

class SceneCreator {
    private params: SimulatorParams;
    private canvasXSize: number = 0;
    private canvasYSize: number = 0;
    private canvas: HTMLCanvasElement | null = null;

    private requestShip: () => Ship | null;
    private requestWind: () => Wind | null;

    constructor(params: SimulatorParams, requestShip: () => Ship | null, requestWind: () => Wind | null) {
        this.params = params;
        this.requestShip = requestShip;
        this.requestWind = requestWind;
    }

    getCanvasSize(): { width: number, height: number } {
        return { width: this.canvasXSize, height: this.canvasYSize };
    }

    init() {
        this.canvas = document.getElementById('simulatorCanvas') as HTMLCanvasElement;
        if (!this.canvas) {
            throw new Error('Canvas not found');
        };

        this.canvasXSize = this.canvas.clientWidth;
        this.canvasYSize = this.canvas.clientHeight;

        const pixelRatio = window.devicePixelRatio || this.params.pixelRatio; // Get device pixel ratio

        this.canvas.width = this.canvasXSize * pixelRatio; // Set width to pixel value
        this.canvas.height = this.canvasYSize * pixelRatio; // Set height to pixel value

        // this.params.scale the context to account for pixel ratio
        const context = this.canvas.getContext('2d');
        if (context) {
            context.scale(pixelRatio, pixelRatio);
        }
    }

    drawFrame() {
        if (!this.canvas) throw new Error('Canvas not found');

        const ship = this.requestShip();
        const wind = this.requestWind();

        if (!ship || !wind) throw new Error('Ship or wind not found');

        const ctx = this.canvas.getContext('2d');
        if (!ctx) throw new Error('Context not found');

        ctx.clearRect(0, 0, this.canvasXSize, this.canvasYSize);
        this.drawWind(ctx, wind);
        this.drawShip(ctx, ship);


        this.drawVector(ctx, 'black', ship.getSpeedVector());
        this.drawVector(ctx, 'green', ship.getAccelerationVector());
        this.drawVector(ctx, 'red', ship.getDragVector());
        this.drawVector(ctx, 'orange', ship.getKeelResistanceVector());

        this.drawVector(ctx, 'blue', ship.getSail().getWindEffectVector());
        this.drawVector(ctx, 'white', wind.getVector());
    }

    private drawShip(ctx: CanvasRenderingContext2D, ship: Ship) {
        const shipTopLeftX = -(ship.length / 2) * this.params.scale;
        const shipTopLeftY = 0;

        const shipLength = ship.length * this.params.scale;
        const shipWidth = ship.width * this.params.scale;
        const shipBackRadius = shipWidth / 2;

        const shipOrientationVector = ship.getShipOrientationVector();
        const shipPositionVector = ship.getPositionVector();

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

        this.drawSail(ctx, ship);
    }

    private drawVector(ctx: CanvasRenderingContext2D, color: string, vector: Vector2D, enhancedLength: number = 5) {
        const shipLength = vector.length() * this.params.scale * enhancedLength;
        const shipWidth = 1 * this.params.scale;
        const shipBackRadius = shipWidth / 2;

        ctx.save();
        ctx.fillStyle = color;

        ctx.translate(this.canvasXSize / 2, this.canvasYSize / 2);
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

    private drawSail(ctx: CanvasRenderingContext2D, ship: Ship) {
        const sailLength = ship.getSail().sailLength * this.params.scale;
        const sailWidth = ship.getSail().sailWidth * this.params.scale;
        const sailBackRadius = sailWidth / 2;

        const shipTopLeftX = ship.getPositionVector().x;
        const shipTopLeftY = ship.getPositionVector().y;

        const sailVector = ship.getSail().getSailVector();

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

    private drawWind(ctx: CanvasRenderingContext2D, wind: Wind) {
        const windVector = wind.getVector();
        const windMagnitude = Math.max(windVector.length(), 3) * this.params.scale;

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

    private drawScene(ctx: CanvasRenderingContext2D) {

    }
}

export default SceneCreator;