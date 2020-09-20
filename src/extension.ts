import {
  window,
  commands,
  workspace,
  ExtensionContext,
  ViewColumn,
  Uri,
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
    [() => showReleaseNote(context.extensionPath), () => {}]
  );

  context.subscriptions.push(
    commands.registerTextEditorCommand(
      "auto-fold-unfold.onEditing.togglePause",
      () => {
        Main.pause();
      }
    ),

    commands.registerTextEditorCommand(
      "auto-fold-unfold.onEditing.toggleFreeze",
      () => {
        Main.freeze();
      }
    ),

    commands.registerTextEditorCommand(
      "auto-fold-unfold.onEditing.toggleBoth",
      () => {
        Main.freeze();
        Main.pause();
      }
    ),

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
        Main.isPaused ||
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
    }),

    window.onDidChangeVisibleTextEditors((editorsArray) => {
      if (editorsArray.length == 0) {
        Main.freezeStatusBarItem.hide();
        Main.pauseStatusBarItem.hide();
      } else {
        if (Main.isFrozen) {
          Main.freezeStatusBarItem.show();
        }
        if (Main.isPaused) {
          Main.pauseStatusBarItem.show();
        }
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

function showReleaseNote(extensionPath: string) {
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
