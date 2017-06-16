angular.module('Setlists').
directive('songListEditor', function(
  $filter,
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
      var vm = this;

      // vm data
      vm.addingNote       = false;
      vm.editingNote      = false;
      vm.editSongListItem = undefined;
      vm.newSongList      = angular.copy(staticAppData.new_songList);
      vm.showAddSongList  = false;
      vm.showIcons        = false;
      vm.songListsDB      = firebaseFactory.followSongLists();
      vm.songsArray       = firebaseFactory.followSongs();
      vm.songsDB          = firebaseFactory.followSongsObject();
      vm.songsSorted      = [];

      var originalSongsDB = angular.copy(vm.songsArray);

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

      vm.count = 0;

      // vm functions
      vm.addNote           = addNote;
      vm.addSelected       = addSelected;
      vm.addSongList       = addSongList;
      vm.displaySongList   = displaySongList;
      vm.editNote          = editNote;
      vm.removeSong        = removeSong;
      vm.saveNewNote       = saveNewNote;
      vm.toggleAddSongList = toggleAddSongList;
      vm.updateNote        = updateNote;
      vm.deleteList        = deleteList;

      // ==========================================================================================

      function _init() {
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
      // Adds selected song as last one in list

      function addSelected(song) {
        if (_.keys(vm.editSongListItem.songs).indexOf(song.$id) === -1) {
          vm.editSongListItem.songs[song.$id] = _.keys(vm.editSongListItem.songs).length;
          _updateDB();
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

      function displaySongList(songList) {
        vm.editSongListItem = songList;
        if (!vm.editSongListItem.hasOwnProperty('songs')) {
          vm.editSongListItem.songs = {};
        }
        vm.songsSorted = _sortSongs(vm.editSongListItem.songs);
      }

      // ==========================================================================================

      function addSongList() {
        firebaseFactory.addSongList(angular.copy(vm.newSongList));
        vm.newSongList = angular.copy(staticAppData.new_songList);
        vm.showAddSongList = false;
      }

      // ==========================================================================================

      function editNote(songId) {
        vm.editingNote   = true;
        vm.editingNoteId = songId;
      }

      // ==========================================================================================

      function deleteList() {
        if (window.confirm('Are you sure you wish to delete "' + vm.editSongListItem.title + '" ?')) {
          firebaseFactory.deleteSongList(vm.editSongListItem);
          vm.editSongListItem = undefined;
        }
      }

      // ==========================================================================================

      function updateNote() {
        firebaseFactory.updateSongList(vm.editSongListItem).then(
          function() {
            vm.editingNote   = false;
            vm.editingNoteId = undefined;
            vm.showIcons = false;
          }
        );
      }

      // ==========================================================================================

      function addNote(songId) {
        vm.addingNote   = true;
        vm.addingNoteId = songId;
      }

      // ==========================================================================================

      function saveNewNote() {
        if (!vm.editSongListItem.hasOwnProperty('notes')) {
          vm.editSongListItem.notes = {};
        }
        vm.editSongListItem.notes[vm.addingNoteId] = vm.newNoteText;
        firebaseFactory.updateSongList(vm.editSongListItem).then(
          function() {
            vm.addingNote    = false;
            vm.addingNoteId  = undefined;
            vm.newNoteText   = '';
            vm.showIcons = false;
          }
        );
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
        _.each(songsObject, function(order, id) {
          sorted[order] = id;
        });
        return sorted;
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
          vm.songsArray = originalSongsDB;
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
        var currentSongs = $filter('filter')(originalSongsDB, vm.titleFilter);
        if (vm.playerFilter !== vm.blankFilter && vm.instrumentFilter !== vm.blankFilter) {
          vm.songsArray = $filter('filter')(currentSongs, function(song) {
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
        vm.songsArray       = originalSongsDB;
      }

      function countSongs() {
        vm.count = $filter('filter')(vm.songsArray, vm.titleFilter).length;
      }

      // ==========================================================================================
      // ==========================================================================================

      _init();
    },
  };
});
