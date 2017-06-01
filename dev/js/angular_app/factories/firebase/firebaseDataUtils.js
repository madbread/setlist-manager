angular.module('Setlists').
factory('firebaseDataUtilsFactory', function() {
  var db = firebase.database();
  var methods = {};

  // Public Methods
  // ==============================================================================================
  methods.setData = function(location, object) {
    if (_.isString(location) &&
        (location !== '' || window.confirm('You are about to overwrite all data. Proceed?'))) {
      if (_.isObject(object)) {
        db.ref('data/' + location).set(object);
      } else {
        db.ref('data/' + location).set({
          data: object
        });
      }
    }
  };

  methods.readDataOnce = function(location) {
    if (location) {
      return db.ref(location).once('value');
    } else {
      return db.ref().once('value');
    }
  };

  return methods;
});
