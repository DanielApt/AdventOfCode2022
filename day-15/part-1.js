const fs = require("fs");

const sampleInput = fs.readFileSync("./sample-input.txt", "utf8");
const puzzleInput = fs.readFileSync("./input.txt", "utf8");
const SENSOR = "S";
const BEACON = "B";
const UNAVAILABLE = "#";
const AIR = ".";
const PADDING = 100;

// 3974215 - answer is too low
// 3974214 - did not try as already too low
// 4121145 - answer is too low
// 7487721 - answer is too high
// 7487720 - not the right answer

console.log(main(sampleInput, 10));

console.log(main(puzzleInput, 2000000));

/**
 * @param {String} puzzleInput
 * @param {Number} yToScan
 * @return {Number}
 */
function main(puzzleInput, yToScan) {
    const line = createLine(puzzleInput);
    // const line = [];

    // add sensors and beacons
    const positions = puzzleInput.split("\n").map((row, index) => {
        const numbers = row.match(/-?\d+/g).map((str) => Number(str));
        const sensor = {
            x: numbers[0],
            y: numbers[1],
        };

        const beacon = {
            x: numbers[2],
            y: numbers[3],
        };

        // add unavailable areas
        const distance = getManhattanDistance(sensor, beacon);

        return {
            sensor,
            beacon,
            distance,
        };
    });

    const validPositions = positions.filter(
        (position) =>
            // only take position which are within the sensor to beacon manhattan distance
            getManhattanDistance(position.sensor, {
                x: position.sensor.x,
                y: yToScan,
            }) <= position.distance
    );

    validPositions.forEach((position) => {
        const yDistance = Math.abs(position.sensor.y - yToScan);
        const xDistance = position.distance - yDistance;

        for (
            let i = position.sensor.x - xDistance;
            i <= position.sensor.x + xDistance + 1;
            i++
        ) {
            line[i] = UNAVAILABLE;
        }
    });

    return line.filter((point) => point === UNAVAILABLE).length;
}

function createLine(puzzleInput) {
    const line = [];

    const xCoordinates = puzzleInput
        .match(/x=(-?\d+)/g)
        .map((str) => Number(str.replace("x=", "")));

    const xMin = Math.min(...xCoordinates) - PADDING;
    const xMax = Math.max(...xCoordinates) + PADDING;

    for (let x = xMin; x <= xMax; x++) {
        line[x] = AIR;
    }

    return line;
}

function getManhattanDistance(p1, p2) {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}
