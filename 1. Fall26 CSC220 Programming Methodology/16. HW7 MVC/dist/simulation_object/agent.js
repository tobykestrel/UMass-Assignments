"use strict";
(() => {
  // src/geometry.ts
  var Coordinate = class {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
    almostEqual(other) {
      return this.distanceTo(other) < 0.01;
    }
    distanceTo(other) {
      return Math.sqrt(Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2));
    }
  };
  function linearInterpolate(from, to, speed) {
    const distanceToMove = from.distanceTo(to);
    if (distanceToMove <= speed) {
      return {
        reachedDestination: true,
        newLocation: to
      };
    }
    const time = speed / distanceToMove;
    return {
      reachedDestination: false,
      newLocation: new Coordinate(from.x + (to.x - from.x) * time, from.y + (to.y - from.y) * time)
    };
  }

  // src/sprite.ts
  var Sprite = class {
    constructor(imageID, scale = 1) {
      this.imageID = imageID;
      this.scale = scale;
    }
  };

  // src/simulation_object/simulation_object.ts
  var SimulationObject = class {
    constructor(id) {
      this.id = id;
    }
  };

  // src/simulation_object/agent.ts
  function agentFactory(type, id, initialLocation) {
    switch (type) {
      case "simple_lobster":
        return new SimpleLobster(id, initialLocation);
      case "sleepy_lobster":
        return new SleepyLobster(id, initialLocation);
      default:
        throw new Error("unsupported agent type: " + type);
    }
  }
  var Agent = class extends SimulationObject {
    // TASK: Decide whether startMoving should be abstract or not.
    // Sets this agent's velocity to move towards the 
    // specified destination at the given speed.
    coord = new Coordinate(0, 0);
    moving = {
      isMoving: false,
      movingTo: new Coordinate(0, 0),
      moveSpeed: 0
    };
    constructor(id, initialLocation) {
      super(id);
      this.coord = initialLocation;
    }
    startMoving(destination, speed) {
      this.moving = { isMoving: true, movingTo: destination, moveSpeed: speed };
    }
    getLocation() {
      return this.coord;
    }
    nextTick() {
      if (this.moving.isMoving) {
        let lI = linearInterpolate(this.getLocation(), this.moving.movingTo, this.moving.moveSpeed);
        this.coord = lI.newLocation;
        if (lI.reachedDestination) this.moving.isMoving = false;
      }
    }
  };
  var SimpleLobster = class extends Agent {
    img = new Sprite("lobsterRegular", 0.4);
    constructor(id, initialLocation) {
      super(id, initialLocation);
    }
    getSprite() {
      return this.img;
    }
  };
  var SleepyLobster = class extends SimpleLobster {
    sleeping = false;
    constructor(id, initialLocation) {
      super(id, initialLocation);
    }
    nextTick() {
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
  };
})();
//# sourceMappingURL=agent.js.map
