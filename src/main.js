const { commands, window } = require("vscode");

const scope = {
    family: () => commands.executeCommand('editor.unfoldRecursively'),
    parent: () => commands.executeCommand('editor.unfold')
};

const mode = {
    /**
     * @returns {Thenable<any>[]}
     */
    fast: (...args) => {
        let array = [];
        for (let level = 7; level > 0; --level) {
            array.push(commands.executeCommand(`editor.foldLevel${level}`));
        }
        array.push(scope[ /**scopeId*/ args[0]]());
        return array;
    },
    /**
     * @param {string} scopeId
     * @param {import('vscode').Selection} position
     * @returns {Thenable<any>[]}
     */
    best: (scopeId, position) => [
        commands.executeCommand('editor.foldAll').then(
            () => {
                window.activeTextEditor.selection = position;
                return scope[scopeId]();
            },
            reason => reason
        )
    ]
};

module.exports = {
    /**
     * this is a simple function. It should only be used in simple situations
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
    },
    /**
     * @param {string} scopeId must be `parent` or `family`
     * @param {string} modeId must be `fast` or `best`
     * @param {import('vscode').Selection} position the cursor position before changes
     * @returns {any[]}
     */
    handle: (scopeId, modeId, position) => {
        return mode[modeId](scopeId, position);
    }
};