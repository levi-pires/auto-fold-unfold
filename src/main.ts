import {
  commands,
  window,
  Range,
  Selection,
  TextEditorRevealType,
  StatusBarAlignment,
} from "vscode";

function foldLevels() {
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

export default class Main {
  isPaused = false;

  isFrozen = false;

  pauseStatusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 0);

  freezeStatusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 0);

  constructor() {
    this.pauseStatusBarItem.text = "Paused";
    this.pauseStatusBarItem.tooltip = "Auto Fold & Unfold";
    this.pauseStatusBarItem.command = "auto-fold-unfold.onEditing.togglePause";

    this.freezeStatusBarItem.text = "Frozen";
    this.freezeStatusBarItem.tooltip = "Auto Fold & Unfold";
    this.freezeStatusBarItem.command =
      "auto-fold-unfold.onEditing.toggleFreeze";
  }

  fold(close = false) {
    commands.executeCommand("editor.foldAll").then(() => {
      if (close) {
        return commands.executeCommand("workbench.action.closeActiveEditor");
      }
    });
  }

  /**
   * @param  unfoldModeId must be `parent` or `family`
   * @param  foldModeId must be `fast` or `best`
   * @param  cursorSelection the cursor position before changes
   */
  handle(unfoldModeId: string, foldModeId: string, cursorSelection: Selection) {
    switch (foldModeId) {
      case "fast":
        if (!this.isFrozen) {
          foldLevels();
        }

        unfold(unfoldModeId);

        window.activeTextEditor?.revealRange(
          new Range(cursorSelection.start, cursorSelection.end),
          TextEditorRevealType.InCenterIfOutsideViewport
        );
        break;

      case "best":
        if (!this.isFrozen) {
          commands.executeCommand("editor.foldRecursively");

          foldLevels();

          window.activeTextEditor!.selection = cursorSelection;

          unfold(unfoldModeId);

          window.activeTextEditor?.revealRange(
            new Range(cursorSelection.start, cursorSelection.end),
            TextEditorRevealType.InCenterIfOutsideViewport
          );
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
  }

  pause() {
    if (this.isPaused) {
      this.pauseStatusBarItem.hide();
    } else {
      this.pauseStatusBarItem.show();
    }
    this.isPaused = !this.isPaused;
  }

  freeze() {
    if (this.isFrozen) {
      this.freezeStatusBarItem.hide();
    } else {
      this.freezeStatusBarItem.show();
    }

    this.isFrozen = !this.isFrozen;
  }
}
