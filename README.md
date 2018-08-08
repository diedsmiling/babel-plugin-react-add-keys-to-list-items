Transforms:

`
const foo = list.map((item) => <div><span>foo</span></div>)
`

to:

```
"use strict";

var foo = list.map(function (item) {
  return React.createElement(
    "div",
    {
      key: "_4dnya2lxr"
    },
    React.createElement(
      "span",
      null,
      "foo"
    )
  );
});

```
