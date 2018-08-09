Transforms:

```js
const List = () => <ul>{list.map(value => <li>{value}</li>)}</ul>
```

to:

```js
"use strict";

var foo = list.map(function (value, _key) {
  return React.createElement(
    "div",
    {
      key: 'key::' + _key;
    },
    React.createElement(
      "span",
      null,
      value
    )
  );
});


```
