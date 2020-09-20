# Auto Fold & Unfold for VS Code v0.8.1

This extension is under construction. Auto F&U automatically folds and unfolds when the cursor enters or leaves the function.

## How to install

```bash
code --install-extension levipires.auto-fold-unfold
```

or download it from the [Marketplace](https://marketplace.visualstudio.com/items?itemName=levipires.auto-fold-unfold#overview).

## How to use

It's simple! You just need to place the cursor inside a function for it to open. And guess what happens if you leave the function!? Exactly!
It magically closes and puts miles of code under one line. It's a piece of cake.

And now, if you are using version 0.4.0 or higher, you can use this same magic when saving, when opening a file and when changing between files. It's all an option.

![AU Demo](https://raw.githubusercontent.com/levi-pires/auto-fold-unfold/master/images/demo.gif)

## Release Notes

The 0.8.x version of the extension contains the following improvements:

### 0.8.0

- `auto-fold-unfold.freeze` and `auto-fold-unfold.pause` were added. Take a look at [Commands](#commands)
- The keybindings to `auto-fold-unfold.freeze` and `auto-fold-unfold.pause` were changed. Take a look at [Commands](#commands)

### 0.8.1

- For more intuitiveness, the names of the commands were changed
- `auto-fold-unfold.onEditing.toggleBoth` was added
- Due to overlapping keybindings, the default keybindings were changed

## Settings

```javascript
{
  /**
   * These settings can be configured in the user, remote, workspace or folder settings.
   *
   * @deprecated
   * auto-fold-unfold.onEdit
   * auto-fold-unfold.behaviorOnEdit
   * auto-fold-unfold.modeOnEdit
   * @deprecated
   */

  /**
   * Folding and unfolding while editing.
   */
  "auto-fold-unfold.onEditing": {
    /**
     * You can disable this feature in case you don't like it.
     */
    "enable": true,

    /**
     * Defines fold behavior while editing.
     * If "fast", this extension will do it's job in milliseconds,
     * but the folding will be limited to the first 7 levels.
     * If "best", performance will be dictated by the level you are entering
     * and the power of your computer, but you will experience unlimited folding.
     * I advise you to use the "best" setting only if your code is a tangle of objects
     * containing a 45 generation family.
     */
    "foldMode": "fast",

    /**
     * Defines unfold behavior while editing.
     * If "parent", only the block where the cursor is will be unfolded.
     * If "family", the block where the cursor is and it's children will be unfolded.
     */
    "unfoldMode": "parent"
  },

  /**
   * Folds all whenever a file is opened or the active editor changes.
   * This option might reduce productivity.
   */
  "auto-fold-unfold.onDidChangeActiveTextEditor": false,

  /**
   * Folds all when the document is saved.
   * For the sake of data integrity the editor might save without firing this event.
   */
  "auto-fold-unfold.onSaved": false
}
```

## Commands

| Command                                 | Keybinding    | Description                                                                                                             |
| --------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------- |
| auto-fold-unfold.foldAndClose           | ctrl+shift+/  | Folds the code and closes the editor. This command is an alternative to `auto-fold-unfold.onDidChangeActiveTextEditor`. |
| auto-fold-unfold.onEditing.toggleFreeze | ctrl+; f      | Freezes the folding functionality while Editing                                                                         |
| auto-fold-unfold.onEditing.togglePause  | ctrl+; p      | Pauses the folding functionality while editing                                                                          |
| auto-fold-unfold.onEditing.toggleBoth   | ctrl+; ctrl+; | Freezes and pauses the folding functionality while editing                                                              |

## Requirements

This extension doesn't have any requirement.

## Limitations

This is a under construction version. Please log any issues you find on [GitHub](https://github.com/levi-pires/auto-fold-unfold/issues).

## Did you like it?

[Give me five stars](https://marketplace.visualstudio.com/items?itemName=levipires.auto-fold-unfold&ssr=false#review-details)

## How to find me

- Email: waltvy.comercial@gmail.com

- [LinkedIn](https://www.linkedin.com/in/levi-pires-5a74331a6)

- [GitHub](https://www.github.com/levi-pires)
