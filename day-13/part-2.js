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
    const pairs = puzzleInput
        .split("\n\n")
        .map((str) => str.split("\n"))
        .map((pair) => ({
            left: eval(pair[0]),
            right: eval(pair[1]),
        }));

    const validPairIndices = [];

    for (let i = 0; i < pairs.length; i++) {}

    pairs.forEach((pair, index) => {
        const { left, right } = pair;

        if (compareIfListInRightOrder(left, right)) {
            validPairIndices.push(index + 1);
        }
    });

    return validPairIndices.reduce((a, b) => a + b);
}

function compareIfListInRightOrder(left, right) {
    // for integers
    if (typeof left === "number" && typeof right === "number") {
        if (left < right) {
            return true;
        } else if (left > right) {
            return false;
        } else {
            return undefined;
        }
        // one of the types is an object, make sure to wrap the right number
    } else if (left === undefined) {
        // left is shorter than right, which is good
        return true;
    } else if (right === undefined) {
        return false;
    } else if (typeof left === "number") {
        return compareIfListInRightOrder([left], right);
    } else if (typeof right === "number") {
        return compareIfListInRightOrder(left, [right]);
    } else {
        // both are arrays
        const longest = Math.max(left.length, right.length);

        for (let i = 0; i < longest; i++) {
            const isInRightOrder = compareIfListInRightOrder(left[i], right[i]);

            if (isInRightOrder !== undefined) {
                return isInRightOrder;
            }
        }
    }
}
