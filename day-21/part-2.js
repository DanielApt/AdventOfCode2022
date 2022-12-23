const fs = require("fs");

const sampleInput = fs.readFileSync("./sample-input.txt", "utf8");
const puzzleInput = fs.readFileSync("./input.txt", "utf8");

class Monkey {
    constructor(name, monkeyStrings) {
        this.name = name;

        const monkeyDefinition = monkeyStrings.find((str) =>
            str.includes(`${name}:`)
        );

        const value = monkeyDefinition.replace(`${name}: `, "");

        const digitMatch = value.match(/\d+/g);

        if (digitMatch) {
            this.value = Number(digitMatch);
        } else {
            // this is an operator Monkey
            const monkeyMatch = value.match(/(\w+) ([+-\/\*]) (\w+)/);

            const a = new Monkey(monkeyMatch[1], monkeyStrings);
            const operator = monkeyMatch[2];
            const b = new Monkey(monkeyMatch[3], monkeyStrings);

            switch (operator) {
                case "+":
                    this.value = a.value + b.value;
                    break;

                case "-":
                    this.value = a.value - b.value;
                    break;

                case "*":
                    this.value = a.value * b.value;
                    break;

                case "/":
                    this.value = a.value / b.value;
                    break;
            }
        }
    }
}

let start = process.hrtime();
console.log(main(sampleInput));
console.log(`Process took ${process.hrtime(start)[0]} seconds`);

start = process.hrtime();
console.log(main(puzzleInput));
console.log(`Process took ${process.hrtime(start)[0]} seconds`);

/**
 * @param {String} puzzleInput
 * @return {Number}
 */
function main(puzzleInput) {
    const monkeyStrings = puzzleInput.split("\n");

    const root = new Monkey("root", monkeyStrings);

    return root.value;
}
