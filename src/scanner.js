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
 * @returns {{response: string, level?: number, stoped?: boolean}}
 */
function scanAfter(line, char, document) {
    let levels = 0;

    while (line < document.lineCount) {
        let content = document.lineAt(line).text;

        for (char; char < content.length; ++char) {
            if (isOpening(content[char], [])) {
                return { response: 'closing', level: levels, stoped: true };
            }

            if (isClosing(content[char], '').is) {
                ++levels;
            }
        }

        ++line;
        char = 0;
    }

    return { response: 'closing', level: levels };
}

class Scanner {
    /**
     * @param {number} lineNumber 
     * @param {number} charNumber
     * @param {import("vscode").TextDocument} document 
     * @returns {{response: string, level?: number, stoped?: boolean}}
     */
    static scan(lineNumber, charNumber, document) {
        let lineContent = document.lineAt(lineNumber).text;
        --charNumber;
        for (charNumber; charNumber > -1; --charNumber) {
            let boo = isClosing(lineContent[charNumber], (charNumber !== 0) ? lineContent[charNumber - 1] : '');
            if (boo.is) {
                if (boo.isComment) {
                    return { response: 'closing-c' };
                }

                return scanAfter(lineNumber, charNumber, document);
            }

            let i = [];
            if (charNumber !== 0) i.push(lineContent[charNumber - 1]);
            if (charNumber >= 2) i.push(lineContent[charNumber - 2]);

            if (isOpening(lineContent[charNumber], i)) {
                return { response: 'opening' };
            }
        }

        --lineNumber;
        lineContent = document.lineAt(lineNumber).text;
        charNumber = lineContent.length;
        if (lineNumber === -1) {
            return;
        }
        return this.scan(lineNumber, charNumber, document);
    }
}

exports.Scanner = Scanner;