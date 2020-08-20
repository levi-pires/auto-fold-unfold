/**
 * This module will only be used to store immutable values and simple functions
 */

const { commands } = require("vscode");

/**
 * This is a simple function. It should only be used in simple situations
 */
const fold1By1 = () => {
    let level = 1;
    for (let i = 7; i >= level; --i) {
        commands.executeCommand(`editor.foldLevel${i}`).then(
            () => {},
            reason => console.error(reason)
        );
    }
};

module.exports = { fold1By1 };