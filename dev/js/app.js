angular.module('Setlists', [
  'firebase',
  'ngSanitize',
  'ngCookies',
  'ui.sortable'
])
.config(function($compileProvider) {
  var config = {
    apiKey: 'AIzaSyCQeCmX7ouzkQGwXDWqGHaKwXHZg6yZjgQ',
    authDomain: 'madbread-setlists.firebaseapp.com',
    databaseURL: 'https://madbread-setlists.firebaseio.com',
    projectId: 'madbread-setlists',
    storageBucket: 'madbread-setlists.appspot.com',
    messagingSenderId: '659663875433'
  };
  firebase.initializeApp(config);

  /**
   *  NOTE: preAssignedBindings will be deprecated in a
   *        future angular 1.x release. Will need to
   *        use $ngOnInit in all directives to initialize.
   *
   *        Details: https://code.angularjs.org/1.6.1/docs/guide/migration#commit-bcd0d4
   **/
  $compileProvider.preAssignBindingsEnabled(true);
});
