angular.module('Setlists').
directive('fireUtil', function(
  firebaseAuthFactory,
  firebaseDataUtilsFactory,
  pathsData) {
  'use strict';

  return {
    restrict: 'E',
    scope: {},
    controllerAs: 'fireUtilVM',
    bindToController: true,
    replace: true,
    templateUrl: [
      pathsData.directives,
      'fire-util/fireUtil.html'
    ].join(''),

    controller: function($scope) {
      var vm = this;

      vm.status   = firebaseAuthFactory.getStatus();
      vm.messages = [];
      vm.data = {};

      vm.source = 'data';
      vm.target = 'data';

      vm.loadDataFromSource = loadDataFromSource;
      vm.copyDataToTarget = copyDataToTarget;

      function loadDataFromSource() {
        firebaseDataUtilsFactory.readDataOnce(vm.source).then(
          function(response) {
            $scope.$applyAsync(function() {
              // debugger;
              vm.data = response.val();
            });
          }
        );
      }

      function copyDataToTarget() {
        firebaseDataUtilsFactory.setData(vm.target, angular.copy(vm.data));
      }
    },
  };
});
