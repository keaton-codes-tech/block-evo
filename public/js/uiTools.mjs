'use strict';

export const uiTools = {
    debounceArr: [],
    mouse: { x: null, y: null },
    FPS: 60,
    selectedBlock: null,
    // Create a control panel element
    createControlPanelElement: ({ id, label, type, value, min, max, step }) => {
        // create a div element
        const div = document.createElement('div');
        div.id = id;
        div.classList.add = 'control-panel-element-container';
        // create a label element
        const labelElement = document.createElement('label');
        labelElement.innerHTML = label + ': ';
        // create a input element
        const inputElement = document.createElement('input');
        inputElement.classList.add = 'control-panel-input';
        inputElement.id = id;
        inputElement.type = type;
        inputElement.value = value;
        if (type === 'range' || type === 'number') {
            inputElement.min = min;
            inputElement.max = max;
            inputElement.step = step;
        }
        // append elements to div
        div.appendChild(labelElement);
        div.appendChild(inputElement);
        return div;
    },
    // create a function that returns an info panel element
    createInfoPanelElement: ({ id, label, value }) => {
        // create a div element
        const div = document.createElement('div');
        div.id = id;
        div.classList.add = 'info-panel-element-container';
        // create a label element
        const labelElement = document.createElement('label');
        labelElement.innerHTML = label + ': ';
        // create a span element
        const infoElement = document.createElement('span');
        infoElement.id = id;
        infoElement.innerHTML = value;
        // append elements to div
        div.appendChild(labelElement);
        div.appendChild(infoElement);
        return div;
    },
    createBlockInfoPanelElement: ({ id, label, value }) => {
        // create a div element
        const div = document.createElement('div');
        div.id = id;
        div.classList.add = 'info-panel-element-container';
        // create a label element
        const labelElement = document.createElement('label');
        labelElement.innerHTML = label + ': ';
        // create a span element
        const infoElement = document.createElement('span');
        infoElement.id = id;
        infoElement.innerHTML = value;
        // append elements to div
        div.appendChild(labelElement);
        div.appendChild(infoElement);
        return div;
    },
    // update the info panel
    updateInfo: () => {
        function checkIfElementNeedsUpdate(id, newVal) {
            let prev = document.querySelector('#' + id + '>span').innerHTML;
            if (prev != newVal) {
                document.querySelector('#' + id + '>span').innerHTML = newVal;
            }
        }
        // update the FPS info
        function updateFPS() {
            checkIfElementNeedsUpdate('fpsinfo', uiTools.FPS);
        }
        uiTools.debounce('FPS', updateFPS, 500);

        // update the Block info
        function updateSelectedBlock() {
            // check if there is a selected block
            if (uiTools.selectedBlock !== null) {
                checkIfElementNeedsUpdate('block-x-info', uiTools.selectedBlock.x);
                checkIfElementNeedsUpdate('block-y-info', uiTools.selectedBlock.y);
                checkIfElementNeedsUpdate('block-color-info', uiTools.selectedBlock.color);
                checkIfElementNeedsUpdate('block-brain-info', JSON.stringify(uiTools.selectedBlock.brain));
                console.log(uiTools.selectedBlock.brain);
            }
        }
        updateSelectedBlock();
    },

    // create a function to manage debouncing
    debounce: (label, func, wait) => {
        const now = Date.now();
        // find object in array with the same label
        const index = uiTools.debounceArr.findIndex((obj) => obj.label === label);
        // if the object exists
        if (index !== -1) {
            // find the elsapsed time
            const elapsed = now - uiTools.debounceArr[index].last;
            // if the elsapsed time is greater than the wait time
            if (elapsed > wait) {
                // call the function
                func();
                // update the last time the function was called
                uiTools.debounceArr[index].last = now;
            }
        } else {
            // create a new object
            uiTools.debounceArr.push({
                label,
                last: now,
            });
            // call the function
            func();
        }
    },
}