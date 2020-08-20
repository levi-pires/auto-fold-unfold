const { commands } = require('vscode');

/**
 * This is the core of this file. I chose to use a class because I find it easier to reuse in future versions
 */
class Scanner {
    /**
     * @returns {(string | Thenable<any>)[]} An array containing a key that represents the Thenable
     * and the Thenable itself. The `array.length` will always be equal to or greater than 1
     */
    static scan() {
        let i_level = 7;
        let res = [];
        for (let level = 1; level < 8; ++level) {
            res.push(`fold${i_level}`, commands.executeCommand(`editor.foldLevel${i_level}`));
            --i_level;
        }
        res.push('unfold', commands.executeCommand('editor.unfold'));
        return res;
    }
}

module.exports = Scanner;