const fs = require("fs");

const sampleInput = fs.readFileSync("./sample-input.txt", "utf8");
const puzzleInput = fs.readFileSync("./input.txt", "utf8");

// 9546 - answer too high
// 9447 - answer too high

console.log(main(sampleInput));
console.log(main(puzzleInput));

/**
 * @param {String} puzzleInput
 * @return {Number}
 */
function main(puzzleInput) {
    const grid = puzzleInput
        .split("\n")
        .map((row) => row.split("").map((str) => Number(str)));
    let visibleTrees = 0;

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            const left = grid[i].slice(0, j);
            const right = grid[i].slice(j + 1, grid[i].length);
            const top = grid.slice(0, i).map((row) => row[j]);
            const bottom = grid.slice(i + 1, grid.length).map((row) => row[j]);

            const tree = grid[i][j];

            if (
                left.length === 0 ||
                top.length === 0 ||
                right.length === 0 ||
                bottom.length === 0
            ) {
                visibleTrees++;
                continue;
            }

            if (
                tree > getBiggestItemFromArray(left) ||
                tree > getBiggestItemFromArray(top) ||
                tree > getBiggestItemFromArray(right) ||
                tree > getBiggestItemFromArray(bottom)
            ) {
                visibleTrees++;
            }
        }
    }

    return visibleTrees;
}

function getBiggestItemFromArray(arr) {
    return arr.sort((a, b) => b - a)[0];
}
