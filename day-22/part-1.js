const fs = require("fs");
const _ = require("lodash");

const sampleInput = fs.readFileSync("./sample-input.txt", "utf8");
const puzzleInput = fs.readFileSync("./input.txt", "utf8");

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

    let y = 0;
    let x = map[y].indexOf(".");
    let degrees = 90;

    map[y][x] = "@";

    instructions.forEach((instruction) => {
        const match = instruction.split(/(\d+)([A-Z])/);
        const movement = Number(match[1]);
        const rotation = match[2];

        // console.clear();

        // console.log(`Moving ${movement} in ${getDirection(degrees)}`);
        // console.log(
        //     map
        //         .slice(0, 50)
        //         .map((row) => row.join(""))
        //         .join("\n")
        // );

        // move until we hit a wall or reach our end-point
        step(movement);

        // do something about the rotation
        degrees += rotation === "R" ? 90 : -90;
    });

    const row = map.findIndex((row) => row.includes("@")) + 1;
    const column = map[row - 1].indexOf("@") + 1;
    let facing = 0;

    switch (degrees % 360) {
        case 90:
            facing = 0;
            break;

        case 180:
            facing = 1;
            break;

        case 270:
            facing = 2;
            break;

        case 0:
            facing = 3;
            break;
    }

    return 1000 * row + 4 * column + facing;

    function step(movement, stepsTaken = 0) {
        y = map.findIndex((row) => row.includes("@"));
        x = map[y].findIndex((point) => point === "@");

        if (stepsTaken === movement) {
            return;
        }

        let xMovement = Math.round(Math.sin((degrees * Math.PI) / 180));
        let yMovement = Math.round(-Math.cos((degrees * Math.PI) / 180));

        let newX = x + xMovement;
        let newY = y + yMovement;

        if (newY === -1) {
            newY = map.length - 1;
        } else if (newY === map.length) {
            newY = 0;
        }

        if (map[newY][newX] === undefined || map[newY][newX] === " ") {
            if (xMovement === 1) {
                newX = map[newY].findIndex((point) =>
                    [".", "#"].includes(point)
                );
            } else if (xMovement === -1) {
                newX = _.findLastIndex(map[newY], (point) =>
                    [".", "#"].includes(point)
                );
            } else if (yMovement === 1) {
                newY = map.findIndex((row) => [".", "#"].includes(row[newX]));
            } else if (yMovement === -1) {
                newY = _.findLastIndex(map, (row) =>
                    [".", "#"].includes(row[x])
                );
            }
        }

        if (map[newY][newX] === ".") {
            map[y][x] = ".";
            map[newY][newX] = "@";
            step(movement, stepsTaken + 1);
        } else if (map[newY][newX] === "#") {
            // we've reached a wall
            return;
        } else {
            console.error("edge case");
        }
    }
}

function getDirection(degrees) {
    switch (degrees % 360) {
        case 0:
            return "^";

        case 90:
            return ">";

        case 180:
            return "v";

        case 270:
            return "<";
    }
}
