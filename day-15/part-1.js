const fs = require("fs");

const sampleInput = fs.readFileSync("./sample-input.txt", "utf8");
const puzzleInput = fs.readFileSync("./input.txt", "utf8");
const SENSOR = "S";
const BEACON = "B";
const UNAVAILABLE = "#";
const AIR = ".";

console.log(main(sampleInput, 10));

console.log(main(puzzleInput, 2000000));

/**
 * @param {String} puzzleInput
 * @param {Number} rowToScan
 * @return {Number}
 */
function main(puzzleInput, rowToScan) {
    const grid = createGrid(puzzleInput);

    // add sensors and beacons
    puzzleInput.split("\n").forEach((line, index) => {
        const numbers = line.match(/-?\d+/g).map((str) => Number(str));
        const xSensor = numbers[0];
        const ySensor = numbers[1];
        const xBeacon = numbers[2];
        const yBeacon = numbers[3];

        grid[ySensor][xSensor] = SENSOR;
        grid[yBeacon][xBeacon] = BEACON;

        // add unavailable areas
        const distance = getManhattanDistance(
            [xSensor, ySensor],
            [xBeacon, yBeacon]
        );

        console.log(distance);

        for (let x = -1 * distance; x <= distance; x++) {
            for (
                let y = -1 * (distance - Math.abs(x));
                y <= distance - Math.abs(x);
                y++
            ) {
                if (!grid[y + ySensor]) {
                    grid[y + ySensor] = [];
                    // continue;
                }

                if (grid[y + ySensor][x + xSensor] === AIR) {
                    grid[y + ySensor][x + xSensor] = UNAVAILABLE;
                }
            }
        }
    });

    console.log(grid.map((row) => row.join("")).join("\n"));

    return grid[rowToScan - 1].filter(
        (point) => ![BEACON, SENSOR].includes(point)
    ).length;
}

function createGrid(puzzleInput) {
    console.log(`starting grid`);
    const grid = [];

    // yMax should be 23

    const xCoordinates = puzzleInput
        .match(/x=(-?\d+)/g)
        .map((str) => Number(str.replace("x=", "")));

    const yCoordinates = puzzleInput
        .match(/y=(-?\d+)/g)
        .map((str) => Number(str.replace("y=", "")));

    const xMin = Math.min(...xCoordinates);
    const xMax = Math.max(...xCoordinates);

    const yMin = Math.min(...yCoordinates);
    const yMax = Math.max(...yCoordinates);

    console.log(`creating grid`);

    for (let y = yMin; y <= yMax; y++) {
        grid[y] = [];
        for (let x = xMin; x <= xMax; x++) {
            grid[y][x] = AIR;
        }
    }

    return grid;
}

function getManhattanDistance(p1, p2) {
    return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
}
