import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { window, ExtensionContext } from "vscode";

function showUpdate(
  context: ExtensionContext,
  message: string,
  buttons: string[],
  btFunction: (() => any)[],
  showAnyway = false
) {
  const path = context.globalStoragePath + "/.update";

  const { version } = JSON.parse(
    readFileSync(context.extensionPath + "/package.json").toString()
  );

  if (!existsSync(context.globalStoragePath)) {
    mkdirSync(context.globalStoragePath);
    writeFileSync(path, "{}");
    return;
  }

  const { lastVersion } = JSON.parse(readFileSync(path).toString());

  const versionsDontMatch = version !== lastVersion;

  if (versionsDontMatch || showAnyway) {
    window.showInformationMessage(message, ...buttons).then((value) => {
      btFunction.forEach((item, index) => {
        if (value == buttons[index]) {
          writeFileSync(path, `{"lastVersion": "${version}"}`);
          item();
        }
      });
    });
  }
}

export default { showUpdate };
