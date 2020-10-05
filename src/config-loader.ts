import { window, workspace, Memento } from "vscode";

function get<T>(item: string, returnOnUndef: T) {
  const pickedUpItem = workspace.getConfiguration("auto-fold-unfold").get(item);

  if (pickedUpItem === undefined) {
    window.showWarningMessage(
      `auto-fold-unfold.${item} was not found. Using default properties.`
    );
    return returnOnUndef;
  }

  return pickedUpItem as T;
}

export async function loadConfig(memento: Memento) {
  try {
    await memento.update(
      "auto-fold-unfold.onEditing",

      get("onEditing", {
        enable: true,
        unfoldMode: "parent",
        foldMode: "fast",
      })
    );

    await memento.update(
      "auto-fold-unfold.onSaved",

      get("onSaved", false)
    );

    await memento.update(
      "auto-fold-unfold.onChange",

      get("onDidChangeActiveTextEditor", false)
    );
  } catch (err) {
    throw err;
  }
}
