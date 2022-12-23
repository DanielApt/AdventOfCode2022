const fs = require("fs");
const _ = require("lodash");

const CHAMBER_SIZE = 7;
const ABOVE = 3;

const sampleInput = fs.readFileSync("./sample-input.txt", "utf8");
const puzzleInput = fs.readFileSync("./input.txt", "utf8");

const ROCKS = `####

.#.
###
.#.

..#
..#
###

#
#
#
#

##
##`
    .replaceAll("#", "@")
    .split("\n\n")
    .map((str) => str.split("\n"));

console.log(main(sampleInput));
// console.log(main(puzzleInput));

/**
 * @param {String} puzzleInput
 * @return {Number}
 */
function main(puzzleInput) {
    let chamber = [new Array(CHAMBER_SIZE).fill("-")];

    const jets = puzzleInput.split("");

    let jetIndex = 0;
    let droppedRocks = 0;
    let count = 0;
    let prevRocks;
    while (droppedRocks <= 2023) {
        if (prevRocks !== droppedRocks) {
            prevRocks = droppedRocks;

            chamber = chamber.filter(
                (row) => row.filter((p) => p === ".").length !== CHAMBER_SIZE
            );

            chamber = addRockToChamber(
                ROCKS[droppedRocks % ROCKS.length],
                chamber
            );

            // console.log(chamber.map((row) => row.join("")).join("\n"));
        }

        // first let the jet move the rock
        const direction = jets[jetIndex % jets.length];
        chamber = move(direction, chamber);
        // console.log(chamber.map((row) => row.join("")).join("\n"));
        jetIndex++;

        // then move down
        chamber = move("v", chamber);
        // console.log(chamber.map((row) => row.join("")).join("\n"));
        count++;

        // move to the next jet
    }

    return chamber.length;

    function addRockToChamber(rock, chamber) {
        const normalizeRock = [
            ...rock
                .map((rowStr) => `..${rowStr}`)
                .map((rowStr) => rowStr.padEnd(7, ".").split("")),
        ];
        const emptyRows = [...new Array(ABOVE)].map((row) =>
            new Array(CHAMBER_SIZE).fill(".")
        );
        return [...normalizeRock, ...emptyRows, ...chamber];
    }

    function move(direction, chamber) {
        const newChamber = JSON.parse(JSON.stringify(chamber));

        let xDirection = 0;
        let yDirection = 0;
        let xStart = 0;
        let xEnd = CHAMBER_SIZE;

        const yToStartScanningFrom = _.findLast(newChamber, (row) =>
            row.includes("@")
        );

        if (direction === ">") {
            xDirection = 1;
            // we need to read in reverse
            xStart = CHAMBER_SIZE;
            xEnd = -1;
        } else if (direction === "<") {
            xDirection = -1;
        } else {
            // this is a down movement
            yDirection = 1;
        }

        for (let y = newChamber.length - 1; y >= 0; y--) {
            for (
                let x = xStart;
                x !== xEnd;
                x -= xDirection === 0 ? -1 : xDirection
            ) {
                if (newChamber[y][x] === "@") {
                    // try and move it in the direction
                    if (newChamber[y + yDirection][x + xDirection] === ".") {
                        newChamber[y + yDirection][x + xDirection] = "@";
                        newChamber[y][x] = ".";
                    } else {
                        // cannot move, so we need to put the rock to rest

                        if (yDirection === 0) {
                            return chamber;
                        }

                        droppedRocks++;

                        return chamber.map((row) =>
                            // replace all @ to #, indicating the rock has come to rest
                            row.map((point) => point.replace("@", "#"))
                        );
                    }
                }
            }
        }

        return newChamber;

        // const newChamber = chamber;
        // let canMove = true;
        // let xFactor = 0;
        // let xStart = 0;
        // let xEnd = 0;
        //
        // if (direction === ">") {
        //     xFactor = 1;
        //     xStart = 0;
        //     xEnd = CHAMBER_SIZE;
        // } else if (direction === "<") {
        //     xFactor = -1;
        //     xStart = CHAMBER_SIZE;
        //     xEnd = 0;
        // }
        //
        // newChamber
        //     .filter((row) => row.includes("@"))
        //     .forEach((row, index) => {
        //         let x = xStart;
        //
        //         while (x !== xEnd) {
        //             x += xFactor;
        //         }
        //
        //         for (let x = 0; x < row.length; x++) {
        //             const nextPoint = row[x + xFactor];
        //
        //             if (nextPoint === ".") {
        //                 row[x + xFactor] = "@";
        //                 row[x] = ".";
        //             } else {
        //                 // cannot move, break the loop
        //                 break;
        //             }
        //         }
        //     });
        //
        // return canMove ? newChamber : chamber;
    }
}
