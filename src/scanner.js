const ResponseHandler = require("./response");

/**
 * 
 * @param {string} arg 
 * @param {string} previous
 * @returns {{is: boolean, isComment?: boolean}}
 */
function isClosing(arg, previous) {
    if (arg === '/' && previous === '*') {
        return { is: true, isComment: true };
    }


    if (arg === '}') {
        return { is: true, isComment: false };
    }

    return { is: false };
}

/**
 * 
 * @param {string} arg 
 * @param {string[]} previous 
 */
function isOpening(arg, previous) {
    if ((arg === '*' && previous.includes('/')) || (arg === '*' && (previous.includes('/') && previous.includes('*')))) {
        return true;
    }

    if (arg === '{') {
        return true;
    }

    return false;
}

/**
 * 
 * @param {number} line 
 * @param {number} char
 * @param {import("vscode").TextDocument} document 
 * @param {boolean} isComment
 */
function scanAfter(line, char, document, isComment) {
    let levels = 0;

    while (line < document.lineCount) {
        let content = document.lineAt(line).text;

        for (char; char < content.length; ++char) {
            if (isOpening(content[char], [])) {
                return ResponseHandler.handle(true, (isComment) ? ++levels : levels, 'closing');
            }

            if (isClosing(content[char], '').is) {
                ++levels;
            }
        }

        ++line;
        char = 0;
    }

    if (isComment) ++levels;
    return ResponseHandler.handle(false, levels, 'closing');
}

class Scanner {
    /**
     * @param {number} line 
     * @param {number} char
     * @param {import("vscode").TextDocument} document 
     * @returns {Thenable<any>[]}
     */
    static scan(line, char, document) {
        let content = document.lineAt(line).text;

        --char;

        for (char; char > -1; --char) {
            let close = isClosing(content[char], (char !== 0) ? content[char - 1] : '');
            if (close.is) {
                return scanAfter(line, char, document, close.isComment);
            }

            let i = [];
            if (char !== 0) i.push(content[char - 1]);
            if (char >= 2) i.push(content[char - 2]);

            if (isOpening(content[char], i)) {
                return ResponseHandler.handle(false, 0, 'opening');
            }
        }

        --line;

        content = document.lineAt(line).text;

        char = content.length;

        if (line === -1) {
            return ResponseHandler.handle(false, 0, undefined);
        }

        return this.scan(line, char, document);
    }
}

module.exports = Scanner;