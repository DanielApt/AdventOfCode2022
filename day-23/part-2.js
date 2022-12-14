const fs = require("fs");
const _ = require("lodash");

const sampleInput = fs.readFileSync("./sample-input.txt", "utf8");
const puzzleInput = fs.readFileSync("./input.txt", "utf8");

class Elf {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        return "#";
    }

    propose(x, y) {
        this.proposedX = x;
        this.proposedY = y;
    }

    getProposal() {
        return [this.proposedX, this.proposedY];
    }

    moveToProposal() {
        this.x = this.proposedX === null ? this.x : this.proposedX;
        this.y = this.proposedY === null ? this.y : this.proposedY;
        this.clearProposal();
    }

    clearProposal() {
        this.proposedX = null;
        this.proposedY = null;
    }

    toString() {
        return "#";
    }
}

let start = process.hrtime();
console.log(main(sampleInput));
console.log(`Process took ${process.hrtime(start)[0]} seconds`);

start = process.hrtime();
console.log(main(puzzleInput)); // this took 13 minutes!
console.log(`Process took ${process.hrtime(start)[0]} seconds`);

/**
 * @param {String} puzzleInput
 * @return {Number}
 */
function main(puzzleInput) {
    const elves = [];

    // this is an array of checks. Elves will check if the first movement works, followed, by the second, etc.
    // after each move, the order is shifted, with the first check going to the end
    const checks = [
        getNorthMovement,
        getSouthMovement,
        getWestMovement,
        getEastMovement,
    ];

    puzzleInput.split("\n").forEach((row, y) =>
        row.split("").forEach((point, x) => {
            if (point === "#") {
                elves.push(new Elf(x, y));
            }
        })
    );

    console.log(elves);

    let previousRound = "";
    let currentRound = "";
    let totalRounds = 0;

    // first round
    previousRound = JSON.stringify(elves);
    let sameOutput = false;

    // keep running rounds, until the current round output is the same as the previous round
    while (!sameOutput) {
        round();
        currentRound = JSON.stringify(elves);

        if (previousRound === currentRound) {
            sameOutput = true;
        } else {
            previousRound = currentRound;
        }

        totalRounds++;

        // move the first check to the back
        checks.push(checks.shift());
    }

    return totalRounds;

    function round() {
        // create proposal for each
        elves.forEach((elf) => {
            const movement = checks.find((check) => check(elf));

            if (isNotSurrounded(elf)) {
                elf.clearProposal();
            } else if (movement) {
                const newPos = movement(elf);
                elf.propose(newPos[0], newPos[1]);
            }
        });

        const proposals = elves.map((e) => e.getProposal());

        elves.forEach((elf) => {
            if (
                proposals.filter((p) => _.isEqual(p, elf.getProposal()))
                    .length > 1
            ) {
                elf.clearProposal();
            }
        });

        elves.forEach((elf) => elf.moveToProposal());

        console.log(`End of ${totalRounds + 1}:`);
        logElves(elves);
    }

    function isNotSurrounded(elf) {
        return (
            checks.filter(
                (checkFunction) => typeof checkFunction(elf) === "object"
            ).length === checks.length
        );
    }

    function getNorthMovement(elf) {
        const { x, y } = elf;

        const elvesInNorth = elves.find(
            (e) => Math.abs(e.x - elf.x) <= 1 && e.y === elf.y - 1
        );

        if (elvesInNorth) {
            return false;
        } else {
            return [x, y - 1];
        }
    }

    function getSouthMovement(elf) {
        const { x, y } = elf;

        const elvesInSouth = elves.find(
            (e) => Math.abs(e.x - elf.x) <= 1 && e.y === elf.y + 1
        );

        if (elvesInSouth) {
            return false;
        } else {
            return [x, y + 1];
        }
    }

    function getWestMovement(elf) {
        const { x, y } = elf;

        const elvesInWest = elves.find(
            (e) => e.x === elf.x - 1 && Math.abs(e.y - elf.y) <= 1
        );

        if (elvesInWest) {
            return false;
        } else {
            return [x - 1, y];
        }
    }

    function getEastMovement(elf) {
        const { x, y } = elf;

        const elvesInEast = elves.find(
            (e) => e.x === elf.x + 1 && Math.abs(e.y - elf.y) <= 1
        );

        if (elvesInEast) {
            return false;
        } else {
            return [x + 1, y];
        }
    }
}

function logElves(elves) {
    let output = ``;

    const xList = elves.map((elf) => elf.x);
    const yList = elves.map((elf) => elf.y);
    const xMin = Math.min(...xList);
    const xMax = Math.max(...xList);
    const yMin = Math.min(...yList);
    const yMax = Math.max(...yList);

    let y = yMin;
    let x = xMin;

    while (y <= yMax) {
        const e = elves.find((elf) => elf.x === x && elf.y === y);

        if (e) {
            output += "#";
        } else {
            output += ".";
        }

        x++;

        if (x > xMax) {
            x = xMin;
            y++;
            output += "\n";
        }
    }

    // console.log(output);

    return output;
}
