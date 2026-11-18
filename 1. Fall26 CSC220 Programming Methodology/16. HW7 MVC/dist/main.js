"use strict";
(() => {
  // src/assert.ts
  function assert(condition, msg) {
    if (condition === false) {
      throw new Error(msg);
    }
  }

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

  // src/view.ts
  var View = class {
  };
  var MainSimulationView = class extends View {
    constructor(canvas) {
      super();
      this.canvas = canvas;
    }
    // Map of object id to drawable object
    // Keep this map up to date when this view recieves updates
    // from the model.
    drawableObjects = /* @__PURE__ */ new Map();
    updateObject(id, location, sprite) {
      this.drawableObjects.set(id, new DrawableSimulationObject(id, location, sprite));
    }
    removeObject(id) {
      this.drawableObjects.delete(id);
    }
    // The draw method is provided for you.
    // It draws each drawable object on the canvas.
    // DO NOT MODIFY.
    draw() {
      for (const drawable of this.drawableObjects.values()) {
        this.canvas.getContext("2d")?.drawImage(
          drawable.getSpriteImage(),
          // Use integer pixels for efficiency.
          // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#avoid_floating-point_coordinates_and_use_integers_instead
          Math.floor(drawable.location.x),
          Math.floor(drawable.location.y),
          Math.floor(drawable.getSpriteImage().width * drawable.getSprite().scale),
          Math.floor(drawable.getSpriteImage().height * drawable.getSprite().scale)
        );
      }
    }
  };
  var DrawableSimulationObject = class {
    constructor(id, location, sprite) {
      this.id = id;
      this.location = location;
      this.sprite = sprite;
      this.loadedImage = document.getElementById(sprite.imageID);
    }
    loadedImage;
    getSprite() {
      return this.sprite;
    }
    getSpriteImage() {
      return this.loadedImage;
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

  // src/main.ts
  function main() {
    const canvas = getCanvas();
    const view = new MainSimulationView(canvas);
    Model.getInstance().attach(view);
    const lobsters = createLobsters();
    for (const l of lobsters) Model.getInstance().addAgent(l);
    const house = structureFactory("house", "my-house", new Coordinate(0, 0));
    Model.getInstance().addStructure(house);
    setInterval(() => {
      Model.getInstance().nextTick();
      canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
      view.draw();
    }, 100);
  }
  function getCanvas() {
    const canvas = document.getElementById("simulationCanvas");
    assert(canvas !== null);
    return canvas;
  }
  function createLobsters() {
    const lobst1 = agentFactory("simple_lobster", "lobster1", new Coordinate(300, 400));
    lobst1.startMoving(new Coordinate(750, 50), 10);
    const lobst2 = agentFactory("simple_lobster", "lobster2", new Coordinate(800, 450));
    const lobst3 = agentFactory("sleepy_lobster", "lobster3", new Coordinate(200, 300));
    lobst3.startMoving(new Coordinate(0, 250), 5);
    return [lobst1, lobst2, lobst3];
  }
  main();
})();
//# sourceMappingURL=main.js.map
