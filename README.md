Transforms:

```js
const List = ({list}) => <ul>{list.map(value => <li>{value}</li>)}</ul>
```

to:

```js
"use strict";

var List = function List(_ref) {
  var list = _ref.list;
  return React.createElement("ul", null, list.map(function (value, _key) {
    return React.createElement("li", {
      key: "key::" + _key
    }, value);
  }));
};
```
