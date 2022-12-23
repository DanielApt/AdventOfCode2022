const fs = require('fs');

const sampleInput = fs.readFileSync('./sample-input.txt', 'utf8');
const puzzleInput = fs.readFileSync('./input.txt', 'utf8');

const {splitLinesToNumbers} = require('../util');

console.log(main(sampleInput));
console.log(main(puzzleInput));

/**
 * @param {String} puzzleInput
 * @return {Number} calories of largest amount
 */
function main(puzzleInput) {
    // split it into items
    const items = splitLinesToNumbers(puzzleInput);

    const carriedCaloriesList = [];

    let currentElf = 0;
    for (let i = 0; i < items.length; i++) {
        if (items[i] === 0) {
            carriedCaloriesList.push(currentElf);
            currentElf = 0;
            continue;
        }

        currentElf += items[i];
    }

    carriedCaloriesList.sort((a, b) => b - a);

    return carriedCaloriesList[0] + carriedCaloriesList[1] + carriedCaloriesList[2];
}