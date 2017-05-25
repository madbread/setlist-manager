/**
*  This factory provides a common way for
*    directives to store API response data
*    for further calls on the page
*/
angular.module('Setlists').
factory('cacheFactory', function() {

  var pageCache = {},
      methods   = {},
      available = _storageAvailable();

  // Store value to cache and localstorage
  methods.set = function(key, value) {
    if (_.isString(key)) {
      pageCache[key] = value;
      if (!_.isString(value)) {
        value = angular.toJson(value);
      }
      if (available) {
        localStorage.setItem(key, value);
      }
    }
  };

  methods.get = function(key) {
    if (available && localStorage.getItem(key)) {
      return angular.fromJson(localStorage.getItem(key));
    } else if (pageCache[key]) {
      return pageCache[key];
    } else {
      return null;
    }
  };

  methods.getHash = function() {
    return pageCache;
  };

  methods.clearLocalStorage = function() {
    pageCache = {};
    if (available) {
      localStorage.clear();
    }
  };

  // helper methods
  function _storageAvailable() {
    try {
      var x = 'storage_test';
      localStorage.setItem(x, x);
      localStorage.removeItem(x);
      return true;
    }
    catch (e) {
      return false;
    }
  }

  return methods;
});
