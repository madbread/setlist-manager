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
      var vm = this;

      vm.status          = firebaseAuthFactory.getStatus();
      vm.challenge       = firebaseFactory.followFirebaseRootObject();
      vm.showLogin       = false;
      vm.showRegister    = false;
      vm.showUpdateEmail = false;
      vm.messages        = [];
      vm.user            = {};
      _resetUser();

      vm.updateTimes  = updateTimes;
      vm.updateEmail  = updateEmail;
      vm.registerUser = registerUser;
      vm.login        = login;
      vm.logout       = logout;

      vm.updateCompletionDate = updateCompletionDate;
      vm.setCompletionDate = setCompletionDate;
      vm.boardData    = firebaseFactory.getBoardData();

      $scope.$watch(function() {
        return vm.boardData.selected;
      }, function() {
        setCompletionDate();
      });

      function updateCompletionDate() {
        if (!vm.challenge.data.completion) {
          vm.challenge.data.completion = {};
        }
        vm.challenge.data.completion[vm.boardData.selected] = vm.completionDate;
        firebaseFactory.saveData();
      }

      function setCompletionDate() {
        if (vm.challenge &&
            vm.challenge.data &&
            vm.challenge.data.completion &&
            vm.challenge.data.completion[vm.boardData.selected]) {
          vm.completionDate = vm.challenge.data.completion[vm.boardData.selected];
        }
      }

      function _resetUser() {
        vm.user.email = '';
        vm.user.password = '';
      }

      function updateTimes() {
        vm.challenge.data.times = parseInt(vm.challenge.data.times);
        firebaseFactory.saveData();
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
