/**<,m */
const { workspace, window } = require('vscode');
const Scanner = require('./scanner');
const { fold1By1 } = require('./consts');

/**
 * @param {import('vscode').ExtensionContext} context
 */
function activate(context) {

    context.subscriptions.push(
        window.onDidChangeActiveTextEditor(() => {
            if (workspace.getConfiguration('auto-fold-unfold').get('onDidChangeActiveTextEditor') && window.activeTextEditor) {
                fold1By1();
            }
        }),
        workspace.onWillSaveTextDocument(() => {
            if (workspace.getConfiguration('auto-fold-unfold').get('onSaved')) {
                fold1By1();
            }
        }),
        window.onDidChangeTextEditorSelection(() => {
            if (workspace.getConfiguration('auto-fold-unfold').get('onEdit')) {
                handle();
            }
        })
    );

}

/**
 * `handle()` is the core function. It is responsible for controlling the environment,
 * stoping operations that would result in runtime errors/bugs and calling the `Scanner`, passing on all the data it needs
 */
function handle() {
    if (!window.activeTextEditor) {
        return;
    }

    if (window.activeTextEditor.selection.active.compareTo(window.activeTextEditor.selection.anchor) !== 0) {
        return;
    }

    let scan = Scanner.scan();

    if (workspace.getConfiguration('auto-fold-unfold').get('debug')) {
        scan.forEach((item, index, array) => {
            if (typeof item == 'object') {
                console.time(`\nHow long the scanner "${array[index - 1]}" take to do it's job`);
                item.then(
                    () => console.timeEnd(`\nHow long the scanner "${array[index - 1]}" take to do it's job`),
                    reason => console.warn(reason)
                );
            }
        });
    }
}

exports.activate = activate;

function deactivate() {}

module.exports = {
    activate,
    deactivate
};