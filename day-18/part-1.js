const fs = require("fs");

const sampleInput = fs.readFileSync("./sample-input.txt", "utf8");
const puzzleInput = fs.readFileSync("./input.txt", "utf8");

const CUBE_SURFACE = 6;

console.log(main(`1,1,1\n2,1,1`));
console.log(main(sampleInput));
console.log(main(puzzleInput));

/**
 * @param {String} puzzleInput
 * @return {Number}
 */
function main(puzzleInput) {
    let totalSurface = 0;

    const cubes = puzzleInput
        .split("\n")
        .map((s) => s.split(",").map((s) => Number(s)))
        .map(([x, y, z]) => ({ x, y, z }));

    totalSurface += CUBE_SURFACE * cubes.length;

    cubes.forEach((c1) => {
        cubes
            .filter((c2) => getDistance(c1, c2) === 1)
            .forEach(() => {
                totalSurface -= 1;
            });
    });

    return totalSurface;

    function getDistance(c1, c2) {
        return Math.sqrt(
            Math.pow(Math.abs(c1.x - c2.x), 2) +
                Math.pow(Math.abs(c1.y - c2.y), 2) +
                Math.pow(Math.abs(c1.z - c2.z), 2)
        );
    }
}
