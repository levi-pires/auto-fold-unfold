# Change Log

## 0.4.x

* `auto-fold-unfold.onEdit` was added.
* The code was improved and now behaves smarter when there are square brackets.
* The code is now documented for those interested. You can go to the [master branch](https://github.com/levi-pires/auto-fold-unfold/tree/master/src) to see it.
* I received divine illumination and now we have support for all languages!

## 0.3.x

The 0.3.x version of the extension contains the following improvements:

* Settings were added to increase user control over the extension.
* The bug in comment blocks was resolved and the support to it was reactivated.
* Now the unsupported languages `xml, html and markdown` are truly unsupported, wich means it won't fold the code in languages that are not supported - in case you set `auto-fold-unfold.onDidChangeActiveEditor` or `auto-fold-unfold.onSaved` to `true`.

### Limitations

* This is a under construction version. Please log any issues you find on [GitHub](https://github.com/levi-pires/auto-fold-unfold/issues).
* The support for tag and markdown hasn't been added yet.
* VS Code only executes the unfold command when the cursor is in the blue zone. I'm working on it so please don't open an issue to talk about it.
