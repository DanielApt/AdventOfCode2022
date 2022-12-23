const fs = require('fs');

const sampleInput = fs.readFileSync('./sample-input.txt', 'utf8');
const puzzleInput = fs.readFileSync('./input.txt', 'utf8');

const CHOICE_POINTS = {
    A: 1,
    B: 2,
    C: 3,
    X: 1,
    Y: 2,
    Z: 3
}

const OUTCOMES = {
    A: {
        X: 3,
        Y: 6,
        Z: 0
    },
    B: {
        X: 0,
        Y: 3,
        Z: 6
    },
    C: {
        X: 6,
        Y: 0,
        Z: 3
    }
}

console.log(main(sampleInput));
console.log(main(puzzleInput));

/**
 * @param {String} puzzleInput
 * @return {Number} total score
 */
function main(puzzleInput) {
    const games = puzzleInput.split('\n').filter(str => str !== '').map(str => [str.charAt(0), str.charAt(2)]);
    let score = 0;

    games.forEach(game => {
        const [opponentMove, yourMove] = game;

        console.log(`Adding ${CHOICE_POINTS[yourMove]} for choice`)
        score += CHOICE_POINTS[yourMove];

        console.log(`Adding ${OUTCOMES[opponentMove][yourMove]} for game`)
        score += OUTCOMES[opponentMove][yourMove];
    });

    return score;
}