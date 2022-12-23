const fs = require('fs');

const sampleInput = fs.readFileSync('./sample-input.txt', 'utf8');
const puzzleInput = fs.readFileSync('./input.txt', 'utf8');

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
    z: 26
};

console.log(main(sampleInput));
console.log(main(puzzleInput));

/**
 * @param {String} puzzleInput
 * @return {Number} total priority
 */
function main(puzzleInput) {
    const groups = splitIntoGroups(puzzleInput);
    const badges = groups.map(findBadge);
    const priorities = badges.map(getItemPriority)

    return priorities.reduce((a, b) => a + b);
}

/**
 * Splits file into groups of 3
 * @param {String} puzzleInput
 * @param {Number} size (default: 3)
 * @return {Array<Array<String>>} Groups of three
 */
function splitIntoGroups(puzzleInput, size = 3) {
    let currentGroup = [];
    const groups = [];

    const lines = puzzleInput.split('\n');

    for (let i = 0; i < lines.length; i++) {
        currentGroup.push(lines[i]);

        if (currentGroup.length % size === 0) {
            groups.push(currentGroup);
            currentGroup = [];
        }
    }

    return groups;
}

/**
 * Find the common item (a character, representing a badge) in an array of strings
 * @param {Array<String>} group
 * @return {String} character (badge) showing matching item
 */

function findBadge(group) {
    const allItems = group
        .map(rucksack => [...new Set([...rucksack])]
        .join(''))
        .reduce((a, b) => `${a}${b}`);

    for (let i = 0; i < allItems.length; i++) {
        const regex = new RegExp(allItems[i], 'g');
        const match = allItems.match(regex);
        if (match && match.length >= 3) {
            return allItems[i];
        }
    }
}

/**
 * For a given item (character) return its priority
 * @param {String} item
 * @return {Number} item priority
 */
function getItemPriority(item) {
    if (CHARCODES[item]) {
        return CHARCODES[item]
    }

    // is uppercase
    return CHARCODES[item.toLowerCase()] + 26;
}