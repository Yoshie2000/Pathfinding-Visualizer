
export function astar(grid, startNode, endNode) {
    const visitedNodesInOrder = [];

    startNode.g = 0;
    startNode.h = heuristic(startNode, endNode);
    startNode.f = startNode.g + startNode.h;
    startNode.isVisited = true;

    let currentNode = startNode;
    let openList = [], closedList = [];

    closedList.push(currentNode);
    visitedNodesInOrder.push(currentNode);

    let firstNeighbors = getWalkableNeighbors(grid, currentNode);
    for (let neighbor of firstNeighbors) {
        neighbor.g = currentNode.g + 1;
        neighbor.h = heuristic(neighbor, endNode);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.parent = currentNode;
        neighbor.isVisited = true;
        openList.push(neighbor);
        visitedNodesInOrder.push(neighbor);
    }

    while (openList.length > 0) {
        currentNode = getNodeWithLowestScore(openList);
        removeNodeFromArray(openList, currentNode);
        closedList.push(currentNode);

        currentNode.isVisited = true;
        visitedNodesInOrder.push(currentNode);

        if (currentNode.col === endNode.col && currentNode.row === endNode.row)
            break;

        let neighbors = getWalkableNeighbors(grid, currentNode);
        for (let neighbor of neighbors) {
            if (closedList.includes(neighbor))
                continue;

            neighbor.isVisited = true;
            visitedNodesInOrder.push(neighbor);

            if (!openList.includes(neighbor)) {
                neighbor.g = currentNode.g + 1;
                neighbor.h = heuristic(neighbor, endNode);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.parent = currentNode;
                openList.push(neighbor);
            } else {
                const newF = currentNode.g + 1 + heuristic(neighbor, endNode);
                if (newF < neighbor.f) {
                    neighbor.g = currentNode.g + 1;
                    neighbor.h = heuristic(neighbor, endNode);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.parent = currentNode;
                }
            }
        }
    }
    return visitedNodesInOrder;
}

function getNodeWithLowestScore(openList) {
    let lowestScoreNode;

    for (let node of openList) {
        if (!lowestScoreNode || node.f < lowestScoreNode.f) {
            lowestScoreNode = node;
        }
    }
    return lowestScoreNode;
}

function getWalkableNeighbors(grid, node) {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isWall);
}

function heuristic(node, endNode) {
    return Math.sqrt(
        (node.row - endNode.row) * (node.row - endNode.row) +
        (node.col - endNode.col) * (node.col - endNode.col)
    );
}

function removeNodeFromArray(array, node) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === node) {
            array.splice(i, 1);
            break;
        }
    }
}