const fs = require("fs");

const sampleInput = fs.readFileSync("./sample-input.txt", "utf8");
const puzzleInput = fs.readFileSync("./input.txt", "utf8");

const SAND = "o";
const FALLING_SAND = "+";
const AIR = ".";
const ROCK = "#";

console.log(main(sampleInput));

console.log(main(puzzleInput));

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

            map[y][x] = ROCK;

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
                map[prevY][prevX] = ROCK;
            }
        });
    });

    map[0][500] = FALLING_SAND;

    while (drawNextSandPosition(map)) {
        // it automatically draws
    }

    return map.reduce((a, b) => [...a, ...b]).filter((point) => point === SAND)
        .length;
}

function drawEmptyMap(puzzleInput) {
    const map = [];

    const matches = puzzleInput.matchAll(/(\d+),(\d+)/g);

    const positions = [...matches].map((match) => [
        Number(match[1]),
        Number(match[2]),
    ]);

    positions.push([500, 0]);

    const xPositions = positions.map((pos) => pos[0]).sort((a, b) => a - b);
    const yPositions = positions.map((pos) => pos[1]).sort((a, b) => a - b);

    const minY = yPositions[0];
    const maxY = yPositions[yPositions.length - 1];
    const minX = xPositions[0];
    const maxX = xPositions[xPositions.length - 1];

    for (let y = minY; y <= maxY; y++) {
        map[y] = [];
        for (let x = minX; x <= maxX; x++) {
            map[y][x] = AIR;
        }
    }

    return map;
}

function getFallingSandPosition(map) {
    const y = map.findIndex((row) => row.indexOf(FALLING_SAND) !== -1);
    const x = map[y].indexOf(FALLING_SAND);

    return [x, y];
}

function drawNextSandPosition(map) {
    const [x, y] = getFallingSandPosition(map);

    // move down
    if (map[y + 1][x] === AIR) {
        map[y][x] = AIR;

        map[y + 1][x] = FALLING_SAND;
    } else if (map[y + 1][x - 1] === AIR) {
        map[y][x] = AIR;

        map[y + 1][x - 1] = FALLING_SAND;
    } else if (map[y + 1][x + 1] === AIR) {
        map[y][x] = AIR;

        map[y + 1][x + 1] = FALLING_SAND;
    } else if (
        map[y + 1][x - 1] === undefined ||
        map[y + 1][x] === undefined ||
        map[y + 1][x + 1] === undefined
    ) {
        // the next point is out of bounds, so stop here
        return false;
    } else {
        // no movement available, leave to rest
        map[y][x] = SAND;
        // add new falling sand
        map[0][500] = FALLING_SAND;
    }

    return true;
}
