const fs = require("fs");

const sampleInput = fs.readFileSync("./sample-input.txt", "utf8");
const puzzleInput = fs.readFileSync("./input.txt", "utf8");

// 9546 - answer too high

console.log(main(sampleInput));
console.log(main(puzzleInput));

/**
 * @param {String} puzzleInput
 * @return {Number}
 */
function main(puzzleInput) {
    const grid = puzzleInput.split('\n').map(row => row.split('').map(str => Number(str)));
    let visibleTrees = 0;

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (i === 0 || i === grid.length - 1 || j === 0 || j === grid[0].length - 1) {
                visibleTrees++;
                continue;
            }

            const tree = grid[i][j];

            // look left
            let leftBigger = false;
            for (let left = i; left > 1; left--) {
                if(grid[left][j] > tree) {
                    leftBigger = true;
                    break;
                }
            }

            let rightBigger = false;
            for (let right = i; right < grid[0].length - 1; right++) {
                if(grid[right][j] > tree) {
                    rightBigger = true;
                    break;
                }
            }

            let topBigger = false;
            for (let top = j; top > 1; top--) {
                if(grid[i][top] > tree) {
                    topBigger = true;
                    break;
                }
            }

            let bottomBigger = false;
            for (let bottom = j; bottom < grid.length - 1; bottom++) {
                if(grid[i][bottom] > tree) {
                    bottomBigger = true;
                    break;
                }
            }

            if (leftBigger || rightBigger || topBigger || bottomBigger) {
                visibleTrees++;
            }
        }
    }

    return visibleTrees;
}
