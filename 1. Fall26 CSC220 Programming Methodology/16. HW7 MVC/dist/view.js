"use strict";
(() => {
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
})();
//# sourceMappingURL=view.js.map
