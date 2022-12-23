const fs = require("fs");

const sampleInput = fs.readFileSync("./sample-input.txt", "utf8");
const interimInput = fs.readFileSync("./interim-input.txt", "utf8");
const puzzleInput = fs.readFileSync("./input.txt", "utf8");

// 2942: too high

console.log(main(puzzleInput));

/**
 * @param {String} puzzleInput
 * @return {Number}
 */
function main(puzzleInput, size = 10) {
    const moves = puzzleInput
        .split("\n")
        .map((line) => line.match(/^(\w) (\d+)$/))
        .filter((move) => move !== null)
        .map((match) => [match[1], Number(match[2])]);

    console.log(moves);

    const knots = [];

    for (let i = 0; i < size; i++) {
        knots.push([0, 0]);
    }

    const tailPositions = [];

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
            knots.forEach((knot, index) => {
                if (index === 0) {
                    knot[0] += xFactor;
                    knot[1] += yFactor;
                } else {
                    const previousKnot = knots[index - 1];

                    knots[index] = getNewPosition(previousKnot, knot);
                }
            });

            stepsTaken++;
            tailPositions.push(String(knots[knots.length - 1]));
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

function getNewPosition(h, t) {
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

    // move diagonally
    h[1] > t[1] ? t[1]++ : t[1]--;
    h[0] > t[0] ? t[0]++ : t[0]--;

    return t;
}
