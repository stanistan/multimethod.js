
if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {

  var Dispatch = require('./src/dispatch'),
      _ = require('underscore'),
      apply = require('./src/common').apply;

  var asFunction = function(value) {
    return _.isFunction(value) ? value : (function() { return value; });
  };

  /**
   * @param {Function} dispatcher
   * @param {Function} defaultDispatch (optional)
   * @parmam {Array} dispatches
   *
   * @return {Function}
   */
  return function multi(dispatcher, defaultDispatch, dispatches) {

    if (!_.isFunction(dispatcher)) {
      console.error("Dispatcher must be a function", dispatcher);
      return;
    }

    dispatches = dispatches || [];
    defaultDispatch = defaultDispatch || (function() { throw "No default dispatch; "});

    var boundMulti = _.partial(multi, dispatcher, defaultDispatch);

    // The мясо,
    // Pass in this function as the context so we can do an interesting style
    // of dispatch recursion
    var fn = function multimethod() {
      var args = _.toArray(arguments),
          dispatch = Dispatch.find(dispatches, apply(dispatcher, args));
      return apply(dispatch ? dispatch.exec : defaultDispatch, args, multimethod);
    };

    fn.add = function(on, exec) {
      return boundMulti(Dispatch.add(dispatches, [on, asFunction(exec)]));
    };

    fn.has = function(on) {
      return !!Dispatch.find(dispatches, on);
    };

    fn.dispatches = function() {
      return dispatches;
    };

    fn.remove = function(on) {
      return boundMulti(Dispatch.reject(dispatches, on));
    };

    return fn;
  };

});
