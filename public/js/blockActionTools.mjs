export const blockActionTools = {

    probability(n) {
        return Math.random() < n;
    },
    
    resolveMovement(intendedDirection, block, value) {
        let increment;
        let newPos = { x: block.x, y: block.y };
        if (value > 0) {
            increment = 1;
        } else {
            increment = -1;
        }
    
        if (intendedDirection === 'Forward') {
            if (block.direction === 'North') {
                newPos.y -= increment;
            } else if (block.direction === 'East') {
                newPos.x += increment;
            } else if (block.direction === 'South') {
                newPos.y += increment;
            } else if (block.direction === 'West') {
                newPos.x -= increment;
            }
        } else if (intendedDirection === 'Left-Right') {
            if (block.direction === 'North') {
                newPos.x -= increment;
            } else if (block.direction === 'East') {
                newPos.y += increment;
            } else if (block.direction === 'South') {
                newPos.x += increment;
            } else if (block.direction === 'West') {
                newPos.y -= increment;
            }
        } else if (intendedDirection === 'Reverse') {
            if (block.direction === 'North') {
                newPos.y += increment;
            } else if (block.direction === 'East') {
                newPos.x -= increment;
            } else if (block.direction === 'South') {
                newPos.y -= increment;
            } else if (block.direction === 'West') {
                newPos.x += increment;
            }
        } else if (intendedDirection === 'East-West') {
            newPos.x += increment;
        } else if (intendedDirection === 'North-South') {
            newPos.y += increment;
        }
    
        return newPos;
    },

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