/**
 * @param {String} input
 * @return {Array<Number>}
 */

function splitLinesToNumbers (input) {
    return input.split('\n').map(str => Number(str));
}

module.exports = {splitLinesToNumbers}