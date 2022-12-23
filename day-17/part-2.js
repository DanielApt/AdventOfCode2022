const fs = require("fs");
const _ = require("lodash");

const CHAMBER_SIZE = 7;
const ABOVE = 3;
const TARGET = 1000000000000;
const MAGIC_NUMBER = 2702;

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

// 1566763848395 answer is too low
// 1570930232581 answer is too low

console.log(main(sampleInput));
// console.log(main(puzzleInput));

/**
 * @param {String} puzzleInput
 * @return {Number}
 */
function main(puzzleInput) {
    const memory = new Map();
    const time = process.hrtime();
    let chamber = [new Array(CHAMBER_SIZE).fill("-")];

    const jets = puzzleInput.split("");

    let jetIndex = 0;
    let droppedRocks = 0;
    let prevRocks = -1;

    let preCalculatedHeight = 0;
    let speedrun = false;

    while (droppedRocks < TARGET) {
        if (prevRocks !== droppedRocks) {
            const currentRock = ROCKS[droppedRocks % ROCKS.length];

            const key = `${jetIndex % jets.length}-${JSON.stringify(
                currentRock
            )}`;

            if (memory.has(key)) {
                // we've seen this rock / jet index combination before, we know how much we gain in height!!
                const record = memory.get(key);

                // if (getHeight(chamber) - record.height === MAGIC_NUMBER) {
                const rocksPerCycle = droppedRocks - record.droppedRocks;
                const heightPerCycle = getHeight(chamber) - record.height;
                const remainingRocks = TARGET - droppedRocks;
                let possibleCycles = Math.floor(remainingRocks / rocksPerCycle);

                possibleCycles = 1;

                droppedRocks += possibleCycles * rocksPerCycle;
                preCalculatedHeight += possibleCycles * heightPerCycle;

                // console.log("this is interesting!");
                console.log(
                    `Height: ${getHeight(chamber) - record.height}, rocks: ${
                        droppedRocks - record.droppedRocks
                    }`
                );
                // }
            } else {
                console.log("pattern is broken");
            }

            memory.set(key, { height: getHeight(chamber), droppedRocks });

            prevRocks = droppedRocks;

            chamber = removeEmptyRowsFromChamber(chamber);

            chamber = addRockToChamber(currentRock, chamber);
        }

        // first let the jet move the rock
        const direction = jets[jetIndex % jets.length];
        chamber = move(direction, chamber);
        jetIndex++;

        // then move down
        chamber = move("v", chamber);
    }

    const diff = process.hrtime(time);
    console.log(`Script took ${diff[0]} seconds`);
    return getHeight(chamber) + preCalculatedHeight - 1;

    function getHeight(chamber) {
        return removeEmptyRowsFromChamber(chamber).length - 1;
    }

    function removeEmptyRowsFromChamber(chamber) {
        return chamber.filter(
            (row) => row.filter((p) => p === ".").length !== CHAMBER_SIZE
        );
    }

    function addRockToChamber(rock, chamber) {
        const normalizeRock = [
            ...rock
                .map((rowStr) => `..${rowStr}`)
                .map((rowStr) => rowStr.padEnd(7, ".").split("")),
        ];
        const emptyRows = [...new Array(ABOVE)].map(() =>
            new Array(CHAMBER_SIZE).fill(".")
        );
        return [...normalizeRock, ...emptyRows, ...chamber];
    }

    function move(direction, chamber) {
        const newChamber = JSON.parse(JSON.stringify(chamber));

        const yStart = _.findLastIndex(newChamber, (row) => row.includes("@"));
        const yEnd = _.findIndex(newChamber, (row) => row.includes("@"));

        if (direction === ">") {
            for (let y = yStart; y >= yEnd; y--) {
                for (let x = CHAMBER_SIZE; x >= 0; x--) {
                    if (newChamber[y][x] === "@") {
                        if (newChamber[y][x + 1] === ".") {
                            newChamber[y][x + 1] = "@";
                            newChamber[y][x] = ".";
                        } else {
                            return chamber;
                        }
                    }
                }
            }
        } else if (direction === "<") {
            for (let y = yStart; y >= yEnd; y--) {
                for (let x = 0; x < CHAMBER_SIZE; x++) {
                    if (newChamber[y][x] === "@") {
                        if (newChamber[y][x - 1] === ".") {
                            newChamber[y][x - 1] = "@";
                            newChamber[y][x] = ".";
                        } else {
                            return chamber;
                        }
                    }
                }
            }
        } else {
            // this is a down movement
            for (let y = yStart; y >= yEnd; y--) {
                for (let x = 0; x < CHAMBER_SIZE; x++) {
                    if (newChamber[y][x] === "@") {
                        if (newChamber[y + 1][x] === ".") {
                            newChamber[y + 1][x] = "@";
                            newChamber[y][x] = ".";
                        } else {
                            // don't move down, but come to rest
                            droppedRocks++;
                            return chamber.map((row) =>
                                row.map((point) => point.replace("@", "#"))
                            );
                        }
                    }
                }
            }
        }

        return newChamber;
    }
}
