export const blockActionTools = {
    isValidPosition(newPos, grid) {
        if (blockActionTools.isInsideGrid(newPos, grid)) {
            if (blockActionTools.isPositionOccupied(newPos, grid)) {
                // Someone is there already
                return false;
            } else {
                // Position is valid
                return true;
            }
        } else {
            // Position is outside the grid
            return false;
        }
    },
    
    isInsideGrid(newPos, grid) {
        if (newPos.x >= 0 && newPos.x < grid.length && newPos.y >= 0 && newPos.y < grid[0].length) {
            return true;
        } else {
            return false;
        }
    },
    
    isPositionOccupied(newPos, grid) {
        if (grid[newPos.x][newPos.y].occupant !== null) {
            return true;
        } else {
            return false;
        }
    }
}