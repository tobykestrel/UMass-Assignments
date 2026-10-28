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

  // src/model.ts
  var Model = class _Model {
    static instance;
    agents = /* @__PURE__ */ new Map();
    structures = /* @__PURE__ */ new Map();
    views = /* @__PURE__ */ new Set();
    constructor() {
    }
    // Implement this method according to the singleton pattern seen in class
    static getInstance() {
      if (!_Model.instance) _Model.instance = new _Model();
      return _Model.instance;
    }
    // Call next tick on every simulation object
    nextTick() {
      for (const agent of this.agents.values()) {
        agent.nextTick();
        this.broadcastObject(agent);
      }
      for (const structure of this.structures.values()) {
        structure.nextTick();
        this.broadcastObject(structure);
      }
    }
    // Add the given agent to the simulation and ask it to broadcast
    // its initial state.
    // If an agent with the same ID already exists, throws an Error with
    // the message `Agent "${agent.id}" already exists`
    addAgent(agent) {
      if (this.agents.has(agent.id)) throw new Error(`Agent "${agent.id}" already exists`);
      this.agents.set(agent.id, agent);
      this.broadcastObject(agent);
    }
    // Return the agent with the specified id.
    // If no agent with that id exists, throws an Error with the message
    // `Agent "${id}" not found`
    getAgent(id) {
      if (!this.agents.has(id)) throw new Error(`Agent "${id}" not found`);
      return this.agents.get(id);
    }
    // Remove the agent with the specified id from the simulation.
    // If no agent with that id exists, throws an Error with the message
    // `Couldn't remove agent "${id}": Not found`
    removeAgent(id) {
      if (!this.agents.has(id)) throw new Error(`Couldn't remove agent "${id}": Not found`);
      this.agents.delete(id);
      for (const view of this.views) view.removeObject(id);
    }
    // Add the given structure to the simulation and ask it to broadcast
    // its initial state.
    // If a structure with the same ID already exists, throws
    // an Error with the message `Structure "${structure.id}" already exists`
    addStructure(structure) {
      if (this.structures.has(structure.id)) throw new Error(`Structure "${structure.id}" already exists`);
      this.structures.set(structure.id, structure);
      this.broadcastObject(structure);
    }
    // Return the structure with the specified id.
    // If no structure with that id exists, throws an Error with the message
    // `Structure ${id} not found`
    getStructure(id) {
      if (!this.structures.has(id)) throw new Error(`Structure ${id} not found`);
      return this.structures.get(id);
    }
    // Remove the structure with the specified id from the simulation.
    // If no agent with that id exists, throws an Error with the message
    // `Couldn't remove structure "${id}": Not found`
    removeStructure(id) {
      if (!this.structures.has(id)) throw new Error(`Couldn't remove structure "${id}": Not found`);
      this.structures.delete(id);
      for (const view of this.views) view.removeObject(id);
    }
    // Subscribe the given view to recieve updates from the model
    attach(view) {
      this.views.add(view);
      for (const agent of this.agents.values()) this.broadcastObjectToView(agent, view);
      for (const structure of this.structures.values()) this.broadcastObjectToView(structure, view);
    }
    // Unsubscribe the given view to recieve updates from the model
    detach(view) {
      this.views.delete(view);
    }
    broadcastObject(object) {
      for (const view of this.views) this.broadcastObjectToView(object, view);
    }
    broadcastObjectToView(object, view) {
      view.updateObject(object.id, object.getLocation(), object.getSprite());
    }
  };

  // src/starter.test.ts
  describe("Starter test", () => {
    test("Minimal Model + House test", () => {
      const location = new Coordinate(42, 42);
      const house = structureFactory("house", "My House", new Coordinate(42, 42));
      expect(house.getLocation()).toEqual(location);
      Model.getInstance().addStructure(house);
    });
  });
})();
//# sourceMappingURL=starter.test.js.map
