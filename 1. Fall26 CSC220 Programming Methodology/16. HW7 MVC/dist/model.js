"use strict";
(() => {
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
})();
//# sourceMappingURL=model.js.map
