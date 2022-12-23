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

        if (name === "humn") {
            this.value = "x";
        } else if (digitMatch) {
            this.value = BigInt(digitMatch);
        } else {
            // this is an operator Monkey
            const monkeyMatch = value.match(/(\w+) ([+-\/\*]) (\w+)/);

            const a = new Monkey(monkeyMatch[1], monkeyStrings);
            const operator = name === "root" ? "=" : monkeyMatch[2];
            const b = new Monkey(monkeyMatch[3], monkeyStrings);

            const isExpression =
                `${a.value}`.includes("x") || `${b.value}`.includes("x");

            // const isExpression = true;

            switch (operator) {
                case "+":
                    this.value = isExpression
                        ? `(${a.value} + ${b.value})`
                        : BigInt(a.value + b.value);
                    break;

                case "-":
                    this.value = isExpression
                        ? `(${a.value} - ${b.value})`
                        : BigInt(a.value - b.value);
                    break;

                case "*":
                    this.value = isExpression
                        ? `(${a.value} * ${b.value})`
                        : BigInt(a.value * b.value);
                    break;

                case "/":
                    this.value = isExpression
                        ? `(${a.value} / ${b.value})`
                        : BigInt(a.value / b.value);
                    break;

                case "=":
                    this.value = `${a.value} = ${b.value}`;
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

    console.log(`take the below expression and solve on https://quickmath.com`);
    return root.value;
}
