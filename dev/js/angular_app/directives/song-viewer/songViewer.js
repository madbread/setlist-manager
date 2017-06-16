angular.module('Setlists').
directive('songViewer', function(
  $filter,
  firebaseFactory,
  pathsData,
  staticAppData) {
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
      vm.displaySong = undefined;
      vm.titleFilter = '';
      vm.blank = 'No Filter';
      vm.instrumentOptions = [
        vm.blank,
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
        vm.blank,
        'nate',
        'mike',
        'adam',
        'carl'
      ];
      vm.player = vm.playerOptions[0];

      vm.keyOptions = staticAppData.key_options;
      vm.keyOptions.unshift(vm.blank);
      vm.key = vm.keyOptions[0];

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
        if (newVal && newVal !== vm.blank) {
          filter();
        } else if (newVal && newVal === vm.blank) {
          vm.songsDB = originalSongsDB;
        }
      });

      $scope.$watch(function() {
        return vm.player;
      }, function(newVal) {
        countSongs();
        if (newVal && newVal === vm.blank) {
          vm.instrument = vm.blank;
        } else if (newVal && newVal !== vm.blank && vm.instrument !== vm.blank) {
          filter();
        }
      });

      $scope.$watch(function() {
        return vm.key;
      }, function(newVal) {
        if (newVal !== vm.blank) {
          countSongs();
          filter();
        }
      });

      function filter() {
        var currentSongs = $filter('filter')(originalSongsDB, vm.titleFilter);
        if (vm.player !== vm.blank && vm.instrument !== vm.blank) {
          vm.songsDB = $filter('filter')(currentSongs, function(song) {
            return song[vm.player] === vm.instrument;
          });
        }
        if (vm.key !== vm.blank) {
          vm.songsDB = $filter('filter')(vm.songsDB, function(song) {
            return song.key === vm.key;
          });
        }
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
