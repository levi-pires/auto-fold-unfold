const vscode = require('vscode');


class ResponseHandler {
    /**
     * @param {boolean} stoped 
     * @param {number} level 
     */
    constructor(stoped, level) {
        this.res = {
            opening: () => {
                let c = vscode.commands.executeCommand('editor.unfold');
                c.then(
                    () => {},
                    reason => console.warn(reason)
                );
            },
            'closing-c': () => {
                //Sessão defeituosa
                /*let c = vscode.commands.executeCommand('editor.fold');
                c.then(
                    () => {},
                    reason => console.warn(reason)
                );*/
            },
            closing: () => {
                if (stoped) {
                    let c = vscode.commands.executeCommand(`editor.foldLevel${level}`);
                    c.then(
                        () => {},
                        reason => console.warn(reason)
                    );

                    let c1 = vscode.commands.executeCommand('editor.unfold');
                    c1.then(
                        () => {},
                        reason => console.warn(reason)
                    );

                    return;
                }

                let i_level = 7;
                for (let i = level; i <= 7; ++i) {
                    let c = vscode.commands.executeCommand(`editor.foldLevel${i_level}`);
                    c.then(
                        () => {},
                        reason => console.warn(reason)
                    );
                    --i_level;
                }
            },
            undefined: () => {}
        };
    }

    /**
     * 
     * @param {string} response
     */
    handle(response) {
        try {
            this.res[response]();
        } catch (err) {
            console.error(err);
        }
    }
}

exports.ResponseHandler = ResponseHandler;