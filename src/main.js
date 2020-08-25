const { commands, window, Range } = require("vscode");

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
        let scope = {
            family: () => commands.executeCommand('editor.unfoldRecursively'),
            parent: () => commands.executeCommand('editor.unfold')
        };

        let mode = {
            fast: () => {
                let array = [];
                for (let level = 7; level > 0; --level) {
                    array.push(commands.executeCommand(`editor.foldLevel${level}`));
                }
                array.push(scope[scopeId]());
                return array;
            },
            best: () => {
                return [commands.executeCommand('editor.foldAll').then(
                    () => {
                        window.activeTextEditor.selection = position;
                        window.activeTextEditor.revealRange(new Range(position.start, position.end));
                        return scope[scopeId]();
                    },
                    reason => reason
                )];
            }
        };

        return mode[modeId]();
    }
};