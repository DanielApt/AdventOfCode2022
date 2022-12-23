const fs = require("fs");

const DECRYPTION_KEY = 811589153;

const sampleInput = fs.readFileSync("./sample-input.txt", "utf8");
const puzzleInput = fs.readFileSync("./input.txt", "utf8");

console.log(main(sampleInput));
console.log(main(puzzleInput));

/**
 * @param {String} puzzleInput
 * @return {Number}
 */
function main(puzzleInput) {
    const start = process.hrtime();

    const initialArrangement = puzzleInput.split("\n").map((str, index) => ({
        id: index,
        value: Number(str) * DECRYPTION_KEY,
    }));

    let arrangement = [...initialArrangement];

    let count = 0;

    while (count < 10) {
        mix();
        count++;
    }

    function mix() {
        initialArrangement.forEach((item) => {
            const index = arrangement.findIndex((n) => n.id === item.id);
            const movement = item.value;

            // remove the item being moved
            const oldItem = arrangement.splice(index, 1)[0];

            // add it to the place we are interested in
            let newIndex = index + movement;

            if (newIndex <= 0) {
                newIndex +=
                    Math.ceil(-newIndex / arrangement.length) *
                    arrangement.length;
                newIndex += arrangement.length;
            }

            if (newIndex > arrangement.length) {
                newIndex = newIndex % arrangement.length;
            }

            arrangement.splice(newIndex, 0, oldItem);
        });
    }

    const zeroIndex = arrangement.findIndex((n) => n.value === 0);
    const a = arrangement[(zeroIndex + 1000) % arrangement.length].value;
    const b = arrangement[(zeroIndex + 2000) % arrangement.length].value;
    const c = arrangement[(zeroIndex + 3000) % arrangement.length].value;

    console.log(`${process.hrtime(start)[0]} seconds`);
    return a + b + c;
}
