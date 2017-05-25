/**
 *   Helper methods for manipuating data structures missing from _
 **/
angular.module('Setlists').
factory('dataUtilFactory', function() {
  var methods = {};

  methods.sortObjectByKey = function(object) {
    var temp = {};
    _.each(_.keys(object).sort(), function(typeKey) {
      temp[typeKey] = object[typeKey];
    });
    return temp;
  };

  methods.stringReplace = function(string, oldChars, newChars) {
    if (_.isString(string)) {
      return string.split(oldChars).join(newChars);
    } else {
      return null;
    }
  };

  methods.removeNullUndefinedKeys = function(obj) {
    _.each(obj, function(v, k) {
      if (v === undefined || v === null) {
        delete obj[k];
      }
    });
    return obj;
  };

  return methods;
});
