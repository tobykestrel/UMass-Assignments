class Thing {
    constructor() {
        this.spam = 42;
        this.egg = 43;
    }
}

let thing = new Thing();
console.log(thing.randomblah); // undefined
// console.log(thing.randomblah.randomblah2); // ERROR
console.log(thing.randomblah + 1); // NaN