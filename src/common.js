
if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {

  var _ = require('underscore');

  var apply = function(f, args, context) {
    return f.apply(context || null, args);
  };

  var append = function(l, value) {
    return l.concat([value]);
  };

  var invoke = function(methodName) {
    var args = _.toArray(arguments).slice(1);
    return function(obj) {
      return apply(obj[methodName], args, obj);
    };
  };

  return {
    apply: apply,
    append: append,
    invoke: invoke
  };

});
