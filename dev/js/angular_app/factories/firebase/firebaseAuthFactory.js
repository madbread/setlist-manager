angular.module('Setlists').
factory('firebaseAuthFactory', function($firebaseAuth) {
  var methods = {};
  var firebaseAuthObject = $firebaseAuth();
  var status = {
    authorized: false,
    email: ''
  };

  firebaseAuthObject.$onAuthStateChanged(function(user) {
    if (user) {
      console.log(' ** USER is authorized **');
      status.authorized = true;
      status.email = user.email;
    } else {
      console.log(' ** USER Signed out **');
      status.authorized = false;
      status.email = '';
    }
  });

  // Public Methods
  // ==============================================================================================
  methods.getStatus = function() {
    return status;
  };

  methods.login = function(email, password) {
    return firebaseAuthObject.$signInWithEmailAndPassword(email, password);
  };

  methods.logout = function() {
    return firebaseAuthObject.$signOut();
  };

  methods.registerUser = function(email, password) {
    return firebaseAuthObject.$createUserWithEmailAndPassword(email, password);
  };

  methods.updateEmail = function(email) {
    return firebaseAuthObject.$sendPasswordResetEmail(email);
  };

  return methods;
});
