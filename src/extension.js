/**<,m */
const vscode = require('vscode');
const { ResponseHandler } = require('./response');
const { Scanner } = require('./scanner');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(() => (vscode.window.activeTextEditor) ? vscode.commands.executeCommand('editor.foldAll') : {}),
        vscode.window.onDidChangeVisibleTextEditors(() => (vscode.window.activeTextEditor) ? vscode.commands.executeCommand('editor.foldAll') : {}),
        vscode.window.onDidChangeTextEditorSelection(() => handle())
    );

}

function handle() {
    let doc = vscode.window.activeTextEditor;
    if (!doc) {
        return;
    }

    let { response, level, stoped } = Scanner.scan(
        doc.selection.active.line,
        doc.selection.active.character,
        doc.document
    );

    new ResponseHandler(stoped, level).handle(response);
    console.log(`response: ${response}, level: ${level || 0}, stoped: ${stoped || false}`);
}

exports.activate = activate;

function deactivate() {}

module.exports = {
    activate,
    deactivate
};