const fs = require('fs');

const sampleInput = fs.readFileSync('./sample-input.txt', 'utf8');
const puzzleInput = fs.readFileSync('./input.txt', 'utf8');

const CHOICE_POINTS = {
    A: 1,
    B: 2,
    C: 3
}

const OUTCOME_SCORE = {
    X: 0,
    Y: 3,
    Z: 6
}

const YOUR_MOVE = {
    A: {
        X: 'C',
        Y: 'A',
        Z: 'B'
    },
    B: {
        X: 'A',
        Y: 'B',
        Z: 'C'
    },
    C: {
        X: 'B',
        Y: 'C',
        Z: 'A'
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
        const [opponentMove, outcome] = game;

        const yourMove = YOUR_MOVE[opponentMove][outcome];
        score += CHOICE_POINTS[yourMove];
        score += OUTCOME_SCORE[outcome];
    });

    return score;
}