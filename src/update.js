const fs = require('fs');

/**
 * @param {string}extensionPath
 * @param {string}message
 * @param {string[]}buttons
 * @param {(() => any)[]} btFunction
 */
function showUpdate(extensionPath, message, buttons, btFunction, showAnyway = false) {
    let { version } = JSON.parse(fs.readFileSync(extensionPath + '/package.json').toString());
    if (!fs.existsSync(extensionPath + '/.update')) {
        fs.writeFileSync(extensionPath + '/.update', 'x');
    }
    if (!fs.readFileSync(extensionPath + '/.update')
        .toString()
        .includes(version.slice(0, version.length - 2)) ||
        showAnyway
    ) {
        require('vscode').window.showInformationMessage(message, ...buttons).then(value => {
            btFunction.forEach((item, index) => {
                if (value == buttons[index]) {
                    fs.writeFileSync(extensionPath + '/.update', version);
                    item();
                }
            });
        });
    }
}

module.exports = { showUpdate };