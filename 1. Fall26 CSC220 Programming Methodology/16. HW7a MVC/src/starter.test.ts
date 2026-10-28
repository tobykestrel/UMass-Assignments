import { jest } from "@jest/globals";
import { Coordinate } from "./geometry.js";
import { Model } from "./model.js";
import { agentFactory } from "./simulation_object/agent.js";
import type { Agent } from "./simulation_object/agent.js";
import { structureFactory } from "./simulation_object/structure.js";
import type { Structure } from "./simulation_object/structure.js";
import { Sprite } from "./sprite.js";
import { MainSimulationView, View } from "./view.js";

class TestView extends View {
  readonly updates: Array<{ id: string; location: Coordinate; sprite: Sprite }> = [];
  readonly removals: string[] = [];

  draw(): void {}

  updateObject(id: string, location: Coordinate, sprite: Sprite): void {
    this.updates.push({ id, location, sprite });
  }

  removeObject(id: string): void {
    this.removals.push(id);
  }
}

describe("Model", () => {
  const model = Model.getInstance();
  const agentIds = new Set<string>();
  const structureIds = new Set<string>();
  const views = new Set<TestView>();
  let nextId = 0;

  function addAgent(agent: Agent): Agent {
    model.addAgent(agent);
    agentIds.add(agent.id);
    return agent;
  }

  function addStructure(structure: Structure): Structure {
    model.addStructure(structure);
    structureIds.add(structure.id);
    return structure;
  }

  function attachView(): TestView {
    const view = new TestView();
    model.attach(view);
    views.add(view);
    return view;
  }

  function uniqueId(prefix: string): string {
    nextId += 1;
    return `${prefix}-${nextId}`;
  }

  afterEach(() => {
    for (const view of views) model.detach(view);
    views.clear();

    for (const id of agentIds) model.removeAgent(id);
    agentIds.clear();

    for (const id of structureIds) model.removeStructure(id);
    structureIds.clear();
  });

  test("getInstance returns the singleton", () => {
    expect(Model.getInstance()).toBe(model);
  });

  test("adds agents and broadcasts their initial state", () => {
    const view = attachView();
    const agent = addAgent(agentFactory("simple_lobster", uniqueId("lobster"), new Coordinate(12, 34)));

    expect(model.getAgent(agent.id)).toBe(agent);
    expect(view.updates).toEqual([{ id: agent.id, location: new Coordinate(12, 34), sprite: agent.getSprite() }]);
  });

  test("rejects duplicate agents and reports missing agents", () => {
    const agent = addAgent(agentFactory("simple_lobster", uniqueId("lobster"), new Coordinate(0, 0)));

    expect(() => model.addAgent(agent)).toThrow(`Agent "${agent.id}" already exists`);
    expect(() => model.getAgent(uniqueId("missing"))).toThrow(/Agent ".+" not found/);
    expect(() => model.removeAgent(uniqueId("missing"))).toThrow(/Couldn't remove agent ".+": Not found/);
  });

  test("adds structures and broadcasts their initial state", () => {
    const view = attachView();
    const structure = addStructure(structureFactory("house", uniqueId("house"), new Coordinate(56, 78)));

    expect(model.getStructure(structure.id)).toBe(structure);
    expect(view.updates).toEqual([
      { id: structure.id, location: new Coordinate(56, 78), sprite: structure.getSprite() },
    ]);
  });

  test("preserves the starter house-location check", () => {
    const location = new Coordinate(42, 42);
    const house = structureFactory("house", uniqueId("house"), location);

    expect(house.getLocation()).toEqual(location);
    addStructure(house);
  });

  test("rejects duplicate structures and reports missing structures", () => {
    const structure = addStructure(structureFactory("house", uniqueId("house"), new Coordinate(0, 0)));

    expect(() => model.addStructure(structure)).toThrow(`Structure "${structure.id}" already exists`);
    expect(() => model.getStructure(uniqueId("missing"))).toThrow(/Structure .+ not found/);
    expect(() => model.removeStructure(uniqueId("missing"))).toThrow(/Couldn't remove structure ".+": Not found/);
  });

  test("broadcasts each object's state after advancing a tick", () => {
    const view = attachView();
    const agent = addAgent(agentFactory("simple_lobster", uniqueId("lobster"), new Coordinate(0, 0)));
    const structure = addStructure(structureFactory("house", uniqueId("house"), new Coordinate(40, 50)));
    agent.startMoving(new Coordinate(10, 0), 2);

    model.nextTick();

    expect(view.updates).toHaveLength(4);
    expect(view.updates[2]).toMatchObject({
      id: agent.id,
      location: new Coordinate(2, 0),
    });
    expect(view.updates[3]).toMatchObject({
      id: structure.id,
      location: new Coordinate(40, 50),
    });
  });

  test("attaching a view sends it existing agents and structures", () => {
    const agent = addAgent(agentFactory("simple_lobster", uniqueId("lobster"), new Coordinate(1, 2)));
    const structure = addStructure(structureFactory("house", uniqueId("house"), new Coordinate(3, 4)));

    const view = attachView();

    expect(view.updates.map(({ id }) => id)).toEqual([agent.id, structure.id]);
  });

  test("removing objects notifies attached views", () => {
    const view = attachView();
    const agent = addAgent(agentFactory("simple_lobster", uniqueId("lobster"), new Coordinate(0, 0)));
    const structure = addStructure(structureFactory("house", uniqueId("house"), new Coordinate(0, 0)));

    model.removeAgent(agent.id);
    agentIds.delete(agent.id);
    model.removeStructure(structure.id);
    structureIds.delete(structure.id);

    expect(view.removals).toEqual([agent.id, structure.id]);
    expect(() => model.getAgent(agent.id)).toThrow(`Agent "${agent.id}" not found`);
    expect(() => model.getStructure(structure.id)).toThrow(`Structure ${structure.id} not found`);
  });

  test("detached views no longer receive object updates", () => {
    const view = attachView();
    model.detach(view);
    views.delete(view);

    const agent = addAgent(agentFactory("simple_lobster", uniqueId("lobster"), new Coordinate(0, 0)));
    model.nextTick();
    model.removeAgent(agent.id);
    agentIds.delete(agent.id);

    expect(view.updates).toHaveLength(0);
    expect(view.removals).toHaveLength(0);
  });

  test("ticks safely when the model has no objects", () => {
    model.nextTick();
  });
});

describe("simulation object factories and behavior", () => {
  test("creates the supported agent types with their initial location and sprite", () => {
    const regular = agentFactory("simple_lobster", "regular", new Coordinate(10, 20));
    const sleepy = agentFactory("sleepy_lobster", "sleepy", new Coordinate(30, 40));

    expect(regular.getLocation()).toEqual(new Coordinate(10, 20));
    expect(regular.getSprite()).toEqual({ imageID: "lobsterRegular", scale: 0.4 });
    expect(sleepy.getLocation()).toEqual(new Coordinate(30, 40));
    expect(sleepy.getSprite()).toEqual({ imageID: "lobsterRegular", scale: 0.4 });
  });

  test("rejects unsupported agent types", () => {
    expect(() => agentFactory("unknown", "bad-agent", new Coordinate(0, 0))).toThrow("unsupported agent type: unknown");
  });

  test("regular lobsters remain still until asked to move", () => {
    const lobster = agentFactory("simple_lobster", "still", new Coordinate(5, 6));

    lobster.nextTick();

    expect(lobster.getLocation()).toEqual(new Coordinate(5, 6));
  });

  test("regular lobsters move toward a destination and stop there", () => {
    const lobster = agentFactory("simple_lobster", "moving", new Coordinate(0, 0));
    const destination = new Coordinate(5, 0);
    lobster.startMoving(destination, 2);

    lobster.nextTick();
    expect(lobster.getLocation()).toEqual(new Coordinate(2, 0));

    lobster.nextTick();
    expect(lobster.getLocation()).toEqual(new Coordinate(4, 0));

    lobster.nextTick();
    expect(lobster.getLocation()).toBe(destination);
  });

  test("sleepy lobsters switch to their sleeping sprite on arrival", () => {
    const lobster = agentFactory("sleepy_lobster", "sleepy-mover", new Coordinate(0, 0));
    const destination = new Coordinate(3, 0);
    lobster.startMoving(destination, 2);

    lobster.nextTick();
    expect(lobster.getLocation()).toEqual(new Coordinate(2, 0));
    expect(lobster.getSprite()).toEqual({ imageID: "lobsterRegular", scale: 0.4 });

    lobster.nextTick();
    expect(lobster.getLocation()).toBe(destination);
    expect(lobster.getSprite()).toEqual({ imageID: "lobsterSleeping", scale: 0.25 });

    lobster.startMoving(new Coordinate(10, 0), 2);
    lobster.nextTick();
    expect(lobster.getLocation()).toBe(destination);
  });

  test("sleepy lobsters remain still before they start moving", () => {
    const lobster = agentFactory("sleepy_lobster", "sleepy-still", new Coordinate(5, 6));

    lobster.nextTick();

    expect(lobster.getLocation()).toEqual(new Coordinate(5, 6));
    expect(lobster.getSprite()).toEqual({ imageID: "lobsterRegular", scale: 0.4 });
  });

  test("creates houses and returns their location and sprite", () => {
    const location = new Coordinate(7, 8);
    const house = structureFactory("house", "home", location);

    expect(house.getLocation()).toBe(location);
    expect(house.getSprite()).toEqual({ imageID: "simpleHouse", scale: 1 });
    house.nextTick();
    expect(house.getLocation()).toBe(location);
  });

  test("rejects unsupported structure types", () => {
    expect(() => structureFactory("unknown", "bad-house", new Coordinate(0, 0))).toThrow(
      "unsupported structure type: unknown"
    );
  });
});

describe("MainSimulationView", () => {
  let canvas: HTMLCanvasElement;
  let drawImage: jest.Mock;
  let view: MainSimulationView;
  let image: HTMLImageElement;

  beforeEach(() => {
    document.body.innerHTML = "";
    canvas = document.createElement("canvas");
    image = document.createElement("img");
    image.id = "testSprite";
    image.width = 100;
    image.height = 50;
    document.body.append(image);

    drawImage = jest.fn();
    jest.spyOn(canvas, "getContext").mockReturnValue({
      drawImage,
    } as unknown as CanvasRenderingContext2D);
    view = new MainSimulationView(canvas);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("draws registered objects at integer coordinates and scaled dimensions", () => {
    view.updateObject("object-1", new Coordinate(12.9, 20.7), new Sprite("testSprite", 0.5));

    view.draw();

    expect(drawImage).toHaveBeenCalledTimes(1);
    expect(drawImage).toHaveBeenCalledWith(image, 12, 20, 50, 25);
  });

  test("replacing an object updates its position and sprite scale", () => {
    view.updateObject("object-1", new Coordinate(0, 0), new Sprite("testSprite"));
    view.updateObject("object-1", new Coordinate(31, 42), new Sprite("testSprite", 0.25));

    view.draw();

    expect(drawImage).toHaveBeenCalledTimes(1);
    expect(drawImage).toHaveBeenCalledWith(image, 31, 42, 25, 12);
  });

  test("removed objects are no longer drawn", () => {
    view.updateObject("object-1", new Coordinate(0, 0), new Sprite("testSprite"));
    view.removeObject("object-1");

    view.draw();

    expect(drawImage).not.toHaveBeenCalled();
  });
});
