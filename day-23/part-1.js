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

    getCoordinates() {
        return [this.x, this.y];
    }

    toString() {
        return "#";
    }
}

console.log(
    main(`.....
..##.
..#..
.....
..##.
.....
`)
);

let start = process.hrtime();
// console.log(main(sampleInput));
console.log(`Process took ${process.hrtime(start)[0]} seconds`);

start = process.hrtime();
// console.log(main(puzzleInput));
console.log(`Process took ${process.hrtime(start)[0]} seconds`);

/**
 * @param {String} puzzleInput
 * @return {Number}
 */
function main(puzzleInput) {
    // Create 2d array of elves

    const elves = [];

    puzzleInput.split("\n").forEach((row, y) =>
        row.split("").forEach((point, x) => {
            if (point === "#") {
                elves.push(new Elf(x, y));
            }
        })
    );

    console.log(elves);

    let totalRounds = 0;

    while (totalRounds !== 10) {
        round();
        totalRounds++;
    }

    function round() {
        // create proposal for each
        elves.forEach((elf) => {
            const { x, y } = elf;

            const n = elves.find((neighbour) =>
                _.isEqual(neighbour.getCoordinates(), [x, y - 1])
            );

            const ne = elves.find((neighbour) =>
                _.isEqual(neighbour.getCoordinates(), [x + 1, y - 1])
            );

            const e = elves.find((neighbour) =>
                _.isEqual(neighbour.getCoordinates(), [x + 1, y])
            );

            const se = elves.find((neighbour) =>
                _.isEqual(neighbour.getCoordinates(), [x + 1, y + 1])
            );

            const s = elves.find((neighbour) =>
                _.isEqual(neighbour.getCoordinates(), [x, y + 1])
            );

            const sw = elves.find((neighbour) =>
                _.isEqual(neighbour.getCoordinates(), [x - 1, y + 1])
            );

            const w = elves.find((neighbour) =>
                _.isEqual(neighbour.getCoordinates(), [x - 1, y])
            );

            const nw = elves.find((neighbour) =>
                _.isEqual(neighbour.getCoordinates(), [x - 1, y - 1])
            );

            // TODO: Go over these in another order
            if (!n && !ne && !nw) {
                elf.propose(x, y - 1);
            } else if (!s && !se && !sw) {
                elf.propose(x, y + 1);
            } else if (!w && !sw && !nw) {
                elf.propose(x - 1, y);
            } else if (!e && !sw && !nw) {
                elf.propose(x + 1, y);
            }
        });

        logElves(elves);

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

        // TODO: Log each step
        logElves(elves);
    }

    const xList = elves.map((elf) => elf.x);
    const yList = elves.map((elf) => elf.y);
    const xMin = Math.min(...xList);
    const xMax = Math.max(...xList);
    const yMin = Math.min(...yList);
    const yMax = Math.max(...yList);

    let emptySpaceCount = 0;

    for (let x = xMin; x <= xMax; x++) {
        for (let y = yMin; y <= yMax; y++) {
            if (!elves.find((elf) => elf.x === x && elf.y === y)) {
                emptySpaceCount++;
            }
        }
    }

    return emptySpaceCount;
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

    console.log(output);
}
