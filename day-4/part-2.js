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

    let totalOverlap = 0;

    ranges.forEach(range => {
        const a = createSections(range[0]);
        const b = createSections(range[1]);

        for (const section of a) {
            if (b.includes(section)) {
                totalOverlap++;
                break;
            }
        }
    });

    return totalOverlap;
}

/**
 * Returns every section in a range
 * @param {Array<Array<Number>>} range [2, 5]
 * @return {Array<Number>} [2, 3, 4, 5]
 */
function createSections(range) {
    const start = range[0];
    const end = range[1];

    const sections = [];

    for (let i = start; i <= end; i++) {
        sections.push(i);
    }

    return sections;
}