const fs = require("fs");
const _ = require("lodash");

const sampleInput = fs.readFileSync("./sample-input.txt", "utf8");
const puzzleInput = fs.readFileSync("./input.txt", "utf8");

const [NORTH, EAST, SOUTH, WEST] = ["north", "east", "south", "west"];

const MOVEMENTS = {
    [NORTH]: {
        dy: -1,
        dx: 0,
    },
    [EAST]: {
        dy: 0,
        dx: 1,
    },
    [SOUTH]: {
        dy: 1,
        dx: 0,
    },
    [WEST]: {
        dy: 0,
        dx: -1,
    },
};

// 60372 is not right
// 60373 is not right
// 60374 is too high
// 60375 is too high

let start = process.hrtime();
console.log(main(sampleInput));
console.log(`Process took ${process.hrtime(start)[0]} seconds`);

start = process.hrtime();
console.log(main(puzzleInput));
console.log(`Process took ${process.hrtime(start)[0]} seconds`);

/**
 * @param {String} puzzleInput
 * @return {Number}
 */
function main(puzzleInput) {
    const [mapInput, instructionInput] = puzzleInput.split("\n\n");
    const instructions = instructionInput.match(/\d+[A-Z]/g);

    const map = mapInput.split("\n").map((row) => row.split(""));

    let y = map.findIndex((r) => r.includes("."));
    let x = map[y].indexOf(".");
    let direction = EAST;

    map[y][x] = "@";

    instructions.forEach((instruction) => {
        const match = instruction.split(/(\d+)([A-Z])/);
        const movement = Number(match[1]);
        const rotation = match[2];

        // move until we hit a wall or reach our end-point
        step(movement);

        // do something about the rotation
        if (rotation === "R") {
            switch (direction) {
                case EAST:
                    direction = SOUTH;
                    break;
                case SOUTH:
                    direction = WEST;
                    break;

                case WEST:
                    direction = NORTH;
                    break;

                case NORTH:
                    direction = EAST;
            }
        } else if (rotation === "L") {
            switch (direction) {
                case EAST:
                    direction = NORTH;
                    break;
                case NORTH:
                    direction = WEST;
                    break;

                case WEST:
                    direction = SOUTH;
                    break;

                case SOUTH:
                    direction = EAST;
            }
        }
    });

    const row = y + 1;
    const column = x + 1;

    return (
        1000 * row + 4 * column + [EAST, SOUTH, WEST, NORTH].indexOf(direction)
    );

    function step(movement, stepsTaken = 0) {
        // console.clear();
        //
        // console.log(
        //     map
        //         .slice(0, 50)
        //         .map((row) => row.join(""))
        //         .join("\n")
        // );

        if (stepsTaken === movement) {
            return;
        }

        y = map.findIndex((row) => row.includes("@"));
        x = map[y].findIndex((point) => point === "@");

        let { dx, dy } = MOVEMENTS[direction];

        let newX = x + dx;
        let newY = y + dy;

        if (!map[newY] || !map[newY][newX] || map[newY][newX] === " ") {
            // keep moving in reverse, until we hit a tile again
            while (
                map[newY - dy] &&
                map[newY - dy][newX - dx] &&
                map[newY - dy][newX - dx] !== " "
            ) {
                newX -= dx;
                newY -= dy;
            }
        }

        let next = map[newY][newX];

        if (next === ".") {
            map[y][x] = ".";
            map[newY][newX] = "@";
            step(movement, stepsTaken + 1);
        } else if (next === "#") {
            // it is a wall
            // do nothing
        }
    }
}
