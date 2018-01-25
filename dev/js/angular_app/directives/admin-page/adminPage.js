angular.module('Setlists').
directive('adminPage', function(
  firebaseAuthFactory,
  firebaseFactory,
  pathsData) {
  'use strict';

  return {
    restrict: 'E',
    scope: {},
    controllerAs: 'adminVM',
    bindToController: true,
    replace: true,
    templateUrl: [
      pathsData.directives,
      'admin-page/adminPage.html'
    ].join(''),

    controller: function($scope) {
      $(document).tooltip();
      var vm = this;

      vm.openSection = 'Songs';

      vm.status          = firebaseAuthFactory.getStatus();
      vm.showLogin       = false;
      vm.showRegister    = false;
      vm.showUpdateEmail = false;
      vm.newInstrument   = '';
      vm.messages        = [];
      vm.user            = {};
      _resetUser();

      vm.showSonglistEditor = false;
      vm.showSongEditor     = true;
      vm.showUserActions    = false;

      vm.updateEmail   = updateEmail;
      vm.addInstrument = addInstrument;
      vm.registerUser  = registerUser;
      vm.login         = login;
      vm.logout        = logout;
      vm.populate      = firebaseFactory.populate;

      function addInstrument() {
        firebaseFactory.addInstrument({title: angular.copy(vm.newInstrument)});
        vm.newInstrument = '';
      }

      function _resetUser() {
        vm.user.email = '';
        vm.user.password = '';
      }

      function updateEmail() {
        firebaseAuthFactory.updateEmail(vm.user.email, vm.user.password)
          .then(function() {
            vm.messages.push('Password Update Email Sent!');
          })
          .catch(function(error) {
            vm.messages.push(error);
          })
          .finally(function() {
            vm.showUpdateEmail = false;
            _resetUser();
          });
      }

      function login() {
        firebaseAuthFactory.login(vm.user.email, vm.user.password)
          .catch(function(error) {
            vm.messages.push(error);
          })
          .finally(function() {
            vm.showLogin = false;
            _resetUser();
          });
      }

      function logout() {
        firebaseAuthFactory.logout()
          .catch(function(error) {
            vm.messages.push(error);
          });
      }

      function registerUser() {
        firebaseAuthFactory.registerUser(vm.user.email, vm.user.password)
        .then(function(user) {
          vm.messages.push('created new user ', user.email);
        })
        .catch(function(error) {
          vm.messages.push(error);
        })
        .finally(function() {
          vm.showRegister = false;
          _resetUser();
        });
      }
    },
  };
});
