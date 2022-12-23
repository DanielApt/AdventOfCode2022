const fs = require("fs");

const sampleInput = fs.readFileSync("./sample-input.txt", "utf8");
const puzzleInput = fs.readFileSync("./input.txt", "utf8");

const CYCLES = [20, 60, 100, 140, 180, 220];

// 16620 - too high

const ROW = 40;
const HEIGHT = 6;

// console.log(main(sampleInput));
console.log(main(puzzleInput));
//r
/**
 * @param {String} puzzleInput
 * @return {String}
 */
function main(puzzleInput) {
    let x = 1;

    let image = "";
    let cycle = 1;
    let cycleTimeOnCommand = 0;
    let currentCommandIndex = 0;

    const instructions = puzzleInput.split("\n");

    while (cycle <= ROW * HEIGHT) {
        const command = instructions[currentCommandIndex];
        draw();
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

    return image;

    function draw() {
        if (cycle % 40 === 1) {
            image += "\n";
        }

        const pixelToInsert =
            Math.abs(cycle - 1 - x - Math.floor(cycle / ROW) * ROW) <= 1
                ? "#"
                : ".";

        image += pixelToInsert;
    }

    function tick() {
        cycle++;
        cycleTimeOnCommand++;
    }
}
