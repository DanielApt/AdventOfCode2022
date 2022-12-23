const fs = require("fs");

const sampleInput = fs.readFileSync("./sample-input.txt", "utf8");
const puzzleInput = fs.readFileSync("./input.txt", "utf8");

const OFFSET = 4;

console.log(main('bvwbjplbgvbhsrlpgdmjqwftvncz'));
console.log(main('nppdvjthqldpwncqszvftbrmjlhg'));
console.log(main('nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg'));

console.log(main(puzzleInput));

/**
 * @param {String} puzzleInput
 * @return {Number}
 */
function main(puzzleInput) {
    const characters = puzzleInput.split('');
    let markerIndex = 0;

    for (let i = 0; i < characters.length; i++) {
        const part = characters.slice(i, i + OFFSET);

        if (new Set([...part]).size === 4) {
            markerIndex = i + OFFSET;
            break;
        }
    }

    return markerIndex;
}
