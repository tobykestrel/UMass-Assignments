import { Coordinate } from "../geometry.js";
import type { Sprite } from "../sprite.js";

export abstract class SimulationObject {
  constructor(public readonly id: string) {}

  // Returns the current location of the simulation object
  abstract getLocation(): Coordinate;

  // Returns the sprite of the simulation object
  abstract getSprite(): Sprite;

  // This method should be called on every simulation object
  // each "tick" of the simulation.
  abstract nextTick(): void;
}
