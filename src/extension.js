/**<,m */

const { workspace, window, commands } = require('vscode');
const Main = require('./main');
const fs = require('fs');

/**
 * @param {import('vscode').Memento} memento
 */
function loadConfig(memento) {
    let warn = (item) => window.showWarningMessage(`${item} was not found.` +
        ' Using default properties.'
    );

    return new Promise((resolve, reject) => {
        memento.update('onEdit', workspace.getConfiguration('auto-fold-unfold').get('onEditing')).then(
            () => {
                if (!memento.get('onEdit')) {
                    warn('auto-fold-unfold.onEditing');
                    memento.update('onEdit', {
                        "enable": true,
                        "foldMode": "fast",
                        "unfoldMode": "parent"
                    });
                }

                memento.update('onSave', workspace.getConfiguration('auto-fold-unfold').get('onSaved')).then(
                    () => {
                        if (memento.get('onSave') == undefined) {
                            warn('auto-fold-unfold.onSaved');
                            memento.update('onSave', false);
                        }

                        memento.update('onChange', workspace.getConfiguration('auto-fold-unfold').get('onDidChangeActiveTextEditor'))
                            .then(
                                () => {
                                    if (memento.get('onChange') == undefined) {
                                        warn('auto-fold-unfold.onDidChangeActiveTextEditor');
                                        memento.update('onChange', false);
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

/**
 * @param {import('vscode').ExtensionContext} context
 */
function activate(context) {

    let init = async() => {
        let load = window.createStatusBarItem(require('vscode').StatusBarAlignment.Left);
        load.text = '$(loading) Auto Fold & Unfold: loading settings';
        load.show();

        try {
            await loadConfig(context.workspaceState);
        } catch (err) {
            load.dispose();
            window.showErrorMessage(err + '\nThe extension could not be loaded.');
            return;
        }

        let version = JSON.parse(fs.readFileSync(context.extensionPath + '/package.json').toString()).version;
        if (!fs.existsSync(context.extensionPath + '/.update')) {
            fs.appendFileSync(context.extensionPath + '/.update', '');
        }
        if (fs.readFileSync(context.extensionPath + '/.update').toString() != version) {
            window.showInformationMessage(
                'The settings have changed.',
                'goto settings',
                "don't show again"
            ).then(value => {
                if (value == 'goto settings') {
                    fs.writeFileSync(context.extensionPath + '/.update', version);
                    commands.executeCommand('workbench.action.openSettings', 'auto-fold-unfold');
                }

                if (value == "don't show again") {
                    fs.writeFileSync(context.extensionPath + '/.update', version);
                }
            });
        }

        load.dispose();
        window.setStatusBarMessage('$(check) Auto Fold & Unfold: The settings were successfully loaded', 2500);

        context.subscriptions.push(
            window.onDidChangeActiveTextEditor(() => {
                if (context.workspaceState.get('onChange') && window.activeTextEditor) {
                    Main.fold();
                }
            }),
            workspace.onWillSaveTextDocument(() => {
                if (context.workspaceState.get('onSave')) {
                    Main.fold();
                }
            }),
            window.onDidChangeTextEditorSelection(event => {
                if (event.kind.valueOf() === 3 ||
                    !context.workspaceState.get('onEdit').enable ||
                    !window.activeTextEditor ||
                    window.activeTextEditor.selection.active.compareTo(window.activeTextEditor.selection.anchor) !== 0) {
                    return;
                }

                Main.handle(
                    context.workspaceState.get('onEdit').unfoldMode /**parent or family*/ ,
                    context.workspaceState.get('onEdit').foldMode /**fast or best*/ ,
                    event.textEditor.selection
                );
            }),
            commands.registerTextEditorCommand('auto-fold-unfold.foldAndClose', () => {
                Main.fold(true);
            }),
            workspace.onDidChangeConfiguration(async(event) => {
                if (event.affectsConfiguration('auto-fold-unfold')) {
                    let item = window.createStatusBarItem(require('vscode').StatusBarAlignment.Left);
                    item.text = '$(loading) Auto Fold & Unfold: applying changes';
                    item.show();

                    try {
                        await loadConfig(context.workspaceState);
                        window.showInformationMessage('All changes have been successfully applied');
                    } catch (err) {
                        window.showErrorMessage(err);
                    }

                    item.dispose();
                }
            })
        );

        console.log('auto-fold-unfold is now active.');

    };

    init();
}

exports.activate = activate;

function deactivate() {}

module.exports = {
    activate,
    deactivate
};