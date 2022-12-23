const fs = require("fs");

const sampleInput = fs.readFileSync("./sample-input.txt", "utf8");
const puzzleInput = fs.readFileSync("./input.txt", "utf8");

console.log(main(`1,1,1\n2,1,1`)); // note, it doesn't work with this
console.log(main(sampleInput));
console.log(main(puzzleInput));

/**
 * @param {String} puzzleInput
 * @return {Number}
 */
function main(puzzleInput) {
    const cubes = puzzleInput
        .split("\n")
        .map((s) => s.split(",").map((s) => Number(s)))
        .map(([x, y, z]) => ({ x, y, z }));

    const coordinates = [];

    const xMin = Math.min(...cubes.map((c) => c.x));
    const xMax = Math.max(...cubes.map((c) => c.x));
    const yMin = Math.min(...cubes.map((c) => c.y));
    const yMax = Math.max(...cubes.map((c) => c.y));
    const zMin = Math.min(...cubes.map((c) => c.z));
    const zMax = Math.max(...cubes.map((c) => c.z));

    for (let x = xMin - 1; x <= xMax + 1; x++) {
        for (let y = yMin - 1; y <= yMax + 1; y++) {
            for (let z = zMin - 1; z <= zMax + 1; z++) {
                const value = cubes.find(
                    (c) => c.x === x && c.y === y && c.z === z
                )
                    ? "lava"
                    : "water";

                coordinates.push({ x, y, z, value });
            }
        }
    }

    let nodes = [
        coordinates.find(
            (point) => point.x === xMin && point.y === yMin && point.z === zMin
        ),
    ];

    const visited = [];

    let totalSurface = 0;

    while (nodes.length) {
        const node = nodes.pop();
        visited.push(node);

        const neighbours = coordinates.filter(
            (cube) => getDistance(cube, node) === 1
        );

        const lava = neighbours.filter((cube) => cube.value === "lava");

        totalSurface += lava.length;

        const waterNeighbours = neighbours
            .filter((cube) => cube.value === "water")
            .filter((cube) => !visited.includes(cube));

        nodes = [...new Set([...nodes, ...waterNeighbours])];
    }

    return totalSurface;

    function getDistance(c1, c2) {
        return Math.sqrt(
            Math.pow(Math.abs(c1.x - c2.x), 2) +
                Math.pow(Math.abs(c1.y - c2.y), 2) +
                Math.pow(Math.abs(c1.z - c2.z), 2)
        );
    }
}
