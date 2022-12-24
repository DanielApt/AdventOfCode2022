const fs = require("fs");
const _ = require("lodash");

const sampleInput = fs.readFileSync("./sample-input.txt", "utf8");
const puzzleInput = fs.readFileSync("./input.txt", "utf8");

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

    instructions.forEach((instruction, index) => {
        const match = instruction.split(/(\d+)([A-Z])/);
        const movement = Number(match[1]);
        const rotation = match[2];

        if (index === 73) {
            console.log("start paying attention");
        }

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
        // console.clear();
        //
        // console.log(map.map((row) => row.join("")).join("\n"));

        if (movement === stepsTaken) {
            return;
        }

        let xMovement = Math.round(Math.sin((degrees * Math.PI) / 180));
        let yMovement = Math.round(-Math.cos((degrees * Math.PI) / 180));

        let next;

        if (map[y + yMovement] === undefined) {
            next = undefined;
        } else {
            next = map[y + yMovement][x + xMovement];
        }

        if (next === undefined || next === " ") {
            let newX;
            let newY;
            if (xMovement === 1) {
                newX = map[y].findIndex((point) => [".", "#"].includes(point));
            } else if (xMovement === -1) {
                newX = _.findLastIndex(map[y], (point) =>
                    [".", "#"].includes(point)
                );
            }

            if (yMovement === 1) {
                newY = map.findIndex((row) => [".", "#"].includes(row[x]));
            } else if (yMovement === -1) {
                newY = _.findLastIndex(map, (row) =>
                    [".", "#"].includes(row[x])
                );
            }

            xMovement = xMovement === 0 ? 0 : newX - x;
            yMovement = yMovement === 0 ? 0 : newY - y;
            next = map[y + yMovement][x + xMovement];
        }

        if (next === ".") {
            map[y][x] = ".";
            x += xMovement;
            y += yMovement;
            map[y][x] = "@";
            step(movement, stepsTaken + 1);
        } else if (next === "#") {
            // stop here
            stepsTaken = movement;
            step(movement, stepsTaken);
        }
    }
}
