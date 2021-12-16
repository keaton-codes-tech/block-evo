import { neuralNetworkTools } from './neuralNetworkTools.mjs';

export class NeuralNetwork {
    constructor(numInputs, numHiddens, numOutputs) {
        this.inputs = neuralNetworkTools.getRandomInputs(numInputs);
        this.hiddens = neuralNetworkTools.getHiddens(numHiddens);
        this.outputs = neuralNetworkTools.getRandomOutputs(numOutputs);
        this.connections = neuralNetworkTools.getRandomConnections(
            this.inputs,
            this.hiddens,
            this.outputs
        );
        this.responsiveness = 0.5;
        this.oscillationInterval = 25;
    }
    feedForward() {
        // input neurons produce a number between 0 and 1
        // input neurons multiply their value with their weights and send the result to the sink

        // hidden layer neurons produce a number between -1 and 1
        // they sum up all their inputs and squish it to this range with tanh(sum(inputs))

        // output neurons produce a number between -1 and 1
        // they sum up all their inputs and squish it to this range with tanh(sum(inputs))
        // outputs final values are the probabilities of the actions being taken negative or positive
        // some outputs will only fire if their value is positive

        for (let index = 0; index < this.connections.length; index++) {
            const connection = this.connections[index];
            // if the source is an input neuron, multiply the input value with the weight
            if (connection.source.type === 'input') {
                // The value that is sent should be preferably between -4 and 4
                connection.sink.receivedValues.push(
                    connection.source.value * connection.weight
                );
            }
        }

        for (let index = 0; index < this.connections.length; index++) {
            const connection = this.connections[index];
            // if the source is a hidden neuron, sum all the received values and squish it with tanh
            if (connection.source.type === 'hidden') {
                connection.source.value = Math.tanh(neuralNetworkTools.sumValues(connection.source.receivedValues));
            }
        }
        for (let index = 0; index < this.connections.length; index++) {
            const connection = this.connections[index];
            // then send the result to the sink
            if (connection.source.type === 'hidden') {
                connection.sink.receivedValues.push(
                    connection.source.value * connection.weight
                );
            }
        }

        // iterate through the output neurons, sum all the received values and squish it with tanh
        for (let index = 0; index < this.outputs.length; index++) {
            const output = this.outputs[index];
            output.value = Math.tanh(neuralNetworkTools.sumValues(output.receivedValues));
        }


    }
    processInputActions(block) {
        // Process Input actions
        // Inputs fire every step regardless of weights
        for (let index = 0; index < this.inputs.length; index++) {
            const input = this.inputs[index];
            input.value = input.action(block);
        }
    }
    processOutputActions(block) {
        // Process Output actions
        // Outputs fire depending on their value
        for (let index = 0; index < this.outputs.length; index++) {
            const output = this.outputs[index];
            output.action(block);
        }
    }
    evolveGenome() {
        // mutate the weights
        this.weights_ih = neuralNetworkTools.mutateWeights(
            this.weights_ih,
            0.1
        );
        this.weights_ho = neuralNetworkTools.mutateWeights(
            this.weights_ho,
            0.1
        );
    }
}
