export const blockActionTools = {
    probability(n) {
        return Math.random() < n;
    },

    resolveMovement(intendedDirection, block, value, increment = 1) {
        let newPos = { x: block.x, y: block.y };
        if (value < 0) {
            increment *= -1;
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
        if (
            newPos.x >= 0 &&
            newPos.x < grid.length &&
            newPos.y >= 0 &&
            newPos.y < grid[0].length
        ) {
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
    },

    getGradient(values) {
        let firstSide = 0;
        for (let index = 0; index < values.length / 2; index++) {
            firstSide += values[index];
        }
        let secondSide = 0;
        for (let index = values.length / 2; index < values.length; index++) {
            secondSide += values[index];
        }
        const rise = secondSide - firstSide;
        const run = values.length;
        const gradient = rise / run;
        return gradient;
    },
    saveLastMovement(block, newPos) {
        if (block.x !== newPos.x) {
            block.LMx = newPos.x - block.x;
        } else if (block.y !== newPos.y) {
            block.LMy = newPos.y - block.y;
        }
    },
    // returns the value between two numbers at a specified decimal midpoint
    lerp(x, y, a) {
        return (x * (1 - a) + y * a);
    },
    // give it a number and then a minimum & maximum. If your number falls within the bounds of the min & max, it’ll return it. 
    // If not, it’ll return either the minimum if it’s smaller, or the maximum if it’s bigger
    clamp(a, min = 0, max = 1) {
        return Math.min(max, Math.max(min, a));
    },
    // Inverted LERP: you pass any value, and it’ll return that decimal, wherever it falls on that spectrum
    invlerp(x, y, a) {
        return blockActionTools.clamp((a - x) / (y - x));
    },
    // converts a value from one data range to another
    range(x1, y1, x2, y2, a) {
        return blockActionTools.lerp(x2, y2, blockActionTools.invlerp(x1, y1, a));
    },
};
