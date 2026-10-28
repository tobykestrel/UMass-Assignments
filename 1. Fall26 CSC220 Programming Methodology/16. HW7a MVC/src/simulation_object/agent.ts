import { Coordinate, linearInterpolate } from "../geometry.js";
import { Sprite } from "../sprite.js";
import { SimulationObject } from "./simulation_object.js";

export function agentFactory(type: string, id: string, initialLocation: Coordinate): Agent {
  switch (type) {
    case "simple_lobster":
      return new SimpleLobster(id, initialLocation);
    case "sleepy_lobster":
      return new SleepyLobster(id, initialLocation);
    default:
      throw new Error("unsupported agent type: " + type);
  }
}

export abstract class Agent extends SimulationObject {
  // TASK: Decide whether startMoving should be abstract or not.
  // Sets this agent's velocity to move towards the
  // specified destination at the given speed.

  protected coord: Coordinate = new Coordinate(0, 0);
  protected moving: { isMoving: boolean; movingTo: Coordinate; moveSpeed: number } = {
    isMoving: false,
    movingTo: new Coordinate(0, 0),
    moveSpeed: 0,
  };
  constructor(id: string, initialLocation: Coordinate) {
    super(id);
    this.coord = initialLocation;
  }

  startMoving(destination: Coordinate, speed: number): void {
    this.moving = { isMoving: true, movingTo: destination, moveSpeed: speed };
  }

  getLocation(): Coordinate {
    return this.coord;
  }

  nextTick(): void {
    // This method should be called on every simulation object
    // each "tick" of the simulation.
    if (this.moving.isMoving) {
      let lI = linearInterpolate(this.getLocation(), this.moving.movingTo, this.moving.moveSpeed);
      this.coord = lI.newLocation;
      if (lI.reachedDestination) this.moving.isMoving = false;
    }
  }
}

class SimpleLobster extends Agent {
  protected img: Sprite = new Sprite("lobsterRegular", 0.4);
  constructor(id: string, initialLocation: Coordinate) {
    super(id, initialLocation);
  }

  getSprite(): Sprite {
    return this.img;
  }
}

// The modifications to the application I made so that I could implement the behaviors of this class:
// I had to change the moving, coord, and img variables from private to protected.
class SleepyLobster extends SimpleLobster {
  private sleeping = false;
  constructor(id: string, initialLocation: Coordinate) {
    super(id, initialLocation);
  }

  override nextTick(): void {
    // This method should be called on every simulation object
    // each "tick" of the simulation.
    if (!this.sleeping && this.moving.isMoving) {
      let lI = linearInterpolate(this.getLocation(), this.moving.movingTo, this.moving.moveSpeed);
      this.coord = lI.newLocation;
      if (lI.reachedDestination) {
        this.moving.isMoving = false;
        this.sleeping = true;
        this.img = new Sprite("lobsterSleeping", 0.25);
      }
    }
  }
}
