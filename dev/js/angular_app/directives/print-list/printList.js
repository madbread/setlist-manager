angular.module('Setlists').
directive('printList', function(
  $q,
  $filter,
  cacheFactory,
  firebaseFactory,
  pathsData,
  staticAppData,
  urlParamsFactory) {
  'use strict';

  return {
    restrict: 'E',
    scope: {},
    controllerAs: 'printListVM',
    bindToController: true,
    replace: true,
    templateUrl: [
      pathsData.directives,
      'print-list/printList.html'
    ].join(''),

    controller: function($scope) {
      var vm = this;

      var params   = urlParamsFactory.getAllQueryParamsObject();
      var songHash = {};
      var listHash = {};

      vm.cols = {
        nate: false,
        key: true,
        bass: false,
        length: false,
        mike: false,
        adam: false,
        carl: false,
        mark: false
      };
      vm.bold   = true;
      vm.songs  = [];
      vm.errors = [];
      vm.print  = print;

      var apiCalls = {
        songs: firebaseFactory.readDataOnce('songs'),
        lists: firebaseFactory.readDataOnce('songLists')
      };

      if (params.hasOwnProperty('list')) {
        initData();
      } else {
        vm.errors.push('No List Selected at this address');
      }

      function initData() {
        $q.all(apiCalls)
          .then(function(responses) {
            songHash = responses.songs.val();
            listHash = responses.lists.val();
            if (listHash.hasOwnProperty(params.list)) {
              initDisplay(listHash[params.list]);
            } else {
              vm.errors.push('The selected list does not exist');
            }
          });
      }

      // ======================================================================

      function initDisplay(list) {
        vm.songs = getSongsInList(list.songs);
        vm.title = list.title;
      }

      // ======================================================================

      function getSongsInList(songs) {
        return _.map(songs, function(order, key) {
          var thisSong = songHash[key];
          thisSong.order   = order;
          thisSong.bassist = _.invert(thisSong).Bass;

          // Capitolize bassist name
          thisSong.bassist = _.isString(thisSong.bassist) ?
            thisSong.bassist.capitalize() : '';

          return thisSong;
        });
      }

      // ======================================================================

      function print() {
        window.print();
      }

    },
  };
});
