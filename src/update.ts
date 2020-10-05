import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { type } from "os";
import { window, ExtensionContext, Uri, ViewColumn } from "vscode";

type UpdateMetadata = {
  lastVersion: string;
  dontShowAgain: boolean;
};

export function showUpdate(
  context: ExtensionContext,
  message: string,
  buttons: string[],
  btFunctions: { [key: string]: (meta: UpdateMetadata) => void },
  preShowFunction: (version: string, meta: UpdateMetadata) => void = () => {}
) {
  if (!existsSync(context.globalStoragePath)) {
    mkdirSync(context.globalStoragePath);
  }

  const pathToMeta = context.globalStoragePath + "/update-meta.json";

  let update: UpdateMetadata;

  if (!existsSync(pathToMeta)) {
    update = {
      lastVersion: "0",
      dontShowAgain: false,
    };

    writeFileSync(pathToMeta, JSON.stringify(update));
  } else {
    update = JSON.parse(readFileSync(pathToMeta).toString());
  }

  if (update.dontShowAgain) return;

  const { version } = JSON.parse(
    readFileSync(context.extensionPath + "/package.json").toString()
  ) as { version: string };

  const versionsDontMatch = version != update.lastVersion;

  preShowFunction(version, update);

  if (versionsDontMatch) {
    window.showInformationMessage(message, ...buttons).then((value) => {
      if (!value) return;

      const fun = btFunctions[value];

      if (fun) fun(update);

      writeFileSync(
        pathToMeta,
        JSON.stringify({ ...update, lastVersion: version })
      );
    });
  }
}

export function showReleaseNote(extensionPath: string) {
  const panel = window.createWebviewPanel(
    "markdown.preview",
    "Auto Fold & Unfold",
    {
      viewColumn: ViewColumn.One,
      preserveFocus: true,
    }
  );
  panel.iconPath = Uri.file(extensionPath + "/images/afu.png");
  panel.webview.html = readFileSync(extensionPath + "/README.html").toString();
}
