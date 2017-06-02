angular.module('Setlists').
directive('songListEditor', function(
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
      vm.showDeleteIcons  = false;
      vm.showNoteIcons    = false;
      vm.songListsDB      = firebaseFactory.followSongLists();
      vm.songsArray       = firebaseFactory.followSongs();
      vm.songsDB          = firebaseFactory.followSongsObject();
      vm.songsSorted      = [];

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

      // ==========================================================================================

      function _init() {
        var setSelectedSong =
          $scope.$watchCollection(function() {
            return vm.songsArray;
          }, function(newVal) {
            if (newVal && newVal.length) {
              vm.selectedSong = vm.songsArray[0];
              setSelectedSong(); // cancel watcher
            }
          });

        vm.sortableSongs = {
          cursor: 'move',
          placeholder: 'drop-zone',
          update: function() {
            $scope.$evalAsync(function() {
              _updateSongOrder();
            });
          }
        };
      }

      // ==========================================================================================

      function addSelected() {
        vm.editSongListItem.songs[vm.selectedSong.$id] = _.keys(vm.editSongListItem.songs).length;
        _updateDB();
      }

      // ==========================================================================================

      function removeSong(id) {
        var removedIdx = angular.copy(vm.editSongListItem.songs[id]);
        delete vm.editSongListItem.songs[id];
        _.each(vm.editSongListItem.songs, function(order, songId) {
          if (order > removedIdx) {
            vm.editSongListItem.songs[songId]--;
          }
        });
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

      function updateNote() {
        firebaseFactory.updateSongList(vm.editSongListItem).then(
          function() {
            vm.editingNote   = false;
            vm.editingNoteId = undefined;
            vm.showNoteIcons = false;
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
            vm.showNoteIcons = false;
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

      _init();
    },
  };
});
