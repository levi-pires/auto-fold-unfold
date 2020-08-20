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

module.exports = { foldAll };