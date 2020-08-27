/**<,m */

const { workspace, window, commands } = require('vscode');
const Main = require('./main');

var onChange = false;
var onSave = false;
var onEdit = {
    "enable": true,
    "foldMode": "fast",
    "unfoldMode": "parent"
};

function loadConfig() {
    onEdit = workspace.getConfiguration('auto-fold-unfold').get('onEditing');
    onSave = workspace.getConfiguration('auto-fold-unfold').get('onSaved');
    onChange = workspace.getConfiguration('auto-fold-unfold').get('onDidChangeActiveTextEditor');
    let warn = (item) => window.showWarningMessage(`${item} was not found.` +
        ' Using default properties.'
    );
    if (onChange == undefined) {
        warn('auto-fold-unfold.onDidChangeActiveTextEditor');
        onChange = false;
    }
    if (onSave == undefined) {
        warn('auto-fold-unfold.onSaved');
        onSave = false;
    }
    if (!onEdit) {
        warn('auto-fold-unfold.onEditing');
        onEdit = {
            "enable": true,
            "foldMode": "fast",
            "unfoldMode": "parent"
        };
    }
}

/**
 * @param {import('vscode').ExtensionContext} context
 */
function activate(context) {

    loadConfig();

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
                !onEdit.enable ||
                !window.activeTextEditor ||
                window.activeTextEditor.selection.active.compareTo(window.activeTextEditor.selection.anchor) !== 0) {
                return;
            }

            Main.handle(
                onEdit.unfoldMode /**parent */ ,
                onEdit.foldMode /**fast */ ,
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
                        loadConfig();
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