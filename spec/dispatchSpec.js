
var Dispatch = require('../src/dispatch');

describe('da dispatch, yo', function() {

  it('exists', function() {

    var d = Dispatch.fromPair(['foo', function(a) { return a + 1; }]);

    expect(d instanceof Dispatch).toBe(true);
    expect(d.on).toBe('"foo"');
    expect(d.is('foo')).toBe(true);
    expect(d.isNot('foo')).toBe(false);
    expect(d.invoke([1])).toBe(2);
  });

  it('can do equality on more complex types', function() {

    var tests = [
      [1, "1"],
      ["1", '"1"'],
      [[1, 2], "[1,2]"],
      [{a:1}, '{"a":1}']
    ];

    for (var i = 0; i < tests.length; i++) {
      (function(test) {

        var t = Dispatch.fromPair([test[0], null]);
        expect(t.on).toBe(test[1]);
        expect(t.is(test[0])).toBe(true);

      })(tests[i]);
    }


  });

});
