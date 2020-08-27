const { commands, window } = require("vscode");

const unfold = {
    family: () => commands.executeCommand('editor.unfoldRecursively'),
    parent: () => commands.executeCommand('editor.unfold')
};

const fold = {
    /**
     * @returns {Thenable<any>[]}
     */
    fast: (...args) => {
        let array = [];
        for (let level = 7; level > 0; --level) {
            array.push(commands.executeCommand(`editor.foldLevel${level}`));
        }
        array.push(unfold[ /**unfoldModeId*/ args[0]]());
        return array;
    },
    /**
     * @param {string} unfoldModeId
     * @param {import('vscode').Selection} selection
     * @returns {Thenable<any>[]}
     */
    best: (unfoldModeId, selection) => [
        commands.executeCommand('editor.foldAll').then(
            () => {
                window.activeTextEditor.selection = selection;
                return unfold[unfoldModeId]();
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
     * @param {string} unfoldModeId must be `parent` or `family`
     * @param {string} foldModeId must be `fast` or `best`
     * @param {import('vscode').Selection} cursorSelection the cursor position before changes
     * @returns {Thenable<any>[]}
     */
    handle: (unfoldModeId, foldModeId, cursorSelection) => {
        return fold[foldModeId](unfoldModeId, cursorSelection);
    }
};