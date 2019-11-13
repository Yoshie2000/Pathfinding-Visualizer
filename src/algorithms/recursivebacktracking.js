
export function recursiveBacktracking(grid, totalWidth, totalHeight) {

    let wallsInOrder = [];
    let wallsToRemove = [];

    // Draw border
    for (let x = 0; x < totalWidth; x++) {
        for (let y = 0; y < totalHeight; y++) {
            if (x % 2 === 0 || y % 2 === 0) {
                wallsInOrder.push(grid[y][x]);
            }
        }
    }

    let stack = [];
    let node = grid[0][0];

    node.isMazeVisited = true;

    while (hasUnvisitedCells(grid)) {
        let neighbours = getUnvisitedNeighbours(grid, node);

        if (neighbours.length > 0) {

            if (neighbours.length > 1) {
                stack.push(node);
            }

            let randomIndex = Math.floor(Math.random() * neighbours.length);
            let neighbour = neighbours[randomIndex];

            wallsToRemove = removeWall(grid, node, neighbour, wallsToRemove);

            neighbour.isMazeVisited = true;
            node = neighbour;
        } else if (stack.length > 0) {
            let newNode;
            while (stack.length > 0) {
                newNode = stack.pop();
                if (getUnvisitedNeighbours(grid, newNode).length !== 0)
                    break;
            }
            node = newNode;
        } else {
            break;
        }
    }

    return {
        wallsInOrder: wallsInOrder,
        wallsToRemove: wallsToRemove
    };
}

function removeWall(grid, node, neighbour, wallsToRemove) {
    const dir = getNeighbourDirection(node, neighbour);

    const x = node.col, y = node.row;
    let wallNode;

    //let walls = [];

    if (dir.x > 0) {
        // EAST
        wallNode = grid[2 * y + 1][2 * (x + 1)];

        /*walls.push(grid[2 * y + 1][2 * x]);
        walls.push(grid[2 * (y + 1)][2 * x + 1]);
        walls.push(grid[2 * y][2 * x + 1]);*/
    } else if (dir.x < 0) {
        // WEST
        wallNode = grid[2 * y + 1][2 * x];

        /*walls.push(grid[2 * y + 1][2 * (x + 1)]);
        walls.push(grid[2 * (y + 1)][2 * x + 1]);
        walls.push(grid[2 * y][2 * x + 1]);*/
    } else if (dir.y > 0) {
        // SOUTH
        wallNode = grid[2 * (y + 1)][2 * x + 1];

        /*walls.push(grid[2 * y + 1][2 * (x + 1)]);
        walls.push(grid[2 * y + 1][2 * x]);
        walls.push(grid[2 * y][2 * x + 1]);*/
    } else if (dir.y < 0) {
        // NORTH
        wallNode = grid[2 * y][2 * x + 1];

        /*walls.push(grid[2 * y + 1][2 * (x + 1)]);
        walls.push(grid[2 * y + 1][2 * x]);
        walls.push(grid[2 * (y + 1)][2 * x + 1]);*/
    }

    if (wallNode) {
        wallsToRemove.push(wallNode);
    }

    /*for (let wall of walls) {
        wallsInOrder.push(wall);
    }*/

    return wallsToRemove;
}

function getNeighbourDirection(n1, n2) {
    let dirX = n2.col - n1.col;
    let dirY = n2.row - n1.row;
    return { x: dirX, y: dirY };
}

function getNeighbours(grid, node) {
    let { col, row } = node;

    let neighbours = [];
    if (row > 0) {
        neighbours.push(grid[row - 1][col]);
    }
    if (row < grid.length / 2 - 2) {
        neighbours.push(grid[row + 1][col]);
    }
    if (col > 0) {
        neighbours.push(grid[row][col - 1]);
    }
    if (col < grid[row].length / 2 - 2) {
        neighbours.push(grid[row][col + 1]);
    }
    return neighbours;
}

function getUnvisitedNeighbours(grid, node) {
    let result = [];
    for (let neighbour of getNeighbours(grid, node)) {
        if (neighbour && !neighbour.isMazeVisited) {
            result.push(neighbour);
        }
    }
    return result;
}

function hasUnvisitedCells(grid) {
    for (let row of grid) {
        for (let node of row) {
            if (!node.isMazeVisited)
                return true;
        }
    }
    return false;
}