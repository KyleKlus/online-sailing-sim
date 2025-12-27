import PhysicsEngine from "./physics/PhysicsEngine";
import SceneCreator from "./scene/SceneCreator";
import Ship from "./Ship";
import Wind from "./Wind";

const maxFrameRate = 45; // in frames per second
const calculationInterval = 1000 / maxFrameRate; // in milliseconds

export interface SimulatorParams {
    maxFrameRate: number;
    calculationInterval: number;
    scale: number;
    pixelRatio: number;
    defaultShipOrientation: number;
    defaultWind: { speed: number, direction: number };
}

const DefaultSimParams: SimulatorParams = {
    maxFrameRate: maxFrameRate, // in frames per second
    calculationInterval: calculationInterval, // in milliseconds
    scale: 1.5, // Pixels per meter
    pixelRatio: 1, // Get device pixel ratio
    defaultShipOrientation: 0,
    defaultWind: { speed: 10, direction: 0 },
};

class Simulator {
    private params: SimulatorParams = DefaultSimParams;
    private lastRenderCall: number = 0;
    private lastCalculationCall: number = 0;
    private canvas: HTMLCanvasElement | null = null;
    private keysPressed: boolean[] = [false, false, false, false, false, false]; // w, s, a, d, k, l, t
    private calcInterval: NodeJS.Timeout | null = null;
    private animation: number | null = null;

    private sceneCreator: SceneCreator | null = null;
    private physicsEngine: PhysicsEngine | null = null;

    private setDisplayText: (ship: Ship, wind: Wind) => void;


    constructor(setDisplayText: (ship: Ship, wind: Wind) => void) {
        this.setDisplayText = setDisplayText;
        this.params = DefaultSimParams;
    }

    setKeyPress(keysPressed: boolean[]) {
        this.keysPressed = keysPressed;
    }

    start() {
        this.sceneCreator = new SceneCreator(
            this.params,
            () => this.physicsEngine?.getShip() || null,
            () => this.physicsEngine?.getWind() || null
        );
        this.sceneCreator.init();
        this.physicsEngine = new PhysicsEngine(
            this.params,
            this.sceneCreator.getCanvasSize().width / 2,
            this.sceneCreator.getCanvasSize().height / 2,
            () => this.keysPressed,
            () => this.sceneCreator?.getCanvasSize() || { width: 0, height: 0 }
        );

        // Start the animation
        this.calcInterval = setInterval(() => {
            if (!this.physicsEngine) { return new Error('Physics engine not initialized'); }
            const currentTime = Date.now();
            const deltaTime = currentTime - this.lastCalculationCall;
            this.physicsEngine.calcTimeStep(deltaTime);
            this.lastCalculationCall = currentTime;

        }, calculationInterval);

        this.render(0);
    }

    stop() {
        if (this.calcInterval) {
            clearInterval(this.calcInterval);
        }

        if (this.animation) {
            cancelAnimationFrame(this.animation);
        }
    }

    getParams(): SimulatorParams {
        return this.params;
    }

    private render(currentTime: number, accumulatedDeltaTime: number = 0) {
        if (this.sceneCreator === null) {
            return new Error('Scene creator not initialized');
        };
        if (!this.physicsEngine) throw new Error('Physics engine not initialized');

        if (this.lastRenderCall === 0) this.lastRenderCall = currentTime;

        const deltaTime = (currentTime - this.lastRenderCall) + accumulatedDeltaTime;

        this.lastRenderCall = currentTime;

        if (deltaTime < 1000 / maxFrameRate) {
            // Request the next frame
            this.animation = requestAnimationFrame((currentTime: number) => {
                this.render(currentTime, deltaTime);
            });
            return;
        }

        this.sceneCreator.drawFrame();
        this.setDisplayText(this.physicsEngine.getShip(), this.physicsEngine.getWind());

        this.animation = requestAnimationFrame((currentTime: number) => {
            this.render(currentTime);
        });
    }
}

export default Simulator;