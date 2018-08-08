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
      key: '_' + Math.random().toString(36).substr(2, 9);
    },
    React.createElement(
      "span",
      null,
      "foo"
    )
  );
});


```
