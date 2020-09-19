# Change Log

## 0.7.x

- `auto-fold-unfold.onEdit`, `auto-fold-unfold.behaviorOnEdit` and `auto-fold-unfold.modeOnEdit` are deprecated.
  Please take a look at `auto-fold-unfold.onEditing`.
- The way to store data during runtime was changed. `vscode.Memento` is now used.
  Take a look at [extension.js](https://github.com/levi-pires/auto-fold-unfold/tree/master/src)
- A way to warn the user about important changes was added.
- The code was refactored.

## 0.6.x

- The code was refactored in order to keep it updated, clean and agile.
- `auto-fold-unfold.modeOnEdit` was added.

## 0.5.x

- `auto-fold-unfold.behaviorOnEdit` was added.
- `auto-fold-unfold.foldAndClose` was added to compensate for the unwanted behavior of `auto-fold-unfold.onDidChangeActiveTextEditor`.
- The relationship between `auto-fold-unfold.onEdit` and the other features was improved, as well as it's own behavior.

## 0.4.x

- `auto-fold-unfold.onEdit` was added.
- The code was improved and now behaves smarter when there are square brackets.
- The code is now documented for those interested. You can go to the [master branch](https://github.com/levi-pires/auto-fold-unfold/tree/master/src) to see it.
- I received divine illumination and now we have support for all languages!

## 0.3.x

- Settings were added to increase user control over the extension.
- The bug in comment blocks was resolved and the support to it was reactivated.
- Now the unsupported languages `xml, html and markdown` are truly unsupported, wich means it won't fold the code in languages that are not supported - in case you set `auto-fold-unfold.onDidChangeActiveEditor` or `auto-fold-unfold.onSaved` to `true`.
