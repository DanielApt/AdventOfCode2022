const fs = require("fs");
const { next } = require("lodash/seq");

const sampleInput = fs.readFileSync("./sample-input.txt", "utf8");
const puzzleInput = fs.readFileSync("./input.txt", "utf8");

const ROUND_LIMIT = 10000;

console.log(main(sampleInput));
console.log(main(puzzleInput));

/**
 * @param {string}
 * @return {Number}
 */
function main(puzzleInput) {
    const monkeyParts = puzzleInput.split(/\n\n/);
    const modulos = [...puzzleInput.matchAll(/divisible by (\d+)/g)]
        .map((match) => match[1])
        .map((str) => Number(str));

    console.log(modulos);

    const monkeys = monkeyParts.map((part) => {
        const monkey = {
            items: part
                .match(/Starting items: ([\d, ]+)/)[1]
                .split(", ")
                .map((str) => {
                    const value = Number(str);
                    const values = {};

                    modulos.forEach((modulo) => {
                        values[modulo] = value % modulo;
                    });

                    return values;
                }),
            operation: part.match(/Operation: new = (.*)/)[1],
            test: Number(part.match(/\s+Test: divisible by (\d+)/)[1]),
            trueMonkey: Number(part.match(/If true.*(\d+)/)[1]),
            falseMonkey: Number(part.match(/If false.*(\d+)/)[1]),
            inspections: 0,
        };

        return monkey;
    });

    let currentRound = 0;
    while (currentRound < ROUND_LIMIT) {
        currentRound++;
        monkeys.forEach((monkey) => {
            monkey.items.forEach((item) => {
                if (monkey.operation.match(/\+ (\d+)/)) {
                    const amount = Number(monkey.operation.match(/(\d+)/g));

                    Object.keys(item).forEach((moduloKey) => {
                        const modulo = Number(moduloKey);
                        item[moduloKey] = (item[moduloKey] + amount) % modulo;
                    });
                } else if (monkey.operation.match(/\* (\d+)/)) {
                    const amount = Number(monkey.operation.match(/\d+/g));

                    Object.keys(item).forEach((moduloKey) => {
                        const modulo = Number(moduloKey);
                        item[moduloKey] =
                            (item[moduloKey] * (amount % modulo)) % modulo;
                    });
                } else {
                    // still have to do this one (old * old)

                    Object.keys(item).forEach((moduloKey) => {
                        // const modulo = Number(moduloKey);
                        item[moduloKey] = item[moduloKey] * item[moduloKey];
                    });
                    // const foo = "yhdaslk";
                }

                const nextMonkey =
                    item[monkey.test] === 0
                        ? monkey.trueMonkey
                        : monkey.falseMonkey;

                monkeys[nextMonkey].items.push(item);

                monkey.inspections++; // done inspecting item
            });

            monkey.items = []; // monkey is done with all the items
        });
    }

    return monkeys
        .map((monkey) => monkey.inspections)
        .sort((a, b) => b - a)
        .slice(0, 2)
        .reduce((a, b) => a * b);

    // console.log(monkeys);
    // console.log(parts);
    return 0;
}
