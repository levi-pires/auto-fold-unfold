/**<,m */

const { workspace, window, commands } = require('vscode');
const Scanner = require('./scanner');
const Consts = require('./consts');

/**
 * @param {import('vscode').ExtensionContext} context
 */
function activate(context) {

    context.subscriptions.push(
        window.onDidChangeActiveTextEditor(() => {
            if (workspace.getConfiguration('auto-fold-unfold').get('onDidChangeActiveTextEditor') && window.activeTextEditor) {
                Consts.fold();
            }
        }),
        workspace.onWillSaveTextDocument(() => {
            if (workspace.getConfiguration('auto-fold-unfold').get('onSaved')) {
                Consts.fold();
            }
        }),
        window.onDidChangeTextEditorSelection(() => {
            handle();
        }),
        commands.registerTextEditorCommand('auto-fold-unfold.foldAndClose', () => {
            Consts.fold(true);
        })
    );

}

/**
 * `handle()` is the core function. It is responsible for controlling the environment,
 * stoping operations that would result in runtime errors/bugs and calling the `Scanner`, passing on all the data it needs
 */
function handle() {
    if (!workspace.getConfiguration('auto-fold-unfold').get('onEdit') ||
        !window.activeTextEditor ||
        window.activeTextEditor.selection.active.compareTo(window.activeTextEditor.selection.anchor) !== 0
    ) {
        return;
    }

    Scanner.scan(workspace.getConfiguration('auto-fold-unfold').get('behaviorOnEdit') || "parent");
}

exports.activate = activate;

function deactivate() {}

module.exports = {
    activate,
    deactivate
};