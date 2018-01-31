angular.module('Setlists').
directive('songViewer', function(
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
    controllerAs: 'songViewVM',
    bindToController: true,
    replace: true,
    templateUrl: [
      pathsData.directives,
      'song-viewer/songViewer.html'
    ].join(''),

    controller: function() {
      var vm = this;
      var params = urlParamsFactory.getAllQueryParamsObject();
      var originalSongs = [];
      var songHash      = {};
      var listHash      = {};

      // vm data
      vm.songs             = [];
      vm.displaySong       = undefined;
      vm.titleFilter       = '';
      vm.blank             = 'No Filter';
      vm.instrumentOptions = [];
      vm.listOptions       = [];
      vm.playerOptions     = staticAppData.playerOptions;
      vm.keyOptions        = staticAppData.key_options;

      vm.keyOptions.unshift(vm.blank);
      vm.key               = vm.keyOptions[0];
      vm.playerOptions.unshift(vm.blank);
      vm.player            = vm.playerOptions[0];

      // vm functions
      vm.selectSong  = selectSong;
      vm.setSonglist = setSonglist;
      vm.randomSong  = randomSong;
      vm.clearAll    = clearAll;
      vm.filter      = filter;

      // firebase data initialiations
      firebaseFactory.readDataOnce('songs')
        .then(function(response) {
          songHash = response.val();
          vm.songs = _.map(response.val());
          originalSongs = angular.copy(vm.songs);
          countSongs();
        });

      // load instrument Options
      firebaseFactory.readDataOnce('instruments')
        .then(function(response) {
          vm.instrumentOptions = _.map(response.val(), 'title');
          vm.instrumentOptions.unshift(vm.blank);
          vm.instrument = vm.instrumentOptions[0];
        });

      // load songlists
      firebaseFactory.readDataOnce('songLists')
        .then(function(response) {
          listHash = response.val();
          vm.listOptions = _.map(response.val());
          vm.listOptions.unshift({title: 'All Songs', songs: {}, notes: {}});
          // If params passed a valid list id, load it and apply filter
          if (listHash.hasOwnProperty(params.list)) {
            vm.list = _.find(vm.listOptions, function(option) {
              return option.title === listHash[params.list].title;
            });
            filter();
          } else {
            vm.list = vm.listOptions[0];
          }
        });

      // ======================================================================

      function getFilteredSongs() {
        var currentSongs = _.keys(vm.list.songs).length ?
          getSongsInList(vm.list.songs) :
          angular.copy(originalSongs);

        currentSongs = $filter('filter')(currentSongs, vm.titleFilter);

        if (vm.instrument !== vm.blank) {
          currentSongs = $filter('filter')(currentSongs, function(song) {
            return song[vm.player] === vm.instrument;
          });
        }
        if (vm.key !== vm.blank) {
          currentSongs = $filter('filter')(currentSongs, function(song) {
            return song.key === vm.key;
          });
        }
        return currentSongs;
      }

      // ======================================================================

      function filter() {
        vm.songs = getFilteredSongs();
        countSongs();
      }

      function getSongsInList(songs) {
        return _.map(songs, function(order, key) {
          return songHash[key];
        });
      }

      function setSonglist() {
        if (_.keys(vm.list.songs).length) {
          filter();
        } else {
          clearAll();
        }
      }

      function clearAll() {
        vm.list        = vm.listOptions[0];
        vm.player      = vm.blank;
        vm.titleFilter = '';
        vm.key         = vm.blank;
        vm.songs       = angular.copy(originalSongs);
        vm.displaySong = undefined;
        countSongs();
      }

      function selectSong(song) {
        vm.displaySong = song;
        vm.selectedId  = song.$$hashKey;
      }

      function randomSong() {
        vm.displaySong = vm.songs[_.random(vm.songs.length - 1)];
        vm.selectedId  = vm.displaySong.$$hashKey;
      }

      function countSongs() {
        vm.count = $filter('filter')(vm.songs, vm.titleFilter).length;
      }

      function resetSongs() {
        vm.songs = angular.copy(originalSongs);
        countSongs();
      }

      // ======================================================================
    },
  };
});
