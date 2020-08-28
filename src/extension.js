/**<,m */
const { workspace, window, commands } = require('vscode');
const Main = require('./main');
const Update = require('./update');
const ConfigLoader = require('./config-loader');

/**
 * @param {import('vscode').ExtensionContext} context
 */
function activate(context) {

    let init = async() => {
        let load = window.setStatusBarMessage('$(loading) Auto Fold & Unfold: Activating extension');

        try {
            await ConfigLoader.loadConfig(context.workspaceState);
        } catch (err) {
            load.dispose();
            window.showErrorMessage('The extension could not be loaded.' + '\n' + err);
            return;
        }

        Update.showUpdate(context.extensionPath, 'The settings scope have changed.', ['go to settings', "don't show again"], [
            () => {
                commands.executeCommand('workbench.action.openSettings', 'auto-fold-unfold');
            },
            () => {}
        ]);

        context.subscriptions.push(
            window.onDidChangeActiveTextEditor(() => {
                if (context.workspaceState.get('auto-fold-unfold.onChange') && window.activeTextEditor) {
                    Main.fold();
                }
            }),
            workspace.onWillSaveTextDocument(() => {
                if (context.workspaceState.get('auto-fold-unfold.onSaved')) {
                    Main.fold();
                }
            }),
            window.onDidChangeTextEditorSelection(event => {
                if (event.kind.valueOf() == 3 ||
                    !context.workspaceState.get('auto-fold-unfold.onEditing').enable ||
                    !window.activeTextEditor ||
                    window.activeTextEditor.selection.active.compareTo(window.activeTextEditor.selection.anchor) !== 0) {
                    return;
                }

                Main.handle(
                    context.workspaceState.get('auto-fold-unfold.onEditing').unfoldMode /**parent or family*/ ,
                    context.workspaceState.get('auto-fold-unfold.onEditing').foldMode /**fast or best*/ ,
                    event.textEditor.selection
                );
            }),
            commands.registerTextEditorCommand('auto-fold-unfold.foldAndClose', () => {
                Main.fold(true);
            }),
            workspace.onDidChangeConfiguration(async event => {
                if (event.affectsConfiguration('auto-fold-unfold')) {
                    let reload = window.setStatusBarMessage('$(loading) Auto Fold & Unfold: Applying changes');

                    try {
                        await ConfigLoader.loadConfig(context.workspaceState);
                        window.showInformationMessage('All changes have been successfully applied');
                    } catch (err) {
                        window.showErrorMessage(err);
                    }

                    reload.dispose();
                }
            })
        );

        load.dispose();
        window.setStatusBarMessage('$(check) Auto Fold & Unfold: The extension is active', 5000);
    };

    init();
}

exports.activate = activate;

function deactivate() {}

module.exports = {
    activate,
    deactivate
};