//const assert = require('assert');
//<,m
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode = require('vscode');
const path = require('path');
const Scanner = require('../../src/scanner');
// const myExtension = require('../extension');

suite('Extension Test Suite', () => {
    console.log('Start all tests.');
    vscode.workspace.openTextDocument(path.resolve(__dirname, '../../src/response.js')).then(
        doc => testScan(doc),
        reason => reason
    );
    console.log('Running');
    setTimeout(() => { console.log('2000ms has passed'); }, 2000);
});

/**
 * @param {import('vscode').TextDocument} arg
 */
function testScan(arg) {
    let scanRes = [];
    scanRes.push(Scanner.scan(22, 13, arg));
    scanRes.push(Scanner.scan(20, 10, arg));
    if (!scanRes[0]) throw 'Undefined';

    console.log('Applying forEach');

    for (let res of scanRes) {
        if (res instanceof Array) {
            console.log(`${res.toLocaleString()} is an Array`);
            for (let value of res) {
                value.then(
                    value => console.log(value),
                    reason => console.error(reason)
                );
            }
        } else {
            console.log('it is not an Array');
            res.then(
                value => console.log(value),
                reason => console.error(reason)
            );
        }
    }

    console.log('forEach apply successful');
}