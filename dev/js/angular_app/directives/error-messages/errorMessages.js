angular.module('Setlists').
directive('errorMessages', function(pathsData) {
  'use strict';

  return {
    restrict: 'E',
    scope: {
      messages: '=',
    },
    controllerAs: 'errorMessagesVM',
    bindToController: true,
    replace: true,
    templateUrl: [
      pathsData.directives,
      'error-messages/errorMessages.html'
    ].join(''),

    controller: function($scope) {
      var vm = this;
      vm.dismiss = dismiss;

      $scope.$watchCollection(angular.bind(vm.messages, function() {
        return vm.messages;
      }), function(newVal) {
        vm.messages = _.uniq(newVal);
      });

      function dismiss() {
        vm.messages = [];
      }
    },
  };
});
