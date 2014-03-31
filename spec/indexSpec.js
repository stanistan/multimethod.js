
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

});
