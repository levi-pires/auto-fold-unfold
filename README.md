# Auto Fold & Unfold for VS Code

This extension is under construction. Auto F&U automatically folds and unfolds when the cursor enters or leaves the function.

## How to install

```bash
code --install-extension levipires.auto-fold-unfold
```

or download it from the [Marketplace](https://marketplace.visualstudio.com/items?itemName=levipires.auto-fold-unfold#overview).

## How to use

It's simple! You just need to place the cursor inside a function for it to open. And guess what happens if you leave the function!? Exactly!
It magically closes and puts miles of code under one line. It's a piece of cake.

![AU Demo](https://raw.githubusercontent.com/levi-pires/auto-fold-unfold/master/images/demo.gif)

## Release Notes

The 0.3.0 version of the extension contains the following improvements:

* Settings were added to increase user control over the extension.

* The bug in comment blocks was resolved and the support to it was reactivated.

* Now the unsupported languages `xml, html and markdown` are truly unsupported, wich means it won't fold the code in languages that are not supported - in case you set `auto-fold-unfold.onDidChangeActiveEditor` or `auto-fold-unfold.onSaved` to `true`.

## Settings

```jsonc
{
    //Folds all whenever a file is opened or the active editor changes. This option might reduce productivity.
    "auto-fold-unfold.onDidChangeActiveTextEditor": /*default is false*/,

    //Folds all when the document is saved. For the sake of data integrity the editor might save without firing this event.
    "auto-fold-unfold.onSaved": /*default is false*/
}
```

## Requirements

This extension doesn't have any requirement. But in future releases, IntelliSense will be required.

## Limitations

* This is a under construction version. Please log any issues you find on [GitHub](https://github.com/levi-pires/auto-fold-unfold/issues).

* Support for tag hasn't been added yet.

* VS Code only executes the unfold command when the cursor is in the blue zone. I'm working on it so please don't open an issue to talk about it.

## How to find me

* Email: waltvy.comercial@gmail.com

* [LinkedIn](https://www.linkedin.com/in/levi-pires-5a74331a6)

* [GitHub](https://www.github.com/levi-pires)