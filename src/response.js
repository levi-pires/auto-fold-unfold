const vscode = require('vscode');

/**
 * @param {boolean} stoped 
 * @param {number} level 
 */
const responseScope = (stoped, level) => {
    return {
        opening: () => {
            return [vscode.commands.executeCommand('editor.unfold')];
        },
        closing: () => {
            let i_level = 7;
            let res = [];
            for (level; level <= 7; ++level) {
                res.push(vscode.commands.executeCommand(`editor.foldLevel${i_level}`));
                --i_level;
            }
            if (stoped) res.push(vscode.commands.executeCommand('editor.unfold'));
            return res;
        },
        undefined: () => undefined
    };
};

class ResponseHandler {
    /**
     * @param {boolean} stoped 
     * @param {number} level 
     * @param {string} response
     * @returns {Thenable<any>[]}
     */
    static handle(stoped, level, response) {
        try {
            return responseScope(stoped, level)[response]();
        } catch (err) {
            throw err;
        }
    }
}

module.exports = ResponseHandler;