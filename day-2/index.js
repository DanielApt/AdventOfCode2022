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
    return 0;
}