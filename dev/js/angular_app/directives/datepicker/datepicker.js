angular.module('Setlists').
directive('datepicker', function(pathsData) {
  'use strict';
  return {
    replace: true,
    restrict: 'E',
    scope: {
      hideIcon: '=',
      date: '='
    },
    controllerAs: 'datepickerVM',
    bindToController: true,
    templateUrl: [
      pathsData.directives,
      'datepicker/datepicker.html'
    ].join(''),
    controller: function() {
      var vm = this;
      if (!vm.date) {
        vm.date = '';
      }
    },
    link: function(scope, elem, attr) {
      var vm = scope.datepickerVM;
      var dateConfig = {
        buttonImage: '/assets/images/icon-cal.svg',
        buttonImageOnly: true,
        buttonText: 'Select date',
        changeMonth: true,
        changeYear: true,
        dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        dateFormat: 'M d, yy',
        nextText: 'Á',
        prevText: 'Â',
        showOn: 'both',
        showButtonPanel: true,
        closeText: 'Close'
      };
      if (vm.hideIcon) {
        dateConfig.buttonImage     = null;
        dateConfig.buttonImageOnly = null;
        dateConfig.buttonText      = null;
        dateConfig.showOn          = 'focus';
      }
      elem.datepicker(dateConfig).keydown(function(e) {
        if (e.keyCode == 8 || e.keyCode == 46) {
          $.datepicker._clearDate(this);
          e.preventDefault();
        }
      });
    }
  };
});
