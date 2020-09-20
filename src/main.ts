import {
  commands,
  window,
  Range,
  Selection,
  TextEditorRevealType,
  StatusBarAlignment,
} from "vscode";

function unfold(unfoldModeId: string) {
  switch (unfoldModeId) {
    case "family":
      return commands.executeCommand("editor.unfoldRecursively");

    case "parent":
      return commands.executeCommand("editor.unfold");

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

  fold: (close = false): Thenable<any> => {
    return commands.executeCommand("editor.foldAll").then(
      () => {
        if (close) {
          return commands.executeCommand("workbench.action.closeActiveEditor");
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
    cursorSelection: Selection
  ) => {
    switch (foldModeId) {
      case "fast":
        let array = [];

        if (!Main.isFrozen) {
          for (let level = 7; level > 0; --level) {
            array.push(commands.executeCommand(`editor.foldLevel${level}`));
          }
        }

        array.push(unfold(unfoldModeId));

        window.activeTextEditor!.revealRange(
          new Range(cursorSelection.start, cursorSelection.end),
          TextEditorRevealType.InCenterIfOutsideViewport
        );

        return array;

      case "best":
        if (!Main.isFrozen) {
          return [
            commands.executeCommand("editor.foldAll").then(() => {
              window.activeTextEditor!.selection = cursorSelection;

              window.activeTextEditor!.revealRange(
                new Range(cursorSelection.start, cursorSelection.end),
                TextEditorRevealType.InCenterIfOutsideViewport
              );

              return unfold(unfoldModeId);
            }),
          ];
        } else {
          return [unfold(unfoldModeId)];
        }

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
Main.pauseStatusBarItem.command = "auto-fold-unfold.pause";

Main.freezeStatusBarItem.text = "Frozen";
Main.freezeStatusBarItem.tooltip = "Auto Fold & Unfold is frozen";
Main.freezeStatusBarItem.command = "auto-fold-unfold.freeze";

export default Main;
