
export function greedy(grid, startNode, endNode) {
    const visitedNodesInOrder = [];

    for (let row of grid) {
        for (let node of row) {
            node.distance = Infinity;
        }
    }

    startNode.distance = heuristic(startNode, endNode);

    let queue = [];
    queue.push(startNode);

    while (queue.length > 0) {
        let currentNode = getNodeWithShortestDistance(queue);
        removeNodeFromArray(queue, currentNode);
        currentNode.isVisited = true;
        visitedNodesInOrder.push(currentNode);

        if (currentNode.row === endNode.row && currentNode.col === endNode.col) {
            return visitedNodesInOrder;
        }

        let neighbors = getWalkableNeighbors(grid, currentNode);

        for (let neighbor of neighbors) {
            if (neighbor.isVisited)
                continue;
            neighbor.distance = heuristic(neighbor, endNode);
            neighbor.parent = currentNode;
            queue.push(neighbor);
        }

    }

    return visitedNodesInOrder;
}

function getNodeWithShortestDistance(queue) {
    let lowestScoreNode;

    for (let node of queue) {
        if (!lowestScoreNode || node.distance < lowestScoreNode.distance) {
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