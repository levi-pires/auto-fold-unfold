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
  let update: UpdateMetadata | undefined = context.globalState.get(
    "update-meta"
  );

  if (!update) {
    update = {
      lastVersion: "0",
      dontShowAgain: false,
    };
  }

  if (update.dontShowAgain) return;

  const { version } = JSON.parse(
    readFileSync(context.extensionPath + "/package.json").toString()
  ) as { version: string };

  preShowFunction(version, update);

  const versionsDontMatch = version != update.lastVersion;

  if (versionsDontMatch) {
    window.showInformationMessage(message, ...buttons).then((value) => {
      if (!value) return;

      const fun = btFunctions[value];

      if (fun) fun(update!);

      context.globalState.update("update-meta", {
        ...update,
        lastVersion: version,
      });
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
