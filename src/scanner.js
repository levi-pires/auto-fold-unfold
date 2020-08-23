const { commands } = require('vscode');

/**
 * This is the core of this file.
 */
const Scanner = {
    /**
     * @param {string} scope
     * @returns {Thenable<any>[]} An array containing generated Thenables.
     * The `array.length` will always be equal to or greater than 1
     */
    scan: (scope) => {
        let res = [];
        for (let level = 7; level > 0; --level) {
            res.push(commands.executeCommand(`editor.foldLevel${level}`));
        }
        if (scope === "family") res.push(commands.executeCommand('editor.unfoldRecursively'));
        if (scope === "parent") res.push(commands.executeCommand('editor.unfold'));
        return res;
    }
}

module.exports = Scanner;