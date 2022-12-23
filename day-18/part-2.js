const fs = require("fs");

const sampleInput = fs.readFileSync("./sample-input.txt", "utf8");
const puzzleInput = fs.readFileSync("./input.txt", "utf8");

const CUBE_SURFACE = 6;

// 2474 is too low

// console.log(main(`1,1,1\n2,1,1`));
console.log(main(sampleInput));
console.log(main(puzzleInput));

/**
 * @param {String} puzzleInput
 * @return {Number}
 */
function main(puzzleInput) {
    // create 3d space to add cubes to
    const space = new Array();

    const cubes = puzzleInput
        .split("\n")
        .map((s) => s.split(",").map((s) => Number(s)))
        .map(([x, y, z]) => ({ x, y, z }));

    const xMin = Math.min(...cubes.map((c) => c.x));
    const xMax = Math.max(...cubes.map((c) => c.x));
    const yMin = Math.min(...cubes.map((c) => c.y));
    const yMax = Math.max(...cubes.map((c) => c.y));
    const zMin = Math.min(...cubes.map((c) => c.z));
    const zMax = Math.max(...cubes.map((c) => c.z));

    const toIgnoreSpace = [];

    for (let x = xMin; x <= xMax; x++) {
        for (let y = yMin; y <= yMax; y++) {
            for (let z = zMin; z <= zMax; z++) {
                const xBefore = cubes.filter(
                    (c) => c.x < x && c.y === y && c.z === z
                );

                const xAfter = cubes.filter(
                    (c) => c.x > x && c.y === y && c.z === z
                );

                const yBefore = cubes.filter(
                    (c) => c.x === x && c.y < y && c.z === z
                );

                const yAfter = cubes.filter(
                    (c) => c.x === x && c.y > y && c.z === z
                );

                const zBefore = cubes.filter(
                    (c) => c.x === x && c.y === y && c.z < z
                );

                const zAfter = cubes.filter(
                    (c) => c.x === x && c.y === y && c.z > z
                );

                // check if the space is surrounded
                if (
                    xBefore.length &&
                    xAfter.length &&
                    yBefore.length &&
                    yAfter.length &&
                    zBefore.length &&
                    zAfter.length
                ) {
                    if (
                        !cubes.find((c) => c.x === x && c.y === y && c.z === z)
                    ) {
                        toIgnoreSpace.push({ x, y, z });
                    }
                }

                // fill empty spaces with blank
                // addCube({ x, y, z }, "blank");
            }
        }
    }

    return calculateSurfaceArea(cubes) - calculateSurfaceArea(toIgnoreSpace);

    function calculateSurfaceArea(cubes) {
        let surfaceArea = 6 * cubes.length;

        cubes.forEach((c1) => {
            // add each cube to the 3d space
            addCube(c1);
            cubes
                .filter((c2) => getDistance(c1, c2) === 1)
                .forEach(() => {
                    surfaceArea -= 1;
                });
        });

        return surfaceArea;
    }

    function getDistance(c1, c2) {
        return Math.sqrt(
            Math.pow(Math.abs(c1.x - c2.x), 2) +
                Math.pow(Math.abs(c1.y - c2.y), 2) +
                Math.pow(Math.abs(c1.z - c2.z), 2)
        );
    }

    function addCube(cube, value = "cube") {
        const { x, y, z } = cube;

        if (!space[x]) {
            space[x] = [];
        }

        if (!space[x][y]) {
            space[x][y] = [];
        }

        if (!space[x][y][z]) {
            space[x][y][z] = value;
        }
    }
}
