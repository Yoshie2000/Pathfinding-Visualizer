
export function simpleWall(grid, totalWidth, totalHeight) {

    let wallsInOrder = [];

    let deltaX = 1, deltaY = -1;
    let currentX = 0, currentY = Math.floor(totalHeight / 2);

    while (currentX < totalWidth - 1) {
        if (!grid[currentY][currentX].isStart && !grid[currentY][currentX].isFinish)
            wallsInOrder.push(grid[currentY][currentX]);
        
        currentX += deltaX;
        currentY += deltaY;

        if (currentY <= 1) {
            deltaY = 1;
        }

        if (currentY >= totalHeight - 2) {
            deltaY = -1;
        } 
    }

    return {
        wallsInOrder: wallsInOrder,
        wallsToRemove: []
    };
}