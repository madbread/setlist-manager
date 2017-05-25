angular.module('Setlists').
directive('gameGrid', function(
  pathsData,
  firebaseAuthFactory,
  firebaseFactory) {
  'use strict';
  return {
    replace: true,
    scope: {},
    controllerAs: 'gridVM',
    bindToController: true,
    templateUrl: [
      pathsData.directives,
      'game-grid/gameGrid.html'
    ].join(''),
    controller: function($scope) {
      var vm = this;
      vm.board      = undefined;
      vm.boardData  = firebaseFactory.getBoardData();
      vm.boardReady = true;
      vm.challenge  = firebaseFactory.followFirebaseRootObject();
      vm.showLogin  = false;
      vm.login      = login;
      vm.logout     = logout;
      vm.messages   = [];
      vm.status     = firebaseAuthFactory.getStatus();
      vm.user       = {
        email: '',
        password: ''
      };

      $scope.$watch(function() {
        return vm.boardData.selected;
      }, function(newVal) {
        if (newVal !== vm.boardData.options[0] && vm.challenge[newVal]) {
          vm.boardReady = false;
          $scope.$applyAsync(function() {
            vm.board = vm.challenge[newVal];
            vm.boardReady = true;
          });
        }
      });

      $scope.$watch(function() {
        return vm.challenge[vm.boardData.selected];
      }, function(newVal) {
        if (newVal) {
          vm.board = newVal;
          vm.gamesPerWeek = firebaseFactory.calculateGamesPerWeek();
        }
      });

      function login() {
        firebaseAuthFactory.login(vm.user.email, vm.user.password)
          .catch(function(error) {
            vm.messages.push(error);
          })
          .finally(function() {
            vm.showLogin = false;
          });
      }

      function logout() {
        firebaseAuthFactory.logout()
          .catch(function(error) {
            vm.messages.push(error);
          });
      }
    }
  };
});
