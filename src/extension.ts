import {
  window,
  commands,
  workspace,
  ExtensionContext,
  // ViewColumn,
  // Uri,
  TextEditorSelectionChangeKind,
} from "vscode";
import MainConstructor from "./main";
import ConfigLoader from "./config-loader";
// import update from "./update";
// import { readFileSync } from "fs";

export async function activate(context: ExtensionContext) {
  const Main = new MainConstructor();

  const load = window.setStatusBarMessage(
    "$(loading) Auto Fold & Unfold: Activating Extension"
  );

  try {
    await ConfigLoader(context.workspaceState);
  } catch (err) {
    load.dispose();
    window.showErrorMessage("The extension could not be loaded.\n" + err);
    return;
  }

  context.subscriptions.push(
    commands.registerTextEditorCommand("auto-fold-unfold.foldAndClose", () => {
      Main.fold(true);
    }),

    commands.registerTextEditorCommand(
      "auto-fold-unfold.onEditing.togglePause",
      () => Main.pause()
    ),

    commands.registerTextEditorCommand(
      "auto-fold-unfold.onEditing.toggleFreeze",
      () => Main.freeze()
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
      if (!window.activeTextEditor || Main.isPaused) return;

      const onEdit = context.workspaceState.get(
        "auto-fold-unfold.onEditing"
      ) as { enable: boolean; unfoldMode: string; foldMode: string };

      const isLongSelection =
        event.selections[0].active.compareTo(event.selections[0].anchor) != 0;

      const isDerivedFromCommand =
        event.kind == TextEditorSelectionChangeKind.Command;

      if (isDerivedFromCommand || !onEdit.enable || isLongSelection) return;

      Main.handle(onEdit.unfoldMode, onEdit.foldMode, event.selections[0]);
    }),

    workspace.onDidChangeConfiguration(async (event) => {
      if (event.affectsConfiguration("auto-fold-unfold")) {
        const reload = window.setStatusBarMessage(
          "$(loading) Auto Fold & Unfold: Applying Changes"
        );

        try {
          await ConfigLoader(context.workspaceState);
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

// Deactivated for now
/*
update.showUpdate(
  context,
  "The extension was updated",
  ["Show Me", "Don't Show Again"],
  [() => showReleaseNote(context.extensionPath), () => {}]
);
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
*/
