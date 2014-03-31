
var common = require('../src/common');

var add = function(a, b) {
  return a + b;
};

describe('commons', function() {

  it('can be applied!', function() {
    expect(common.apply(add, [1, 2])).toBe(3);
  });

  it('can invoke', function() {

    var T = function(a) {
      this.a = a;
    };

    T.prototype.add = function(b) {
      return this.a + b;
    };

    var t = new T(1);
    expect(t.add(2)).toBe(3);
    expect(common.invoke('add', 2)(t)).toBe(3);

  });

  it('can append', function() {

    var a = [1, 2, 3];

    expect(a).toEqual([1, 2, 3]);
    expect(common.append(a, 4)).toEqual([1, 2, 3, 4]);
    expect(a).toEqual([1, 2, 3]);
  });

});
