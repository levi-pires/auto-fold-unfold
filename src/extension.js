/**<,m */

const { workspace, window, commands } = require('vscode');
const Main = require('./main');

var onChange = workspace.getConfiguration('auto-fold-unfold').get('onDidChangeActiveTextEditor', false);
var onSave = workspace.getConfiguration('auto-fold-unfold').get('onSaved', false);
var onEdit = workspace.getConfiguration('auto-fold-unfold').get('onEdit', true);

/**
 * @param {import('vscode').ExtensionContext} context
 */
function activate(context) {

    context.subscriptions.push(
        window.onDidChangeActiveTextEditor(() => {
            if (onChange && window.activeTextEditor) {
                Main.fold();
            }
        }),
        workspace.onWillSaveTextDocument(() => {
            if (onSave) {
                Main.fold();
            }
        }),
        window.onDidChangeTextEditorSelection(event => {
            if (event.kind.valueOf() === 3 ||
                !onEdit ||
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
        }),
        workspace.onDidChangeConfiguration(event => {
            if (event.affectsConfiguration('auto-fold-unfold')) {
                let item = window.createStatusBarItem(require('vscode').StatusBarAlignment.Left);
                item.text = '$(loading) Auto Fold & Unfold: applying changes';
                item.show();

                new Promise((resolve, reject) => {
                    try {
                        onChange = workspace.getConfiguration('auto-fold-unfold').get('onDidChangeActiveTextEditor', false);
                        onSave = workspace.getConfiguration('auto-fold-unfold').get('onSaved', false);
                        onEdit = workspace.getConfiguration('auto-fold-unfold').get('onEdit', true);
                        resolve();
                    } catch (err) {
                        reject(err);
                    }
                }).then(
                    () => {
                        window.showInformationMessage('All changes have been successfully applied');
                        item.hide();
                    },
                    reason => {
                        window.showWarningMessage(reason);
                        item.hide();
                    }
                );
            }
        })
    );

}

exports.activate = activate;

function deactivate() {}

module.exports = {
    activate,
    deactivate
};