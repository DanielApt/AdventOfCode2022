const fs = require("fs");

const sampleInput = fs.readFileSync("./sample-input.txt", "utf8");
const puzzleInput = fs.readFileSync("./input.txt", "utf8");

console.log(main(sampleInput));

console.log(main(puzzleInput));

/**
 * @param {String} puzzleInput
 * @return {Number}
 */
function main(puzzleInput) {
    const moves = puzzleInput
        .split("\n")
        .map((line) => line.match(/^(\w) (\d+)$/))
        .filter((move) => move !== null)
        .map((match) => [match[1], Number(match[2])]);

    console.log(moves);

    const tailPositions = [];

    const hPosition = [0, 0];
    const tPosition = [0, 0];

    moves.forEach(([direction, amount]) => {
        let xFactor = 0;
        let yFactor = 0;
        let stepsTaken = 0;

        switch (direction) {
            case "U":
                yFactor = -1;
                break;
            case "R":
                xFactor = 1;
                break;
            case "D":
                yFactor = 1;
                break;

            case "L":
                xFactor = -1;
                break;
        }

        console.log([direction, amount]);

        while (stepsTaken < amount) {
            // take a step
            hPosition[0] += xFactor;
            hPosition[1] += yFactor;
            console.log(hPosition);
            stepsTaken++;

            // figure something out with tPosition
            const [tailX, tailY] = getNewTailPosition(hPosition, tPosition);
            tPosition[0] = tailX;
            tPosition[1] = tailY;
            tailPositions.push(tPosition.join(","));
        }
    });

    // move tail

    console.log(tailPositions);

    return new Set([...tailPositions]).size;
}

/**
 * Get new tail position
 *
 * @param h {[Number, Number]}
 * @param t {[Number, Number]}
 * @return {[Number, Number]}
 */

/*
If the head is ever two steps directly up, down, left, or right from the tail,
the tail must also move one step in that direction so it remains close enough:

Otherwise, if the head and tail aren't touching and aren't in the same row or column,
the tail always moves one step diagonally to keep up:
 */
function getNewTailPosition(h, t) {
    const xDistance = Math.abs(h[0] - t[0]);
    const yDistance = Math.abs(h[1] - t[1]);

    if (xDistance <= 1 && yDistance <= 1) {
        return t;
    }

    // move up or down
    if (xDistance === 0) {
        h[1] > t[1] ? t[1]++ : t[1]--;
        return t;
    }

    // move left or right
    if (yDistance === 0) {
        h[0] > t[0] ? t[0]++ : t[0]--;
        return t;
    }

    h[1] > t[1] ? t[1]++ : t[1]--;
    h[0] > t[0] ? t[0]++ : t[0]--;

    // figure out how to move diagonally

    return t;
}
