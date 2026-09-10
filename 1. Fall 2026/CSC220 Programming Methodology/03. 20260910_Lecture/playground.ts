class Thingy {
    spam: number;
    egg: number;
    constructor() {
        this.spam = 42;
        this.egg = 43;
    }
}

const thing1 = new Thingy();
// console.log(thing1.randomblah);              // ERROR
// console.log(thing1.randomblah.randomblah2);  // ERROR
// console.log(thing1.randomblah + 1);          // ERROR


function returnString() { return "test";}

function syntaxOfTypescript() {
    let foo: string | null = returnString();
}