const fs = require("fs");

const sampleInput = fs.readFileSync("./sample-input.txt", "utf8");
const puzzleInput = fs.readFileSync("./input.txt", "utf8");

console.log(main(sampleInput));
console.log(main(puzzleInput));

function getMovesFromInput(moveInput) {
    return moveInput.split("\n").map((line) => {
        const match = line.match(/move (\d+) from (\d+) to (\d+)/);
        const amount = match[1];
        const from = match[2];
        const to = match[3];

        return { amount, from, to };
    });
}

/**
 * @param {String} puzzleInput
 * @return {String}
 */
function main(puzzleInput) {
    const sliceIndex = puzzleInput.indexOf("\n\n");
    const stackInput = puzzleInput.slice(0, sliceIndex);
    const moveInput = puzzleInput
        .slice(sliceIndex, puzzleInput.length)
        .replace("\n\n", "");

    const stacks = getStacksFromInput(stackInput);
    const moves = getMovesFromInput(moveInput);

    moves.forEach(move => {
        const {amount, from, to} = move;

        const crates = stacks[from - 1].splice(0, amount);
        stacks[to - 1] = [...crates, ...stacks[to - 1]]


        // while(cratesToMove !== 0) {
        //     const crate = stacks[from - 1].shift();
        //     stacks[to - 1].unshift(crate);
        //     cratesToMove--;
        // }
    });

    console.log(stacks);

    return stacks.map(stack => stack.shift()).join('');
}

/**
 * @param {String} stackInput
 * @return {Array<Array<String>>} stacks
 */

function getStacksFromInput(stackInput) {
    const size = stackInput
        .match(/\d/g)
        .map((str) => Number(str))
        .sort((a, b) => b - a)[0];
    stackInput = stackInput.replace(/\d.*/, "");

    const stacks = [...Array(size)].map((e) => Array(0));
    const lines = stackInput.split("\n");

    const cratesInput = lines
        .map((line) => line.
        replace(/    /g, "[X] "))
        .map((line) => line.match(/\w/g))
        .filter((line) => line !== null);

    cratesInput.forEach((line) => {
        line.forEach((crate, index) => {
            if (crate === "X") {
                // do nothing
                return;
            }

            stacks[index].push(crate);
        });
    });

    return stacks;
}