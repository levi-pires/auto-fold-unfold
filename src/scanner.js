const { commands } = require('vscode');
const Consts = require('./consts');

/**
 * This is the core of this file.
 */
const Scanner = {
    /**
     * @param {string} scopeId
     * @returns {Thenable<any>[]} An array containing generated Thenables.
     * The `array.length` will always be equal to or greater than 1
     */
    scan: (scopeId) => {
        let res = [];
        for (let level = 7; level > 0; --level) {
            res.push(commands.executeCommand(`editor.foldLevel${level}`));
        }
        res.push(Consts.scope[scopeId]());
        return res;
    }
};

module.exports = Scanner;