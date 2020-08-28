const { window, workspace } = require('vscode');

/**
 * @param {import('vscode').Memento} memento
 */
function loadConfig(memento) {
    let warn = (item) => window.showWarningMessage(`${item} was not found.` +
        ' Using default properties.'
    );

    return new Promise((resolve, reject) => {
        memento.update('auto-fold-unfold.onEditing', workspace.getConfiguration('auto-fold-unfold').get('onEditing')).then(
            () => {
                if (!memento.get('auto-fold-unfold.onEditing')) {
                    warn('auto-fold-unfold.onEditing');
                    memento.update('auto-fold-unfold.onEditing', {
                        "enable": true,
                        "foldMode": "fast",
                        "unfoldMode": "parent"
                    });
                }

                memento.update('auto-fold-unfold.onSaved', workspace.getConfiguration('auto-fold-unfold').get('onSaved')).then(
                    () => {
                        if (memento.get('auto-fold-unfold.onSaved') == undefined) {
                            warn('auto-fold-unfold.onSaved');
                            memento.update('auto-fold-unfold.onSaved', false);
                        }

                        memento.update('auto-fold-unfold.onChange', workspace.getConfiguration('auto-fold-unfold').get('onDidChangeActiveTextEditor'))
                            .then(
                                () => {
                                    if (memento.get('auto-fold-unfold.onChange') == undefined) {
                                        warn('auto-fold-unfold.onDidChangeActiveTextEditor');
                                        memento.update('auto-fold-unfold.onChange', false);
                                    }

                                    resolve();
                                },
                                reason => reject(reason)
                            );
                    },
                    reason => reject(reason)
                );
            },
            reason => reject(reason)
        );
    });
}

module.exports = { loadConfig };