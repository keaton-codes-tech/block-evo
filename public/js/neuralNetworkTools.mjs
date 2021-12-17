'use strict';

import { possibleInputs } from "./possibleInputs.mjs"; 
import { possibleOutputs } from "./possibleOutputs.mjs"; 

export const neuralNetworkTools = {
    getRandomInputs(numInputs) {
        let possibleValues = possibleInputs.slice();
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
            hiddens.push({
                name: `H${i}`,
                type: 'Hidden',
                layer: 'Hidden',
                typeID: i,
                receivedValues: [],
                value: 0,
            });
        }
        return hiddens;
    },
    getRandomOutputs(numOutputs) {
        let possibleValues = possibleOutputs.slice();
        let outputs = [];
        for (let i = 0; i < numOutputs; i++) {
            let index = Math.floor(Math.random() * possibleValues.length);
            outputs.push(possibleValues[index]);
            possibleValues.splice(index, 1);
        }
        return outputs;
    },
    getRandomConnections(inputs, hiddens, outputs) {
        const connections = [];
        // iterate inputs and make one connection to either a hidden or output neuron
        for (let i = 0; i < inputs.length; i++) {
            let index = Math.floor(
                Math.random() * (hiddens.length + outputs.length)
            );
            if (index < hiddens.length) {
                connections.push({
                    source: inputs[i],
                    sink: hiddens[index],
                    weight: neuralNetworkTools.getRandomNumberBetweenRange(
                        0,
                        1
                    ),
                });
            } else {
                connections.push({
                    source: inputs[i],
                    sink: outputs[index - hiddens.length],
                    weight: neuralNetworkTools.getRandomNumberBetweenRange(
                        0,
                        1
                    ),
                });
            }
        }
        // iterate hiddens and make one connection to either a hidden or output neuron (allowing to connect to self)
        for (let i = 0; i < hiddens.length; i++) {
            let index = Math.floor(
                Math.random() * (hiddens.length + outputs.length)
            );
            function processIndex() {
                if (index < hiddens.length) {
                    connections.push({
                        source: hiddens[i],
                        sink: hiddens[index],
                        weight: neuralNetworkTools.getRandomNumberBetweenRange(
                            -1,
                            1
                        ),
                    });
                } else {
                    connections.push({
                        source: hiddens[i],
                        sink: outputs[index - hiddens.length],
                        weight: neuralNetworkTools.getRandomNumberBetweenRange(
                            -1,
                            1
                        ),
                    });
                }
            }
            processIndex();

            if (JSON.stringify(hiddens[i]) === JSON.stringify(hiddens[index])) {
                // TODO: I dont think we need to stringify here for equality check
                // it connected to its self, make a second connection thats not to its self
                let selfIndex = index;
                function getNewIndex() {
                    index = Math.floor(
                        Math.random() * (hiddens.length + outputs.length)
                    );
                    if (index === selfIndex) {
                        getNewIndex();
                    }
                }
                getNewIndex();
                processIndex();
            }
        }
        // Cull hidden layer neurons that never chain to an output neuron
        // Label the connection as good if the sinks layer is = Output
        // Label the connection as good if the sink is a source of a different connection that has been labelled good
        // We recursively check the connections over and over
        // When one iteration of the recursion has not labelled any connections as good, we know that the recursion is finished
        // Then the remaining unlabelled connections are not connected to an output neuron and are culled
        
        function cullDisconnectedNeurons() {
            let recusiveCounter = 0;
            for (let i = 0; i < connections.length; i++) {
                let connection = connections[i];
                if (connection.sink.layer === 'Output' && connection.good === undefined) {
                    connection.good = true;
                    recusiveCounter++;
                } else if (connection.sink.layer === 'Hidden' && connection.good === undefined) {
                    for (let j = 0; j < connections.length; j++) {
                        let otherConnection = connections[j];
                        if (
                            otherConnection.good &&
                            otherConnection.source === connection.sink
                        ) {
                            connection.good = true;
                            recusiveCounter++;
                            break;
                        }
                    }
                }
            }
            if (recusiveCounter > 0) {
                // At least one connection has been labelled good, so we need to recurse again
                cullDisconnectedNeurons();
            } else {
                // Iterate in reverse so not to mess up the index
                for (let i = connections.length -1; i >= 0; i--) {
                    let connection = connections[i];
                    if (!connection.good) {
                        console.log('Culling:', connection);
                        connections.splice(i, 1);
                    }
                }
            }
            // remove the good property from the connections
            for (let i = 0; i < connections.length; i++) {
                delete connections[i].good;
            }
        }
        cullDisconnectedNeurons();

        return connections;
    },
    generateColorFromGenome(connections) {
        // Generate a number between 0 and 255 for each of the three color channels
        let globalRed = 0;
        let globalGreen = 0;
        let globalBlue = 0;

        // Generate a colour per gene (a connection represents a gene)
        connections.forEach((connection) => {
            // Source Layer: input = 0, hidden = 1
            // Sink Layer: hidden = 0, output = 1
            // Types: pheromone = 0, internal = 1, environement = 2, social = 3, hidden = 4 (space for 2 more types if needed)
            // TypeIDs: unique for each type counting up from 1

            // Red channel
            // Bit 1 = Source Layer (input, hidden)
            // Bit 2-4 = Source Type (allows for 7 different types)
            // Bit 5-8 = Source TypeID (4 bits allows for 15 different IDs per type)

            // Green channel
            // Bit 1 = Sink Layer (hidden, output)
            // Bit 2-4 = Sink Type (allows for 7 different types)
            // Bit 5-8 = Sink Type + ID (4 bits allows for 15 different IDs per type)

            // Source = Red, Sink = Green
            function generateRedOrGreenColorChannel(channel, obj) {
                let binaryChannel = '';
                // Bit 1 = Source/Sink Layer (input, hidden)
                if (channel === 'red') {
                    if (obj.layer === 'Input') {
                        binaryChannel += '0';
                    } else {
                        binaryChannel += '1';
                    }
                } else {
                    if (obj.layer === 'Hidden') {
                        binaryChannel += '0';
                    } else {
                        binaryChannel += '1';
                    }
                }
                //console.log('Bit 1:', binaryChannel, 'channel:', channel);

                // Bit 2-4 = Source/Sink Type (allows for 7 different types)
                if (obj.type === 'Pheromone') {
                    binaryChannel += '000';
                } else if (obj.type === 'Internal') {
                    binaryChannel += '001';
                } else if (obj.type === 'Environement') {
                    binaryChannel += '010';
                } else if (obj.type === 'Social') {
                    binaryChannel += '011';
                } else if (obj.type === 'Hidden') {
                    binaryChannel += '100';
                }
                //console.log('Bits 1-4:', binaryChannel, 'channel:', channel);

                // Bit 5-8 = Source/Sink TypeID (4 bits allows for 15 different IDs per type)
                binaryChannel += parseInt(obj.typeID)
                    .toString(2)
                    .padStart(4, '0');
                //console.log('Bits 1-8:', binaryChannel, 'channel:', channel);
                let base10Channel = parseInt(binaryChannel, 2);
                if (channel === 'red') {
                    globalRed += base10Channel;
                    //console.log(`Red: ${base10Channel}`);
                } else {
                    globalGreen += base10Channel;
                    //console.log(`Green: ${base10Channel}`);
                }
            }

            generateRedOrGreenColorChannel('red', connection.source);
            generateRedOrGreenColorChannel('green', connection.sink);

            // Blue channel
            // Bit 1-8 = Weight (floating point weight is rounded off to 8 bits)

            function generateBlueColorChannel(weight) {
                if (weight >= 0) {
                    let binaryChannel = weight
                        .toString(2)
                        .substring(2, 10)
                        .padStart(8, '0');
                    let base10Channel = parseInt(binaryChannel, 2);
                    globalBlue += base10Channel;
                } else {
                    weight = Math.abs(weight);
                    let binaryChannel = weight
                        .toString(2)
                        .substring(2, 10)
                        .padStart(8, '0');
                    let base10Channel = parseInt(binaryChannel, 2);
                    globalBlue += Math.round(base10Channel / 2);
                }
            }
            generateBlueColorChannel(connection.weight);
        });
        // Do this for each gene and then add the channels together then divide by the number of genes to get a final colour
        let finalRed = Math.round(globalRed / connections.length);
        let finalGreen = Math.round(globalGreen / connections.length);
        let finalBlue = Math.round(globalBlue / connections.length);
        let finalColor = `rgb(${finalRed}, ${finalGreen}, ${finalBlue})`;

        return finalColor;
    },
    getRandomDirection() {
        // random number between 0 and 3
        let direction = Math.floor(Math.random() * 4);
        if (direction === 0) {
            return 'North';
        } else if (direction === 1) {
            return 'East';
        } else if (direction === 2) {
            return 'South';
        } else if (direction === 3) {
            return 'West';
        }
    },
    getRandomNumberBetweenRange(min, max) {
        return Math.random() * (max - min) + min;
    },
    sumValues(array) {
        let sum = 0;
        array.forEach((value) => {
            sum += value;
        });
        return sum;
    },
    mutateWeights(weights, mutationRate) {
        for (let first in weights) {
            for (let second in weights[first]) {
                if (Math.random() < mutationRate) {
                    // Mutation occurs
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
