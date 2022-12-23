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
    const packets = puzzleInput
        .replace(/\n\n/g, "\n")
        .split("\n")
        .map((p) => eval(p));

    packets.push([[2]]);
    packets.push([[6]]);

    const sorted = packets
        .sort((b, a) => compareIfListInRightOrder(a, b))
        .reverse();

    const dividerIndexes = [];

    sorted.forEach((packet, index) => {
        const packetString = JSON.stringify(packet);
        if (packetString === "[[2]]" || packetString === "[[6]]") {
            dividerIndexes.push(index + 1);
        }
    });

    return dividerIndexes.reduce((a, b) => a * b);
}

function compareIfListInRightOrder(left, right) {
    // for integers
    if (typeof left === "number" && typeof right === "number") {
        if (left < right) {
            return -1;
        } else if (left > right) {
            return 1;
        } else {
            return undefined;
        }
        // one of the types is an object, make sure to wrap the right number
    } else if (left === undefined) {
        // left is shorter than right, which is good
        return -1;
    } else if (right === undefined) {
        return 1;
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
