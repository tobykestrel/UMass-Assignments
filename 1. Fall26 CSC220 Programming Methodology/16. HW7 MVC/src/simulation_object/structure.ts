import type { Coordinate } from "../geometry.js";
import { Sprite } from "../sprite.js";
import { SimulationObject } from "./simulation_object.js";

export function structureFactory(type: string, id: string, location: Coordinate): Structure {
  switch (type) {
    case "house":
      return new House(id, location);
    default:
      throw new Error("unsupported structure type: " + type);
  }
}

export abstract class Structure extends SimulationObject {
  constructor(id: string, protected readonly location: Coordinate) {
    super(id);
  }

  getLocation(): Coordinate {
    return this.location;
  }

  nextTick(): void {
    // temp
  }
}

class House extends Structure {
  protected img: Sprite = new Sprite("simpleHouse");
  constructor(id: string, location: Coordinate) {
    super(id, location);
  }

  getSprite(): Sprite {
    return this.img;
  }
}
