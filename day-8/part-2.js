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
    const grid = puzzleInput
        .split("\n")
        .map((row) => row.split("").map((str) => Number(str)));

    const visibleScores = [];

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            const left = grid[i].slice(0, j).reverse();
            const right = grid[i].slice(j + 1, grid[i].length);
            const top = grid.slice(0, i).map((row) => row[j]).reverse();
            const bottom = grid.slice(i + 1, grid.length).map((row) => row[j]);

            if (
                left.length === 0 ||
                top.length === 0 ||
                right.length === 0 ||
                bottom.length === 0
            ) {
                continue;
            }

            const tree = grid[i][j];

            const leftVisible = getVisibleTrees(left, tree);
            const topVisible = getVisibleTrees(top, tree);
            const rightVisible = getVisibleTrees(right, tree);
            const bottomVisible = getVisibleTrees(bottom, tree);

            const visibleScore = [
                leftVisible,
                topVisible,
                rightVisible,
                bottomVisible,
            ]
                .filter((score) => score !== 0)
                .reduce((a, b) => a * b);

            visibleScores.push(visibleScore);
        }
    }

    return getBiggestItemFromArray(visibleScores);
}

function getVisibleTrees(arr, current) {
    let visibleTrees = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] >= current) {
            visibleTrees++;
            break;
        } else {
            visibleTrees++;
        }
    }

    return visibleTrees;
}

function getBiggestItemFromArray(arr) {
    return arr.sort((a, b) => b - a)[0];
}
