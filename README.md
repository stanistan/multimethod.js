# multimethods.js

[![Build Status](https://travis-ci.org/stanistan/multimethod.js.svg?branch=master)](https://travis-ci.org/stanistan/multimethod.js)

An implementation of multimethods from Clojure in javascript.

## Installing

Available via npm, functioning correctly as of `v0.0.2` -- before was missing
`amdefine` as an explicit dependency.

```json
"dependencies": {
  "multimethod.js": ">=0.0.2"
}
```

## Usage

```js

// some helpers

var first = function(l) {
  return l[0];
};

var rest = function(l) {
  return l.slice(1);
};

var toList = function(l) {
  return [].slice.call(l);
};

var rotateList = function(l) {
  var l = toList(l);
  return rest(l).concat([first(l)]);
};

// lets assume I have a HOF that I have a function
// that gives me the type of a value
var _ = require('underscore');
var getType = function(toTest) {

  var tests = [
    ['isFunction',  'fn'],
    ['isString',    'str'],
    ['isNumber',    'num'],
    ['isArray',     'arr'],
    ['isObject',    'map'],
    ['isBoolean',   'bool'],
    ['isUndefined', 'undef']
  ];

  for (var i = 0; i < tests.length; i++) {
    if (_[tests[i][0]](toTest)) {
      return tests[i][1];
    }
  }

  throw "No idea what this is";
};

var dispatcher = function() {
  return toList(arguments).map(getType);
};

// we can implement some kind of multiple dispatch
// with this by having HOFs
var multi = require('multimethod.js');

var pl =
  multi(
    dispatcher,
    function() {
      // this will refer to the multimethod
      // we can do recursive dispatch in this way
      return this.apply(
        this,
        rotateList(arguments)
      );
    })
  .add([], function() { return this(0); })
  .add(['num', 'str'], function(num, str) { return num.toString() + str; })
  .add(['num'], function(num) { return this(num, 's'); })
  .add(['arr'], function(arr) { return this(arr[0], arr[1]); })
  .add(['map'], function(map) { return this([map.num, map.string]); })
  .add(['str'], function(str) { return this(0, str); });


// See `spec/indexSpec.js`

pl(1, 's');   // '1s'
pl('s', 1);   // '1s'
pl(1);        // '1s'
pl('s');      // '0s'
pl([1, 's']); // '1s'
pl(['s', 1]); // '1s'

```
