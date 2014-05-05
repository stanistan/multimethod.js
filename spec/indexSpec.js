
var multi = require('../index'),
    _ = require('underscore'),
    c = require('../src/common');

describe('multimethods', function() {

  var firstArg = function(a) {
    return a;
  };

  var onRestArgs = function(f) {
    return function() {
      return f.apply(null, _.toArray(arguments).slice(1));
      // return c.apply(f, _.toArray(arguments).slice(1));
    };
  };

  var inc = function(a) {
    return a + 1;
  };

  var sum = function() {
    return _.toArray(arguments).reduce(function(a, b) {
      return a + b;
    });
  };

  var getKey = function(k, o) {
    return o[k];
  };

  var getKeys = function(ks, o) {
    return ks.map(function(k) {
      return getKey(k, o);
    });
  };

  it('can dispatch on first argument', function() {

    var a = multi(firstArg)
      .add('inc', onRestArgs(inc))
      .add('sum', onRestArgs(sum))
      .add('str', function() {
        return _.toArray(arguments).toString();
      });

    expect(a('inc', 1)).toEqual(2);
    expect(a('sum', 1, 2)).toEqual(3);
    expect(a('str', 'a', ' ', 'b')).toEqual('str,a, ,b');
  });

  it('works for multiple args', function() {

    var m = multi(_.partial(getKeys, ['a', 'b']), function(_) { return 'FOO'; })
      .add([1, 2], function(o) { return o.c; })
      .add([1, 3], function(o) { return o.c - 1; });

    expect(m({})).toEqual('FOO');
    expect(m({a: 1, b: 2})).toEqual(undefined);
    expect(m({a: 1, b: 2, c: 3})).toEqual(3);
    expect(m({a: 1, b: 3, c: 3})).toEqual(2);
  });

  it('can be fancy type based dispatch, kind of', function() {

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

    // weird flexible pluralize
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

    expect(pl('s')).toEqual('0s');
    expect(pl(1)).toEqual('1s');
    expect(pl([1, 'something'])).toEqual(pl('something', 1));
    expect(pl({num: 10, string: 'asdf'})).toEqual(pl(10, 'asdf'));
    expect(pl({string: 10, num: 'asdf'})).toEqual(pl(10, 'asdf'));
    expect(pl()).toEqual('0s');

  });

});
