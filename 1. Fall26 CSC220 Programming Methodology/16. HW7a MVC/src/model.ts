import type { Agent } from "./simulation_object/agent.js";
import type { SimulationObject } from "./simulation_object/simulation_object.js";
import type { Structure } from "./simulation_object/structure.js";
import type { View } from "./view.js";

export class Model {
  private static instance: Model;
  private agents: Map<string, Agent> = new Map();
  private structures: Map<string, Structure> = new Map();
  private views: Set<View> = new Set();

  private constructor() {}
  // Implement this method according to the singleton pattern seen in class
  static getInstance(): Model {
    if (!Model.instance) Model.instance = new Model();
    return Model.instance;
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
  addAgent(agent: Agent) {
    if (this.agents.has(agent.id)) throw new Error(`Agent "${agent.id}" already exists`);
    this.agents.set(agent.id, agent);
    this.broadcastObject(agent);
  }

  // Return the agent with the specified id.
  // If no agent with that id exists, throws an Error with the message
  // `Agent "${id}" not found`
  getAgent(id: string): Agent {
    if (!this.agents.has(id)) throw new Error(`Agent "${id}" not found`);
    return this.agents.get(id)!;
  }

  // Remove the agent with the specified id from the simulation.
  // If no agent with that id exists, throws an Error with the message
  // `Couldn't remove agent "${id}": Not found`
  removeAgent(id: string) {
    if (!this.agents.has(id)) throw new Error(`Couldn't remove agent "${id}": Not found`);
    this.agents.delete(id);
    for (const view of this.views) view.removeObject(id);
  }

  // Add the given structure to the simulation and ask it to broadcast
  // its initial state.
  // If a structure with the same ID already exists, throws
  // an Error with the message `Structure "${structure.id}" already exists`
  addStructure(structure: Structure) {
    if (this.structures.has(structure.id)) throw new Error(`Structure "${structure.id}" already exists`);
    this.structures.set(structure.id, structure);
    this.broadcastObject(structure);
  }

  // Return the structure with the specified id.
  // If no structure with that id exists, throws an Error with the message
  // `Structure ${id} not found`
  getStructure(id: string): Structure {
    if (!this.structures.has(id)) throw new Error(`Structure ${id} not found`);
    return this.structures.get(id)!;
  }

  // Remove the structure with the specified id from the simulation.
  // If no agent with that id exists, throws an Error with the message
  // `Couldn't remove structure "${id}": Not found`
  removeStructure(id: string) {
    if (!this.structures.has(id)) throw new Error(`Couldn't remove structure "${id}": Not found`);
    this.structures.delete(id);
    for (const view of this.views) view.removeObject(id);
  }

  // Subscribe the given view to recieve updates from the model
  attach(view: View) {
    this.views.add(view);
    for (const agent of this.agents.values()) this.broadcastObjectToView(agent, view);
    for (const structure of this.structures.values()) this.broadcastObjectToView(structure, view);
  }

  // Unsubscribe the given view to recieve updates from the model
  detach(view: View) {
    this.views.delete(view);
  }

  private broadcastObject(object: SimulationObject) {
    for (const view of this.views) this.broadcastObjectToView(object, view);
  }

  private broadcastObjectToView(object: SimulationObject, view: View) {
    view.updateObject(object.id, object.getLocation(), object.getSprite());
  }
}
