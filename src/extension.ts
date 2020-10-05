import {
  window,
  commands,
  workspace,
  ExtensionContext,
  TextEditorSelectionChangeKind,
} from "vscode";
import Main from "./main";
import * as ConfigLoader from "./config-loader";
import * as Update from "./update";

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

  Update.showUpdate(
    context,
    "The extension was updated",
    ["Show Me", "Don't Show Again", "Never Show This Again"],
    {
      "Show Me": () => Update.showReleaseNote(context.extensionPath),
      "Never Show This Again": (meta) => {
        meta.dontShowAgain = true;
      },
    }
  );

  context.subscriptions.push(
    commands.registerTextEditorCommand(
      "auto-fold-unfold.onEditing.togglePause",
      Main.pause
    ),

    commands.registerTextEditorCommand(
      "auto-fold-unfold.onEditing.toggleFreeze",
      Main.freeze
    ),

    commands.registerTextEditorCommand(
      "auto-fold-unfold.onEditing.toggleBoth",
      () => {
        Main.freeze();
        Main.pause();
      }
    ),

    commands.registerTextEditorCommand("auto-fold-unfold.foldAndClose", () => {
      Main.fold(true);
    }),

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

      const isDerivedFromUserCommand =
        event.kind == TextEditorSelectionChangeKind.Command;

      const filteredSelections = event.selections.filter(
        (item) => item.active.compareTo(item.anchor) != 0
      );

      const isLongSelection = filteredSelections.length > 0;

      if (isDerivedFromUserCommand || !onEdit.enable || isLongSelection) return;

      Main.handle(
        onEdit.unfoldMode,
        onEdit.foldMode,
        event.textEditor.selections
      );
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
