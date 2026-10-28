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
  var Vector2D = class _Vector2D {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
    static fromPoints(start, end) {
      return new _Vector2D(end.x - start.x, end.y - start.y);
    }
    static zero() {
      return new _Vector2D(0, 0);
    }
    magnitude() {
      return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    normalize() {
      const magnitude = this.magnitude();
      return new _Vector2D(this.x / magnitude, this.y / magnitude);
    }
    scale(scaleBy) {
      return new _Vector2D(this.x * scaleBy, this.y * scaleBy);
    }
  };

  // src/movement.ts
  var Movement = class {
    constructor(location) {
      this.location = location;
    }
    // How fast the entity is moving and in what direction
    velocity = new Vector2D(0, 0);
    getLocation() {
      return this.location;
    }
    setLocation(newLocation) {
      this.location = newLocation;
    }
    getVelocity() {
      return this.velocity;
    }
    setVelocity(velocity) {
      this.velocity = velocity;
    }
    getSpeed() {
      return this.velocity.magnitude();
    }
    // Sets the entity's velocity to move in the direction
    // of the destination at the given speed.
    setVelocityTowards(destination, speed) {
      this.setVelocity(Vector2D.fromPoints(this.getLocation(), destination).normalize().scale(speed));
    }
    isMoving() {
      return this.velocity.magnitude() !== 0;
    }
    // Updates the entity's location after one time unit
    // moving at its current velocity.
    updateLocation() {
      this.location = new Coordinate(this.location.x + this.velocity.x, this.location.y + this.velocity.y);
    }
  };
})();
//# sourceMappingURL=movement.js.map
