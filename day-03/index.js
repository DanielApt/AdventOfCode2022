const fs = require("fs");

const sampleInput = fs.readFileSync("./sample-input.txt", "utf8");
const puzzleInput = fs.readFileSync("./input.txt", "utf8");

const CHARCODES = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: 5,
    f: 6,
    g: 7,
    h: 8,
    i: 9,
    j: 10,
    k: 11,
    l: 12,
    m: 13,
    n: 14,
    o: 15,
    p: 16,
    q: 17,
    r: 18,
    s: 19,
    t: 20,
    u: 21,
    v: 22,
    w: 23,
    x: 24,
    y: 25,
    z: 26,
};

console.log(main(sampleInput));
console.log(main(puzzleInput));

/**
 * @param {String} puzzleInput
 * @return {Number} total priority
 */
function main(puzzleInput) {
    const rucksacks = puzzleInput.split("\n");
    const commonItems = rucksacks.map((rucksack) => {
        const index = rucksack.length / 2;
        const left = rucksack.slice(0, index);
        const right = rucksack.slice(index, rucksack.length);

        for (let i = 0; i < left.length; i++) {
            if (right.indexOf(left[i]) !== -1) {
                return left[i];
            }
        }
    });

    const itemPriorities = commonItems.map((item) => {
        if (CHARCODES[item]) {
            return CHARCODES[item];
        }

        // is uppercase
        return CHARCODES[item.toLowerCase()] + 26;
    });

    return itemPriorities.reduce((a, b) => a + b);
}
