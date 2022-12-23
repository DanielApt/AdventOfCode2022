const fs = require("fs");

const sampleInput = fs.readFileSync("./sample-input.txt", "utf8");
const puzzleInput = fs.readFileSync("./input.txt", "utf8");

console.log(main(sampleInput));
// console.log(main(puzzleInput));

/**
 * @param {String} puzzleInput
 * @return {Number}
 */
function main(puzzleInput) {
    const rockLines = puzzleInput.split("\n").map((str) =>
        str
            .replace(/ ->/g, "")
            .split(" ")
            .map((str) => str.split(",").map((str) => Number(str)))
    );

    const map = drawEmptyMap(puzzleInput);

    rockLines.forEach((rocks) => {
        rocks.forEach((rock, index) => {
            const [x, y] = rock;

            map[y][x] = "#";

            const previousRock = rocks[index - 1];
            if (!previousRock) {
                return;
            }

            let [prevX, prevY] = previousRock;

            const amountX = x - prevX;
            const amountY = y - prevY;
            let xFactor;
            let yFactor;

            if (amountX === 0) {
                xFactor = 0;
            } else if (amountX > 0) {
                xFactor = 1;
            } else {
                xFactor = -1;
            }

            if (amountY === 0) {
                yFactor = 0;
            } else if (amountY > 0) {
                yFactor = 1;
            } else {
                yFactor = -1;
            }

            while (x !== prevX || y !== prevY) {
                prevY += yFactor;
                prevX += xFactor;
                map[prevY][prevX] = "#";
            }
        });
    });

    logMap(map);
    return 0;
}

function logMap(_map) {
    console.log(_map.map((row) => row.join("")).join("\n"));
}

function drawEmptyMap(puzzleInput) {
    const SAND = [500, 0];
    const map = [];

    const matches = puzzleInput.matchAll(/(\d+),(\d+)/g);

    const positions = [...matches].map((match) => [
        Number(match[1]),
        Number(match[2]),
    ]);

    positions.push(SAND);

    const xPositions = positions.map((pos) => pos[0]).sort((a, b) => a - b);
    const yPositions = positions.map((pos) => pos[1]).sort((a, b) => a - b);

    const minY = yPositions[0];
    const maxY = yPositions[yPositions.length - 1];
    const minX = xPositions[0];
    const maxX = xPositions[xPositions.length - 1];

    for (let y = minY; y <= maxY; y++) {
        map[y] = [];
        for (let x = minX; x <= maxX; x++) {
            map[y][x] = ".";
        }
    }

    return map;
}
