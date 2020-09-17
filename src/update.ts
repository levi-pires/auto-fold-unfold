import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { window, ExtensionContext } from "vscode";

function showUpdate(
  context: ExtensionContext,
  message: string,
  buttons: string[],
  btFunction: (() => any)[],
  showAnyway = false
) {
  if (!existsSync(context.globalStoragePath)) {
    mkdirSync(context.globalStoragePath);
  }

  const path = context.globalStoragePath + "/.update";
  if (!existsSync(path)) {
    writeFileSync(path, "{}");
  }

  const { version } = JSON.parse(
    readFileSync(context.extensionPath + "/package.json").toString()
  );

  const versionsDontMatch = () => {
    return version !== JSON.parse(readFileSync(path).toString()).lastVersion;
  };

  if (versionsDontMatch() || showAnyway) {
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
