/**<,m */
const vscode = require('vscode');
const Scanner = require('./scanner');
const { unsupported } = require('./consts');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if ((vscode.workspace.getConfiguration('auto-fold-unfold').get('onDidChangeActiveTextEditor') && !unsupported.includes(editor.document.languageId)) &&
                vscode.window.activeTextEditor
            ) {
                vscode.commands.executeCommand('editor.foldAll').then(
                    () => {},
                    reason => console.warn(reason)
                );
            }
        }),
        vscode.workspace.onWillSaveTextDocument(event => {
            if (vscode.workspace.getConfiguration('auto-fold-unfold').get('onSaved') && !unsupported.includes(event.document.languageId)) {
                vscode.commands.executeCommand('editor.foldAll').then(
                    () => (event.document.isClosed) ? false : true,
                    reason => console.warn(reason)
                );
            }
        }),
        vscode.window.onDidChangeTextEditorSelection(event => {
            if (!unsupported.includes(event.textEditor.document.languageId)) {
                handle();
            }
        })
    );

}

function handle() {
    let doc = vscode.window.activeTextEditor;
    if (!doc) {
        return;
    }

    if (doc.selection.active.compareTo(doc.selection.anchor) !== 0) {
        return;
    }

    let scan = Scanner.scan(
        doc.selection.active.line,
        doc.selection.active.character,
        doc.document
    );

    for (let item of scan) {
        console.time(`How long the scanner ${scan.indexOf(item)} take to do it's job`);
        item.then(
            () => console.timeEnd(`How long the scanner ${scan.indexOf(item)} take to do it's job`),
            reason => console.warn(reason)
        );
    }
}

exports.activate = activate;

function deactivate() {}

module.exports = {
    activate,
    deactivate
};