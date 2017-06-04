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
      var originalSongsDB = vm.songsDB;
      vm.titleFilter = '';
      vm.displaySong = undefined;
      vm.instrumentOptions = [
        '----------',
        'Bass',
        'Banjo',
        'Mandolin',
        'Fiddle',
        'Guitar',
        'Electric',
        'Harmonica'
      ];
      vm.instrument = vm.instrumentOptions[0];
      vm.playerOptions = [
        '----------',
        'nate',
        'mike',
        'adam',
        'carl'
      ];
      vm.player = vm.playerOptions[0];

      // vm functions
      vm.selectSong = selectSong;
      vm.randomSong = randomSong;

      $scope.$watchCollection(function() {
        return vm.songsDB;
      }, function(newVal) {
        countSongs();
      });

      $scope.$watch(function() {
        return vm.titleFilter;
      }, function(newVal) {
        countSongs();
      });

      $scope.$watch(function() {
        return vm.instrument;
      }, function(newVal) {
        countSongs();
        if (newVal && newVal !== '----------') {
          instrumentFilter();
        } else if (newVal && newVal === '----------') {
          vm.songsDB = originalSongsDB;
        }
      });

      $scope.$watch(function() {
        return vm.player;
      }, function(newVal) {
        countSongs();
        if (newVal && newVal === '----------') {
          vm.instrument = '----------';
        } else if (newVal && newVal !== '----------' && vm.instrument !== '----------') {
          instrumentFilter();
        }
      });

      function instrumentFilter() {
        var currentSongs = $filter('filter')(originalSongsDB, vm.titleFilter);
        vm.songsDB = $filter('filter')(currentSongs, function(song) {
          return song[vm.player] === vm.instrument;
        });
      }

      function selectSong(song) {
        vm.displaySong = song;
      }

      function randomSong() {
        vm.displaySong = vm.songsDB[_.random(vm.songsDB.length - 1)];
      }

      function countSongs() {
        vm.count = $filter('filter')(vm.songsDB, vm.titleFilter).length;
      }
    },
  };
});
