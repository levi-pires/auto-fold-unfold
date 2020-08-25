/**<,m */

const { workspace, window, commands } = require('vscode');
const Main = require('./main');

/**
 * @param {import('vscode').ExtensionContext} context
 */
function activate(context) {

    context.subscriptions.push(
        window.onDidChangeActiveTextEditor(() => {
            if (workspace.getConfiguration('auto-fold-unfold').get('onDidChangeActiveTextEditor') && window.activeTextEditor) {
                Main.fold();
            }
        }),
        workspace.onWillSaveTextDocument(() => {
            if (workspace.getConfiguration('auto-fold-unfold').get('onSaved')) {
                Main.fold();
            }
        }),
        window.onDidChangeTextEditorSelection(event => {
            if (event.kind.valueOf() === 3 ||
                !workspace.getConfiguration('auto-fold-unfold').get('onEdit') ||
                !window.activeTextEditor ||
                window.activeTextEditor.selection.active.compareTo(window.activeTextEditor.selection.anchor) !== 0) {
                return;
            }

            Main.handle(
                workspace.getConfiguration('auto-fold-unfold').get('behaviorOnEdit', 'parent'),
                workspace.getConfiguration('auto-fold-unfold').get('modeOnEdit', 'fast'),
                event.textEditor.selection
            );
        }),
        commands.registerTextEditorCommand('auto-fold-unfold.foldAndClose', () => {
            Main.fold(true);
        })
    );

}

exports.activate = activate;

function deactivate() {}

module.exports = {
    activate,
    deactivate
};