"use strict";
(() => {
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

  // src/simulation_object/structure.ts
  function structureFactory(type, id, location) {
    switch (type) {
      case "house":
        return new House(id, location);
      default:
        throw new Error("unsupported structure type: " + type);
    }
  }
  var Structure = class extends SimulationObject {
    constructor(id, location) {
      super(id);
      this.location = location;
    }
    getLocation() {
      return this.location;
    }
    nextTick() {
    }
  };
  var House = class extends Structure {
    img = new Sprite("simpleHouse");
    constructor(id, location) {
      super(id, location);
    }
    getSprite() {
      return this.img;
    }
  };
})();
//# sourceMappingURL=structure.js.map
