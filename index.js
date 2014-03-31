
if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function(require) {

  var Dispatch = require('./src/dispatch'),
      _ = require('underscore'),
      apply = require('./src/common').apply;

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
    }

    dispatches = dispatches || [];
    defaultDispatch = defaultDispatch || function() { throw "No default dispatch; "};

    var boundMulti = _.partial(multi, dispatcher, defaultDispatch);

    // the meat
    var fn = function() {
      var args = _.toArray(arguments),
          dispatch = Dispatch.find(dispatches, apply(dispatcher, args));
      return apply(dispatch ? dispatch.exec : defaultDispatch, args);
    };

    fn.add = function(on, exec) {
      return boundMulti(Dispatch.add(dispatches, [on, exec]));
    };

    fn.has = function(on) {
      return !!Dispatch.find(dispatches, on);
    };

    fn.remove = function(on) {
      return boundMulti(Dispatch.reject(dispatches, on));
    };

    return fn;
  };

});
