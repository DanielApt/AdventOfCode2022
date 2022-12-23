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
    let x = 1;

    let image = "";
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
                x += amount;
                cycleTimeOnCommand = 0;
                currentCommandIndex++;
            }
        }
    }

    console.log(instructions[currentCommandIndex]);
    console.log(signalStrengths);

    return signalStrengths.reduce((a, b) => a + b, 0);

    function tick() {
        console.log(`${cycle}: ${instructions[currentCommandIndex]}`);
        if (CYCLES.includes(cycle)) {
            signalStrengths.push(cycle * x);
        }
        cycle++;
        cycleTimeOnCommand++;
    }
}
