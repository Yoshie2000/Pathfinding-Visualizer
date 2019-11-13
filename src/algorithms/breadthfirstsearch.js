
export function breadthfirstsearch(grid, startNode, endNode) {

    let visitedNodesInOrder = [];
    let queue = [];

    queue.push(startNode);
    visitedNodesInOrder.push(startNode);
    startNode.isVisited = true;

    while (queue.length > 0) {
        
        let node = queue.pop();

        for (let neighbourNode of getUnvisitedNeighbours(grid, node)) {
            if (!visitedNodesInOrder.includes(neighbourNode))
                visitedNodesInOrder.push(neighbourNode);
            neighbourNode.isVisited = true;
            neighbourNode.parent = node;

            if (neighbourNode === endNode)
                return visitedNodesInOrder;
            else
                queue.push(neighbourNode);

        }

    }

    return visitedNodesInOrder;
}

function getUnvisitedNeighbours(grid, node) {
    const neighbors = [];
    const { col, row } = node;
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    if (row > 0) neighbors.push(grid[row - 1][col]);
    return neighbors.filter(neighbor => !neighbor.isVisited && !neighbor.isWall);
}