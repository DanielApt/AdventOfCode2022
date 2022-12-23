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
    const ranges = puzzleInput
        .split("\n")
        .map((str) => str.match(/(\d+)-(\d+),(\d+)-(\d+)/))
        .map((result) => [
            [Number(result[1]), Number(result[2])],
            [Number(result[3]), Number(result[4])],
        ]);

    let totalRanges = 0;

    ranges.forEach((range) => {
        const a = range[0];
        const b = range[1];

        if (a[0] <= b[0] && a[1] >= b[1]) {
            totalRanges += 1;
        } else if (b[0] <= a[0] && b[1] >= a[1]) {
            totalRanges += 1;
        }
    });

    return totalRanges;
}
