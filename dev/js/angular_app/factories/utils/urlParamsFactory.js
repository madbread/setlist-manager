/**
 *  This factory is used to get/set URL params and strings
 **/
angular.module('Setlists').
factory('urlParamsFactory', function() {
  var methods   = {};
  var urlParams = {}; // store params after first check

  // get value of variable from URL string
  methods.getQueryVariable = function(variable) {
    if (_.isEmpty(urlParams)) {
      methods.getAllQueryParamsObject();
    }
    return urlParams[variable] || false;
  };

  methods.getAllQueryParamsObject = function() {
    if (_.isEmpty(urlParams)) {
      var query  = window.location.search.substring(1),
          vars   = query.split('&'),
          params = {};
      _.each(vars, function(item) {
        if (item.length) {
          var pair = item.split('=');
          params[pair[0]] = decodeURIComponent(pair[1]);
        }
      });
      urlParams = params;
    }
    return urlParams;
  };

  methods.getURLParamsFromObject = function(data) {
    // remove keys with undefined or null data
    data = _.omit(data, _.filter(_.keys(data), function(key) {
      return _.isUndefined(data[key]) || _.isNull(data[key]);
    }));
    return jQuery.param(data);
  };

  /**
  *   Accept a location string and an array of
  *     paramaters: ['key=value', 'key2=value2', ...]
  *
  *   Return an encoded URL string
  **/
  methods.sanitize = function(location, params) {
    var sanitizedURL  = '',
        encodedParams = [],
        urlParams;
    if (params !== undefined && Array.isArray(params)) {
      var equalsCount;
      _.each(params, function(param) {
        // Ensure there is exactly one '=' in each param
        equalsCount = param.split('=').length - 1;

        if (equalsCount === 1 &&
            _.indexOf(param, '&') === -1 &&
            _.indexOf(param, '?') === -1) {
          encodedParams.push(encodeURI(param));
        }
      });
      urlParams = '?' + encodedParams.join('&');
    } else {
      urlParams = '';
    }
    sanitizedURL = location + urlParams;
    return sanitizedURL;
  };

  return methods;
});
