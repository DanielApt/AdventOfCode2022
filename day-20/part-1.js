const fs = require("fs");

const sampleInput = fs.readFileSync("./sample-input.txt", "utf8");
const puzzleInput = fs.readFileSync("./input.txt", "utf8");

console.log(main(sampleInput));
console.log(main(puzzleInput));

// 843 is too low

/**
 * @param {String} puzzleInput
 * @return {Number}
 */
function main(puzzleInput) {
    const initialArrangement = puzzleInput
        .split("\n")
        .map((str) => Number(str));

    let arrangement = [...initialArrangement];

    initialArrangement.forEach((item) => {
        const index = arrangement.indexOf(item);
        const movement = item;

        // remove the item being moved
        const oldItem = arrangement.splice(index, 1)[0];

        // add it to the place we are interested in
        let newIndex = index + movement;
        while (newIndex <= 0) {
            newIndex += arrangement.length;
        }

        while (newIndex > arrangement.length) {
            newIndex -= arrangement.length;
        }

        arrangement.splice(newIndex, 0, oldItem);
    });

    const zeroIndex = arrangement.indexOf(0);
    const a = arrangement[(zeroIndex + 1000) % arrangement.length];
    const b = arrangement[(zeroIndex + 2000) % arrangement.length];
    const c = arrangement[(zeroIndex + 3000) % arrangement.length];

    return a + b + c;
}
