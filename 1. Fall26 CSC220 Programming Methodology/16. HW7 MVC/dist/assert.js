"use strict";
(() => {
  // src/assert.ts
  function assert(condition, msg) {
    if (condition === false) {
      throw new Error(msg);
    }
  }
})();
//# sourceMappingURL=assert.js.map
