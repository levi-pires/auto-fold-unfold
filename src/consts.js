/**
 * This module will only be used to store immutable values and simple functions
 */

const { commands, workspace } = require("vscode");

class Consts {
    /**
     * This is a simple function. It should only be used in simple situations
     */
    static fold(closed = false) {
        let config = workspace.getConfiguration('auto-fold-unfold').get('onEdit');

        let doFold = () => {
            return commands.executeCommand('editor.foldAll').then(
                () => {
                    if (closed) {
                        return commands.executeCommand('workbench.action.closeActiveEditor');
                    }
                },
                reason => console.error(reason)
            );
        };

        if (config) {
            workspace.getConfiguration('auto-fold-unfold').update('onEdit', false, false).then(
                () => doFold().then(
                    () => workspace.getConfiguration('auto-fold-unfold').update('onEdit', true, false),
                    reason => console.error(reason)
                ),
                reason => console.error(reason)
            );
        } else {
            doFold();
        }
    }
}

module.exports = Consts;