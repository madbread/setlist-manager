describe("datepicker Unit Tests > ", function() {

  var scope, element;

  beforeEach(module('templates'));
  beforeEach(module('Setlists'));
  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

  // The Directive HTML to test
  var htmlElement = '<datepicker' +
                      ' field="formField.field"' +
                      ' post-data="formField.postData"' +
                    '></datepicker>';

  it("Should render a jQuery datepicker UI input", function() {
    inject(function($compile, $rootScope) {

      scope.formField = {
        field: {
          required: false,
          entity_field_name: 'start_date'
        },
        postData: {
          start_date: ''
        }
      };

      element = $compile(htmlElement)(scope);
      $rootScope.$digest();

      expect(element.hasClass('hasDatepicker')).toBeTruthy();

    });
  });


});
