import Ship from "./Ship";
import { SimulatorParams } from "./Simulator";
import Wind from "./Wind";

enum Key {
    w = 0,
    s = 1,
    a = 2,
    d = 3,
    k = 4,
    l = 5,
    t = 6,
}

class PhysicsEngine {
    private params: SimulatorParams;
    private wind: Wind;
    private ship: Ship;

    private requestKeyBoardInput: () => boolean[];
    private requestCanvasSize: () => { width: number, height: number };

    constructor(params: SimulatorParams, x: number, y: number, requestKeyBoardInput: () => boolean[], requestCanvasSize: () => { width: number, height: number }) {
        this.params = params;
        this.ship = new Ship(x, y, params.defaultShipOrientation);
        this.wind = new Wind(params.defaultWind.direction, params.defaultWind.speed);
        this.requestKeyBoardInput = requestKeyBoardInput;
        this.requestCanvasSize = requestCanvasSize;
    }

    getShip(): Ship {
        return this.ship;
    }

    getWind(): Wind {
        return this.wind;
    }

    calcTimeStep(deltaTime: number) {
        const keysPressed = this.requestKeyBoardInput();
        this.wind.modifyWind();

        if (keysPressed[Key.a] && !keysPressed[Key.d]) {
            this.ship.turnLeft();
        }

        if (keysPressed[Key.d] && !keysPressed[Key.a]) {
            this.ship.turnRight();
        }

        if (keysPressed[Key.w] && !keysPressed[Key.s]) {
            this.ship.getSail().furlSail();
        }

        if (keysPressed[Key.s] && !keysPressed[Key.w]) {
            this.ship.getSail().unfurlSail();
        }

        if (keysPressed[Key.k] && !keysPressed[Key.l]) {
            this.ship.getSail().increaseOrientation();
        }

        if (keysPressed[Key.l] && !keysPressed[Key.k]) {
            this.ship.getSail().decreaseOrientation();
        }

        if (keysPressed[Key.t]) {
            this.ship.toggleAnchor();
        }

        const canvasSize = this.requestCanvasSize();
        this.ship.applyWind(this.wind, canvasSize.width, canvasSize.height, false);
    }
}

export default PhysicsEngine;