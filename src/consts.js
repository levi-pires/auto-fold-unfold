/**
 * This module will only be used to store immutable values and simple functions
 */

const { commands } = require("vscode");

/**
 * This is a simple function. It should only be used in simple situations
 */
const foldAll = () => {
    commands.executeCommand('editor.foldAll').then(
        () => {},
        reason => console.error(reason)
    );
};

/**
 * For debug purpose
 * @param {any[]} array 
 * @param {boolean} debug 
 */
const timer = (array, debug) => {
    if (debug) {
        array.forEach((item, index) => {
            if (typeof item == 'object') {
                console.time(`How long the scanner "${array[index - 1]}" take to do it's job`);
                item.then(
                    () => console.timeEnd(`How long the scanner "${array[index - 1]}" take to do it's job`),
                    reason => console.warn(reason)
                );
            }
        });
    }
};

module.exports = { foldAll, timer };