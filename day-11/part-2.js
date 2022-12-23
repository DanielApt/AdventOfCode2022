const fs = require("fs");

const sampleInput = [
    {
        items: [79n, 98n],
        operation: "old * 19n",
        test: "divisible by 23",
        trueAction: "throw to monkey 2",
        falseAction: "throw to monkey 3",
        inspections: 0,
    },

    {
        items: [54n, 65n, 75n, 74n],
        operation: "old + 6n",
        test: "divisible by 19",
        trueAction: "throw to monkey 2",
        falseAction: "throw to monkey 0",
        inspections: 0,
    },

    {
        items: [79n, 60n, 97n],
        operation: "old * old",
        test: "divisible by 13",
        trueAction: "throw to monkey 1",
        falseAction: "throw to monkey 3",
        inspections: 0,
    },

    {
        items: [74n],
        operation: "old + 3n",
        test: "divisible by 17",
        trueAction: "throw to monkey 0",
        falseAction: "throw to monkey 1",
        inspections: 0,
    },
];

// const puzzleInput = fs.readFileSync("./input.txt", "utf8");
const puzzleInput = [
    {
        items: [54, 98, 50, 94, 69, 62, 53, 85],
        operation: "old * 13",
        test: "divisible by 3",
        trueAction: "throw to monkey 2",
        falseAction: "throw to monkey 1",
        inspections: 0,
    },
    {
        items: [71, 55, 82],
        operation: "old + 2",
        test: "divisible by 13",
        trueAction: "throw to monkey 7",
        falseAction: "throw to monkey 2",
        inspections: 0,
    },
    {
        items: [77, 73, 86, 72, 87],
        operation: "old + 8",
        test: "divisible by 19",
        trueAction: "throw to monkey 4",
        falseAction: "throw to monkey 7",
        inspections: 0,
    },
    {
        items: [97, 91],
        operation: "old + 1",
        test: "divisible by 17",
        trueAction: "throw to monkey 6",
        falseAction: "throw to monkey 5",
        inspections: 0,
    },
    {
        items: [78, 97, 51, 85, 66, 63, 62],
        operation: "old * 17",
        test: "divisible by 5",
        trueAction: "throw to monkey 6",
        falseAction: "throw to monkey 3",
        inspections: 0,
    },
    {
        items: [88],
        operation: "old + 3",
        test: "divisible by 7",
        trueAction: "throw to monkey 1",
        falseAction: "throw to monkey 0",
        inspections: 0,
    },
    {
        items: [87, 57, 63, 86, 87, 53],
        operation: "old * old",
        test: "divisible by 11",
        trueAction: "throw to monkey 5",
        falseAction: "throw to monkey 0",
        inspections: 0,
    },
    {
        items: [73, 59, 82, 65],
        operation: "old + 6",
        test: "divisible by 2",
        trueAction: "throw to monkey 4",
        falseAction: "throw to monkey 3",
        inspections: 0,
    },
];
const ROUND_LIMIT = 10000;

console.log(main(sampleInput));
// console.log(main(puzzleInput));

/**
 * @param {[{test: string, trueAction: string, falseAction: string, items: number[], operation: string}, {test: string, trueAction: string, falseAction: string, items: number[], operation: string}, {test: string, trueAction: string, falseAction: string, items: number[], operation: string}, {test: string, trueAction: string, falseAction: string, items: number[], operation: string, inspections: number}]} puzzleInput
 * @return {Number}
 */
function main(puzzleInput) {
    const monkeys = puzzleInput;

    let currentRound = 0;
    while (currentRound < ROUND_LIMIT) {
        currentRound++;
        console.log(currentRound);
        //something per monkey

        monkeys.forEach((monkey, index) => {
            // console.log(`Monkey ${index}`);
            monkey.items.forEach((item) => {
                let old = item;
                // console.log(
                //     `  Monkey inspects an item with a worry level of ${item}`
                // );
                monkey.operation = monkey.operation.replace(/old/g, "item");

                item = eval(monkey.operation);

                const testOperation = monkey.test
                    .replace("divisible by", "%")
                    .replace(/$/, "n");

                const action = eval(`item
                ${testOperation} === 0n`)
                    ? monkey.trueAction
                    : monkey.falseAction;

                const newLocation = Number(
                    action.replace("throw to monkey ", "")
                );

                // monkey.items.shift(); //we're down with this item
                monkeys[newLocation].items.push(item);

                // console.log(
                //     `  Item with worry level ${item} is thrown to monkey ${newLocation}`
                // );

                monkey.inspections++;
            });
            monkey.items = []; // processed all items
        });
    }

    monkeys.forEach((monkey, index) => {
        console.log(
            `Monkey ${index} inspected items ${monkey.inspections} times`
        );
    });

    return monkeys
        .map((monkey) => monkey.inspections)
        .sort((a, b) => b - a)
        .slice(0, 2)
        .reduce((a, b) => a * b);
}
