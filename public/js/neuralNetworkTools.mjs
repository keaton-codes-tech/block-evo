'use strict';

export const neuralNetworkTools = {
    // All input values are between 0 and 1
    possibleInputs: [
        {
            name: 'Slr',
            action: (target, value) => {
                // Depends on this blocks grid position and the two blocks left and right of it

                // Look at blocks left and right to detect if there is a pheromone gradient between 0 and 1
                // If there is a gradient, multiply the gradient value by the weight and send it to the target neuron

                console.log('Slr');
            },
        }, // Pheromone gradient left-right
        {
            name: 'Sfd',
            action: () => {
                // Depends on this blocks grid position and the three blocks in front of it
                console.log('Sfd');
            },
        }, // Pheromone gradient forward
        {
            name: 'Sg',
            action: () => {
                // Depends on this blocks grid position
                console.log('Sg');
            },
        }, // Pheromone density
        {
            name: 'Age',
            action: () => {
                // Output starts at 0 and ends at 1 when the lifetime (total number of steps) is up
                // Depends on number of steps (which need to be kept track of and have a finite amount of them to begin with)
                console.log('Age');
            },
        }, // Age
        {
            // Not dependant on anything, just sends a random value between 0 and 1
            name: 'Rnd',
            action: () => {
                console.log('Rnd');
            },
        }, // Random input
        {
            name: 'Blr',
            action: () => {
                // Depends on this blocks grid position and the two blocks left and right of it
                // Needs to know if that space exists or not (barrier) or if that space is empty or not (occupied already)
                console.log('Blr');
            },
        }, // Blockage left-right
        {
            // Frequency of full oscillation wave is default to 25 steps
            name: 'Osc',
            action: () => {
                console.log('Osc');
            },
        }, // Oscillator
        {
            name: 'Bfd',
            action: () => {
                // Depends on this blocks grid position and the one block in front of it
                // Needs to know if that space exists or not (barrier) or if that space is empty or not (occupied already)
                console.log('Bfd');
            },
        }, // Blockage forward
        {
            name: 'Plr',
            action: () => {
                console.log('Plr');
            },
        }, // Population gradient left-right
        {
            name: 'Pfd',
            action: () => {
                // Depends on the grid position of the block and the three blocks in front of it
                // Output depends on the gradient of population density from its position through the three blocks in front of it
                console.log('Pfd');
            },
        }, // Population gradient forward
        {
            name: 'Pop',
            action: () => {
                // Depends on the grid position of the block and its immediate neighbours
                // The higher the population density, the higher the output
                console.log('Pop');
            },
        }, // Population density
        {
            name: 'LPf',
            action: () => {
                console.log('LPf');
            },
        }, // Population long-range forward
        {
            name: 'LMy',
            action: () => {
                console.log('LMy');
            },
        }, // Last movement y
        {
            name: 'LMx',
            action: () => {
                console.log('LMx');
            },
        }, // Last movement x
        {
            name: 'LBf',
            action: () => {
                console.log('LBf');
            },
        }, // Blockage long-range forward
        {
            name: 'BDy',
            action: () => {
                // Depends on this blocks grid position
                console.log('DBy');
            },
        }, // North-South border distance
        {
            name: 'BDx',
            action: () => {
                // Depends on this blocks grid position
                console.log('BDx');
            },
        }, // East-West border distance
        {
            name: 'Gen',
            action: () => {
                // Depends on knowledge of the grid space one block in the forward direction
                // and knowlegde of the blocks brain if there is one present in that position
                console.log('Gen');
            },
        }, // Genetic similarity of forward neighbour
        {
            name: 'Lx',
            action: () => {
                // Depends on blocks grid coords
                console.log('Lx');
            },
        }, // East-West world location, value is position in world on x axis represented by float between 0 and 1
        {
            name: 'Ly',
            action: () => {
                // Depends on blocks grid coords
                console.log('Ly');
            },
        }, // North-South world location, value is position in world on y axis represented by float between 0 and 1
        {
            name: 'BD',
            action: () => {
                console.log('BD');
            },
        }, // Nearest border distance
    ],
    possibleOutputs: [
        // all output values are between -1 and 1
        { name: 'LPD', action: () => {} }, // Set long-probe distance, changes the default distance that gradient inputs use to calc their gradient, increase or decrease by 1 block
        { name: 'Kill', action: () => {} }, // Kill forward neighbour
        { name: 'OSC', action: () => {} }, // Set oscillator period - increase or decrease the default period
        { name: 'SG', action: () => {} }, // Emit pheromone, increase pheromone density by 0.5 on current grid position
        { name: 'Res', action: () => {} }, // Set responsiveness, increase or decrease the default responsiveness, lowers or raises the threshold probability of all input and output neurons firing
        { name: 'Mfd', action: () => {} }, // Move forward (last direction of movement = forward)
        { name: 'Mrn', action: () => {} }, // Move random
        { name: 'Mrv', action: () => {} }, // Move reverse
        { name: 'MRL', action: () => {} }, // Move left-right (+/-)
        { name: 'MX', action: () => {} }, // Move east-west (+/-)
        { name: 'MY', action: () => {} }, // Move north-south (+/-)
    ],
    getRandomInputs(numInputs) {
        let possibleValues = this.possibleInputs.slice();
        let inputs = [];
        for (let i = 0; i < numInputs; i++) {
            let index = Math.floor(Math.random() * possibleValues.length);
            inputs.push(possibleValues[index]);
            possibleValues.splice(index, 1);
        }
        return inputs;
    },
    getHiddens(numHiddens) {
        // all hidden values are between -1 and 1
        let hiddens = [];
        for (let i = 0; i < numHiddens; i++) {
            hiddens.push({ name: `H${i}` });
        }
        return hiddens;
    },
    getRandomOutputs(numOutputs) {
        let possibleValues = this.possibleOutputs.slice();
        let outputs = [];
        for (let i = 0; i < numOutputs; i++) {
            let index = Math.floor(Math.random() * possibleValues.length);
            outputs.push(possibleValues[index]);
            possibleValues.splice(index, 1);
        }
        return outputs;
    },
    getRandomWeights(firstLayer, secondLayer) {
        let weights = {};
        for (let i = 0; i < firstLayer.length; i++) {
            weights[firstLayer[i].name] = {};
            for (let j = 0; j < secondLayer.length; j++) {
                weights[firstLayer[i].name][secondLayer[j].name] =
                    this.getRandomNumberBetweenRange(-1, 1);
            }
        }
        return weights;
    },
    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    },
    sigmoidDerivative(x) {
        return x * (1 - x);
    },
    getRandomNumberBetweenRange(min, max) {
        return Math.random() * (max - min) + min;
    },
    mutateWeights(weights, mutationRate) {
        for (let first in weights) {
            for (let second in weights[first]) {
                if (Math.random() < mutationRate) {
                    weights[first][second] = this.getRandomNumberBetweenRange(
                        -1,
                        1
                    );
                }
            }
        }
        return weights;
    },
};
