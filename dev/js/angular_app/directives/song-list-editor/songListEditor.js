angular.module('Setlists').
directive('songListEditor', function(
  $filter,
  baseUrl,
  firebaseFactory,
  pathsData,
  staticAppData) {
  'use strict';

  return {
    restrict: 'E',
    scope: {},
    controllerAs: 'songListVM',
    bindToController: true,
    replace: true,
    templateUrl: [
      pathsData.directives,
      'song-list-editor/songListEditor.html'
    ].join(''),

    controller: function($scope) {
      var originalSongsDB = [];
      var vm = this;

      // vm data
      vm.colorsPresent     = [];
      vm.editSongListItem  = undefined;
      vm.newSongList       = angular.copy(staticAppData.new_songList);
      vm.showAddSongList   = false;
      vm.showSelectSongs   = false;
      vm.songListsDB       = firebaseFactory.followSongLists();
      vm.songsDB           = firebaseFactory.followSongsObject();
      vm.songsArray        = [];
      vm.songsSorted       = [];
      vm.colorCategory     = '';
      vm.colorCategoryHash = {};
      vm.displayURL        = '';
      vm.printURL          = '';
      vm.cols = {
        nate: false,
        mike: false,
        adam: false,
        carl: false,
        mark: false
      };


      firebaseFactory.followSongs().$loaded()
        .then(function(songs) {
          vm.songsArray   = songs;
          originalSongsDB = angular.copy(vm.songsArray);
          _init();
        });

      // song filtering
      vm.titleFilter       = '';
      vm.blankFilter       = 'No Filter';
      vm.clearSongFilters  = clearSongFilters;

      vm.instrumentOptions = staticAppData.instrumentOptions;
      vm.instrumentOptions.unshift(vm.blankFilter);
      vm.instrumentFilter  = vm.instrumentOptions[0];

      vm.playerOptions     = staticAppData.playerOptions;
      vm.playerOptions.unshift(vm.blankFilter);
      vm.playerFilter      = vm.playerOptions[0];

      vm.keyOptions        = staticAppData.key_options;
      vm.keyOptions.unshift(vm.blankFilter);
      vm.keyFilter         = vm.keyOptions[0];

      vm.highlightOptions = staticAppData.highlightOptions;
      vm.selectedHighlight = vm.highlightOptions[0];

      vm.count = 0;

      // vm functions
      vm.addSelected       = addSelected;
      vm.addSongList       = addSongList;
      vm.displaySongList   = displaySongList;
      vm.removeSong        = removeSong;
      vm.setSongColor      = setSongColor;
      vm.toggleAddSongList = toggleAddSongList;
      vm.deleteList        = deleteList;
      vm.getListURL        = getListURL;
      vm.openSelectSongs   = openSelectSongs;

      // ==========================================================================================

      function _init() {
        vm.songListsDB.unshift({title: 'Select A List:'});
        vm.selectedList = vm.songListsDB[0];
        vm.sortableSongs = {
          cursor: 'move',
          placeholder: 'drop-zone',
          update: function() {
            $scope.$evalAsync(function() {
              _updateSongOrder();
            });
          }
        };

        countSongs();
      }

      // ==========================================================================================

      function openSelectSongs() {
        filter();
        vm.showSelectSongs = true;
      }

      // ==========================================================================================
      // Adds selected song as last one in list

      function addSelected(song) {
        if (_.keys(vm.editSongListItem.songs).indexOf(song.$id) === -1) {
          vm.editSongListItem.songs[song.$id] = _.keys(vm.editSongListItem.songs).length;
          _updateDB();
          vm.songsArray = _.without(vm.songsArray, song);
        } else {
          alert(song.title + ' is already in the setlist.');
        }
      }

      // ==========================================================================================

      function removeSong(id) {
        firebaseFactory.removeSongFromList(id, vm.editSongListItem);
        _updateDB();
      }

      // ==========================================================================================

      function toggleAddSongList() {
        vm.showAddSongList = !vm.showAddSongList;
        vm.newSongList = angular.copy(staticAppData.new_songList);
      }

      // ==========================================================================================

      function displaySongList() {
        if (vm.selectedList.$id) {
          vm.editSongListItem = vm.selectedList;
          if (!vm.editSongListItem.hasOwnProperty('songs')) {
            vm.editSongListItem.songs = {};
          }
          vm.songsSorted = _sortSongs(vm.editSongListItem.songs);
        } else {
          vm.editSongListItem = undefined;
          vm.songsSorted      = [];
        }
        vm.displayURL = '';
        vm.printURL   = '';
      }

      // ==========================================================================================

      function addSongList() {
        firebaseFactory.addSongList(angular.copy(vm.newSongList));
        vm.newSongList = angular.copy(staticAppData.new_songList);
        vm.showAddSongList = false;
      }

      // ==========================================================================================

      function deleteList() {
        if (window.confirm('Are you sure you wish to delete "' + vm.editSongListItem.title + '" ?')) {
          firebaseFactory.deleteSongList(vm.editSongListItem);
          vm.editSongListItem = undefined;
          vm.selectedList = vm.songListsDB[0];
        }
      }

      // ==========================================================================================

      function _updateSongOrder() {
        _.each(vm.songsSorted, function(songId, idx) {
          vm.editSongListItem.songs[songId] = idx;
        });
        _updateDB();
      }

      // ==========================================================================================

      function _updateDB() {
        firebaseFactory.updateSongList(vm.editSongListItem).then(
          function() {
            vm.songsSorted = _sortSongs(vm.editSongListItem.songs);
          }
        );
      }

      // ==========================================================================================

      function _sortSongs(songsObject) {
        var sorted = [];
        vm.colorsPresent = [];
        _.each(songsObject, function(order, id) {
          sorted[order] = id;
          vm.colorsPresent.push(vm.songsDB[id][vm.colorCategory]);
        });
        vm.colorsPresent = _.uniq(vm.colorsPresent);
        return sorted;
      }

      // ==========================================================================================

      function setSongColor(category) {
        vm.colorCategoryHash = category === 'singer' ?
          staticAppData.singerColorHash : staticAppData.instrumentColorHash;
        vm.colorCategory = category;
        _sortSongs(vm.editSongListItem.songs);
      }

      // ==========================================================================================
      // ==========================================================================================
      // FILTERING

      $scope.$watchCollection(function() {
        return vm.songsArray;
      }, function(newVal) {
        countSongs();
      });

      $scope.$watch(function() {
        return vm.titleFilter;
      }, function(newVal) {
        countSongs();
      });

      $scope.$watch(function() {
        return vm.instrumentFilter;
      }, function(newVal) {
        countSongs();
        if (newVal && newVal !== vm.blankFilter) {
          filter();
        } else if (newVal && newVal === vm.blankFilter) {
          vm.songsArray = angular.copy(originalSongsDB);
        }
      });

      $scope.$watch(function() {
        return vm.playerFilter;
      }, function(newVal) {
        countSongs();
        if (newVal && newVal === vm.blankFilter) {
          vm.instrumentFilter = vm.blankFilter;
        } else if (newVal && newVal !== vm.blankFilter && vm.instrumentFilter !== vm.blankFilter) {
          filter();
        }
      });

      $scope.$watch(function() {
        return vm.keyFilter;
      }, function(newVal) {
        if (newVal !== vm.blankFilter) {
          countSongs();
          filter();
        }
      });

      function filter() {
        var currentSongs = vm.titleFilter.length ?
          $filter('filter')(originalSongsDB, vm.titleFilter) : angular.copy(originalSongsDB);
        currentSongs = _.map(currentSongs, function(song) {
          if (vm.songsSorted.indexOf(song.$id) === -1) {
            return song;
          }
        });
        vm.songsArray = _.without(currentSongs, undefined);
        if (vm.playerFilter !== vm.blankFilter && vm.instrumentFilter !== vm.blankFilter) {
          vm.songsArray = $filter('filter')(vm.songsArray, function(song) {
            return song[vm.playerFilter] === vm.instrumentFilter;
          });
        }
        if (vm.keyFilter !== vm.blankFilter) {
          vm.songsArray = $filter('filter')(vm.songsArray, function(song) {
            return song.key === vm.keyFilter;
          });
        }
      }

      function clearSongFilters() {
        vm.titleFilter      = '';
        vm.instrumentFilter = vm.instrumentOptions[0];
        vm.playerFilter     = vm.playerOptions[0];
        vm.keyFilter        = vm.keyOptions[0];
        vm.songsArray       = angular.copy(originalSongsDB);
      }

      function countSongs() {
        vm.count = $filter('filter')(vm.songsArray, vm.titleFilter).length;
      }

      // ==========================================================================================

      function getListURL() {
        // var baseUrl   = 'https://madbread.github.io/setlist-manager/app/';
        var songsPage = 'songs.html';
        var printPage = 'print.html';
        var params    = '?list=' + vm.editSongListItem.$id;
        vm.displayURL = baseUrl + songsPage + params;
        vm.printURL   = baseUrl + printPage + params;
      }

      // ==========================================================================================

    },
  };
});
