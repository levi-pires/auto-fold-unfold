/**<,m */
const { workspace, window } = require('vscode');
const Scanner = require('./scanner');
const { foldAll } = require('./consts');

/**
 * @param {import('vscode').ExtensionContext} context
 */
function activate(context) {

    context.subscriptions.push(
        window.onDidChangeActiveTextEditor(() => {
            if (workspace.getConfiguration('auto-fold-unfold').get('onDidChangeActiveTextEditor') && window.activeTextEditor) {
                foldAll();
            }
        }),
        workspace.onWillSaveTextDocument(() => {
            if (workspace.getConfiguration('auto-fold-unfold').get('onSaved')) {
                foldAll();
            }
        }),
        window.onDidChangeTextEditorSelection(() => {
            handle();
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

    if (workspace.getConfiguration('auto-fold-unfold').get('debug')) {
        Scanner.scan().forEach((item, index, array) => {
            if (typeof item == 'object') {
                console.time(`\nHow long the scanner "${array[index - 1]}" take to do it's job`);
                item.then(
                    () => console.timeEnd(`\nHow long the scanner "${array[index - 1]}" take to do it's job`),
                    reason => console.warn(reason)
                );
            }
        });
    } else {
        Scanner.scan();
    }
}

exports.activate = activate;

function deactivate() {}

module.exports = {
    activate,
    deactivate
};