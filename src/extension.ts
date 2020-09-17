import {
  window,
  commands,
  workspace,
  ExtensionContext,
  ViewColumn,
} from "vscode";
import Main from "./main";
import ConfigLoader from "./config-loader";
import update from "./update";
import { readFileSync } from "fs";

export async function activate(context: ExtensionContext) {
  const load = window.setStatusBarMessage(
    "$(loading) Auto Fold & Unfold: Activating Extension"
  );

  try {
    await ConfigLoader.loadConfig(context.workspaceState);
  } catch (err) {
    load.dispose();
    window.showErrorMessage("The extension could not be loaded.\n" + err);
    return;
  }

  update.showUpdate(
    context,
    "The extension was updated",
    ["Show Me", "Don't Show Again"],
    [
      () => {
        window.createWebviewPanel("markdown.preview", "Auto Fold & Unfold", {
          viewColumn: ViewColumn.One,
          preserveFocus: true,
        }).webview.html = readFileSync(
          context.extensionPath + "/README.html"
        ).toString();
      },
      () => {},
    ]
  );

  context.subscriptions.push(
    window.onDidChangeActiveTextEditor(() => {
      if (
        context.workspaceState.get("auto-fold-unfold.onChange") &&
        window.activeTextEditor
      ) {
        Main.fold();
      }
    }),

    workspace.onWillSaveTextDocument(() => {
      if (context.workspaceState.get("auto-fold-unfold.onSaved")) {
        Main.fold();
      }
    }),

    window.onDidChangeTextEditorSelection((event) => {
      const onEdit = context.workspaceState.get(
        "auto-fold-unfold.onEditing"
      ) as { enable: boolean; unfoldMode: string; foldMode: string };

      if (
        event.kind!.valueOf() == 3 ||
        !onEdit.enable ||
        !window.activeTextEditor ||
        window.activeTextEditor.selection.active.compareTo(
          window.activeTextEditor.selection.anchor
        ) != 0
      ) {
        return;
      }

      setTimeout(
        Main.handle,
        50,
        onEdit.unfoldMode,
        onEdit.foldMode,
        event.textEditor.selection
      );
    }),

    commands.registerTextEditorCommand("auto-fold-unfold.foldAndClose", () => {
      Main.fold(true);
    }),

    workspace.onDidChangeConfiguration(async (event) => {
      if (event.affectsConfiguration("auto-fold-unfold")) {
        const reload = window.setStatusBarMessage(
          "$(loading) Auto Fold & Unfold: Applying Changes"
        );

        try {
          await ConfigLoader.loadConfig(context.workspaceState);
          window.showInformationMessage(
            "All changes have been successfully applied"
          );
        } catch (err) {
          window.showErrorMessage(err);
        }

        reload.dispose();
      }
    })
  );

  load.dispose();
  window.setStatusBarMessage(
    "$(check) Auto Fold & Unfold: The Extension is Active",
    4000
  );
}

export function deactivate() {}
