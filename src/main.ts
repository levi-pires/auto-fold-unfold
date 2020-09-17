import {
  commands,
  window,
  Range,
  Selection,
  TextEditorRevealType,
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

export default {
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

        for (let level = 7; level > 0; --level) {
          array.push(commands.executeCommand(`editor.foldLevel${level}`));
        }

        array.push(unfold(unfoldModeId));

        window.activeTextEditor!.revealRange(
          new Range(cursorSelection.start, cursorSelection.end),
          TextEditorRevealType.InCenterIfOutsideViewport
        );

        return array;

      case "best":
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

      default:
        window.showErrorMessage(
          `An error occured while handling. Key: ${unfoldModeId}`
        );
        break;
    }
  },
};
