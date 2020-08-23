/**
 * This module will only be used to store immutable values and simple functions
 */

const { commands } = require("vscode");

const Consts = {
    /**
     * This is a simple function. It should only be used in simple situations
     */
    fold: (close = false) => {
        return commands.executeCommand('editor.foldAll').then(
            () => {
                if (close) {
                    return commands.executeCommand('workbench.action.closeActiveEditor');
                }
            },
            reason => console.error(reason)
        );
    }
};

module.exports = Consts;