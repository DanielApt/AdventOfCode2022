const fs = require("fs");

const sampleInput = fs.readFileSync("./sample-input.txt", "utf8");
const puzzleInput = fs.readFileSync("./input.txt", "utf8");

const CYCLES = [20, 60, 100, 140, 180, 220];

// 16620 - too high

console.log(main(sampleInput));
console.log(main(puzzleInput));
//r
/**
 * @param {String} puzzleInput
 * @return {Number}
 */
function main(puzzleInput) {
    const registries = {
        x: 1,
    };

    const NEEDED_CYCLE_TIME = 2;

    let cycle = 1;
    let cycleTimeOnCommand = 0;
    let currentCommandIndex = 0;
    const signalStrengths = [];

    const instructions = puzzleInput.split("\n");

    while (cycle <= CYCLES[CYCLES.length - 1]) {
        const command = instructions[currentCommandIndex];

        tick();

        if (command.includes("noop")) {
            if (cycleTimeOnCommand === 1) {
                cycleTimeOnCommand = 0;
                currentCommandIndex++;
            }
        } else if (command.includes("addx")) {
            if (cycleTimeOnCommand <= 1) {
                // do nothing
            } else {
                const amount = Number(command.replace("addx ", ""));
                registries.x += amount;
                cycleTimeOnCommand = 0;
                currentCommandIndex++;
            }
        }

        // get command
    }

    // while (cycle <= CYCLES[CYCLES.length - 1]) {
    //     console.log(registries.x);
    //
    //     if (instructions[currentCommandIndex].match(/noop/)) {
    //         currentCommandIndex += 1;
    //     } else if (
    //         instructions[currentCommandIndex].match(/^add(\w) (-?\d+)$/)
    //     ) {
    //         const match =
    //             instructions[currentCommandIndex].match(/^add(\w) (-?\d+)$/);
    //
    //         const register = match[1];
    //         const amount = Number(match[2]);
    //
    //         // adding to x needs two cycles to progress
    //         while (cycleTimeOnCommand < NEEDED_CYCLE_TIME - 1) {
    //             cycleTimeOnCommand++;
    //             tick();
    //         }
    //         cycleTimeOnCommand = 0;
    //
    //         currentCommandIndex++;
    //         registries[register] += amount;
    //     }
    //
    //     tick();
    // }

    console.log(instructions[currentCommandIndex]);
    console.log(signalStrengths);

    return signalStrengths.reduce((a, b) => a + b, 0);

    function tick() {
        console.log(`${cycle}: ${instructions[currentCommandIndex]}`);
        if (CYCLES.includes(cycle)) {
            signalStrengths.push(cycle * registries.x);
        }
        cycle++;
        cycleTimeOnCommand++;
    }

    function storeImportantCycleValues() {}
}
