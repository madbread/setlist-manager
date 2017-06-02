angular.module('Setlists').
directive('songViewer', function(
  $filter,
  firebaseFactory,
  pathsData) {
  'use strict';

  return {
    restrict: 'E',
    scope: {},
    controllerAs: 'songViewVM',
    bindToController: true,
    replace: true,
    templateUrl: [
      pathsData.directives,
      'song-viewer/songViewer.html'
    ].join(''),

    controller: function($scope) {
      var vm = this;

      // vm data
      vm.songsDB = firebaseFactory.followSongs();
      vm.titleFilter = '';
      vm.displaySong = undefined;
      vm.obeyFilter = true;

      // vm functions
      vm.selectSong = selectSong;
      vm.randomSong = randomSong;

      var setInitCount = $scope.$watchCollection(function() {
        return vm.songsDB;
      }, function (newVal) {
        if (newVal && newVal.length) {
          countSongs();
          setInitCount();
        }
      });

      $scope.$watch(function() {
        return vm.titleFilter;
      }, function (newVal, oldVal) {
        if (newVal !== undefined && newVal !== null && newVal !== oldVal) {
          countSongs();
        }
      });

      function selectSong(song) {
        vm.displaySong = song;
      }

      function randomSong() {
        var songList = vm.obeyFilter ?
          $filter('filter')(vm.songsDB, vm.titleFilter) : vm.songsDB;
        vm.displaySong = songList[_.random(songList.length - 1)];
      }

      function countSongs() {
        vm.count = $filter('filter')(vm.songsDB, vm.titleFilter).length;
      }
    },
  };
});
