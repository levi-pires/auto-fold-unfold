import { commands, window, Selection, StatusBarAlignment } from "vscode";

async function foldLevels() {
  for (let level = 7; level > 0; --level) {
    commands.executeCommand(`editor.foldLevel${level}`);
  }
}

function unfold(unfoldModeId: string) {
  switch (unfoldModeId) {
    case "family":
      commands.executeCommand("editor.unfoldRecursively");
      break;

    case "parent":
      commands.executeCommand("editor.unfold");
      break;

    default:
      window.showErrorMessage(
        `An error occured while handling. Key: ${unfoldModeId}`
      );
      break;
  }
}

const Main = {
  isPaused: false,

  isFrozen: false,

  pauseStatusBarItem: window.createStatusBarItem(StatusBarAlignment.Right, 0),

  freezeStatusBarItem: window.createStatusBarItem(StatusBarAlignment.Right, 0),

  fold: (close = false) => {
    commands.executeCommand("editor.foldAll").then(
      () => {
        if (close) {
          commands.executeCommand("workbench.action.closeActiveEditor");
        }
      },
      (reason) => console.error(reason)
    );
  },

  /**
   * @param  unfoldModeId must be `parent` or `family`
   * @param  foldModeId must be `fast` or `best`
   * @param  cursorSelection the cursor position before changes
   */
  handle: (
    unfoldModeId: string,
    foldModeId: string,
    selections: Selection[]
  ) => {
    switch (foldModeId) {
      case "fast":
        if (!Main.isFrozen) {
          foldLevels();
        }
        unfold(unfoldModeId);
        break;

      case "best":
        if (!Main.isFrozen) {
          commands.executeCommand("editor.foldRecursively").then(() => {
            foldLevels();

            if (window.activeTextEditor!.selections != selections)
              window.activeTextEditor!.selections = selections;

            unfold(unfoldModeId);
          });
        } else {
          unfold(unfoldModeId);
        }
        break;

      default:
        window.showErrorMessage(
          `An error occured while handling. Key: ${foldModeId}`
        );
        break;
    }
  },

  pause: () => {
    if (Main.isPaused) {
      Main.pauseStatusBarItem.hide();
    } else {
      Main.pauseStatusBarItem.show();
    }
    Main.isPaused = !Main.isPaused;
  },

  freeze: () => {
    if (Main.isFrozen) {
      Main.freezeStatusBarItem.hide();
    } else {
      Main.freezeStatusBarItem.show();
    }

    Main.isFrozen = !Main.isFrozen;
  },
};

Main.pauseStatusBarItem.text = "Paused";
Main.pauseStatusBarItem.tooltip = "Auto Fold & Unfold is paused";
Main.pauseStatusBarItem.command = "auto-fold-unfold.onEditing.togglePause";

Main.freezeStatusBarItem.text = "Frozen";
Main.freezeStatusBarItem.tooltip = "Auto Fold & Unfold is frozen";
Main.freezeStatusBarItem.command = "auto-fold-unfold.onEditing.toggleFreeze";

export default Main;
