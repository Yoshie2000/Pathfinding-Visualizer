
export function recursiveDivision(grid, totalWidth, totalHeight, startNode, endNode) {

    let wallsInOrder = [];

    // Draw border
    for (let x = 0; x < totalWidth; x++) {
        for (let y = 0; y < totalHeight; y++) {
            if ((x % 2 === 0 && y % 2 === 0) || (x === 0 || y === 0 || x === totalWidth - 1 || y === totalHeight - 1)) {
                wallsInOrder.push(grid[y][x]);
            }
        }
    }

    let width = totalWidth / 2 - 1;
    let height = totalHeight / 2 - 1;

    divide(grid, 0, 0, width, height, chooseOrientation(width, height), width, height, startNode, endNode, wallsInOrder);

    return {
        wallsInOrder: wallsInOrder,
        wallsToRemove: null
    };
}

function divide(grid, x, y, width, height, orientation, totalWidth, totalHeight, startNode, endNode, wallsInOrder) {
    if (width < 2 || height < 2 || x < 0 || x >= totalWidth || y < 0 || y >= totalHeight)
        return;

    const horizontal = orientation === "HORIZONTAL";

    // Determine the start coordinates of the wall
    let wallX = x + (horizontal ? 0 : Math.floor(Math.random() * (width - 1)));
    let wallY = y + (horizontal ? Math.floor(Math.random() * (height - 1)) : 0);

    // Determine the coordinates of the passage
    const passageX = wallX + (horizontal ? Math.floor(Math.random() * width) : 0);
    const passageY = wallY + (horizontal ? 0 : Math.floor(Math.random() * height));

    // Determine the delta coordinates
    const deltaX = horizontal ? 1 : 0;
    const deltaY = horizontal ? 0 : 1;

    const length = horizontal ? width : height;

    const dir = horizontal ? "SOUTH" : "EAST";

    for (let i = 0; i < length; i++) {
        let currentX = wallX + (deltaX * i);
        let currentY = wallY + (deltaY * i);

        makeWall(grid, currentX, currentY, passageX, passageY, dir, wallsInOrder);
    }

    let nextX1 = x;
    let nextY1 = y;
    let nextWidth1 = horizontal ? width : wallX - x + 1;
    let nextHeight1 = horizontal ? wallY - y + 1 : height;
    divide(grid, nextX1, nextY1, nextWidth1, nextHeight1, chooseOrientation(nextWidth1, nextHeight1), totalWidth, totalHeight, startNode, endNode, wallsInOrder);

    let nextX2 = horizontal ? x : wallX + 1;
    let nextY2 = horizontal ? wallY + 1 : y;
    let nextWidth2 = horizontal ? width : x + width - wallX - 1;
    let nextHeight2 = horizontal ? y + height - wallY - 1 : height;
    divide(grid, nextX2, nextY2, nextWidth2, nextHeight2, chooseOrientation(nextWidth2, nextHeight2), totalWidth, totalHeight, startNode, endNode, wallsInOrder);
}

function chooseOrientation(width, height) {
    if (width < height)
        return "HORIZONTAL";
    else if (height < width)
        return "VERTICAL";
    else
        return Math.random() >= 0.5 ? "HORIZONTAL" : "VERTICAL";
}

function makeWall(grid, x, y, pX, pY, dir, wallsInOrder) {
    let wallNode;
    if (dir === "SOUTH") {
        wallNode = grid[2 * (y + 1)][2 * x + 1];
    } else if (dir === "EAST") {
        wallNode = grid[2 * y + 1][2 * (x + 1)];
    }

    if (wallNode) {
        if (x !== pX || y !== pY)
            wallsInOrder.push(wallNode);
    }
}