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

      vm.newSongList       = angular.copy(staticAppData.new_songList);
      vm.songListsDB       = firebaseFactory.followSongLists();
      vm.songsDB           = firebaseFactory.followSongsObject();
      vm.songsArray        = firebaseFactory.followSongs();

      var setSelectedSong =
        $scope.$watchCollection(function() {
          return vm.songsArray;
        }, function(newVal) {
          if (newVal && newVal.length) {
            vm.selectedSong = vm.songsArray[0];
            setSelectedSong(); // cancel watcher
          }
        });

      vm.songsSorted       = [];
      vm.removeSong        = removeSong;
      vm.addSongList       = addSongList;
      vm.toggleAddSongList = toggleAddSongList;
      vm.displaySongList   = displaySongList;
      vm.addSelected       = addSelected;

      vm.editSongListItem  = undefined;
      vm.showAddSongList   = false;

      vm.sortableSongs = {
        cursor: 'move',
        placeholder: 'drop-zone',
        update: function() {
          $scope.$evalAsync(function() {
            _updateSongOrder();
          });
        }
      };

      function addSelected() {
        vm.editSongListItem.songs[vm.selectedSong.$id] = _.keys(vm.editSongListItem.songs).length;
        firebaseFactory.updateSongList(vm.editSongListItem).then(
          function() {
            vm.songsSorted = _sortSongs(vm.editSongListItem.songs);
          }
        );
      }

      function removeSong(id) {
        var removedIdx = angular.copy(vm.editSongListItem.songs[id]);
        delete vm.editSongListItem.songs[id];
        _.each(vm.editSongListItem.songs, function(order, songId) {
          if (order > removedIdx) {
            vm.editSongListItem.songs[songId]--;
          }
        });
        firebaseFactory.updateSongList(vm.editSongListItem).then(
          function() {
            vm.songsSorted = _sortSongs(vm.editSongListItem.songs);
          }
        );
      }

      function toggleAddSongList() {
        vm.showAddSongList = !vm.showAddSongList;
        vm.newSongList = angular.copy(staticAppData.new_songList);
      }

      function displaySongList(songList) {
        vm.editSongListItem = songList;
        if (!vm.editSongListItem.hasOwnProperty('songs')) {
          vm.editSongListItem.songs = {};
        }
        vm.songsSorted = _sortSongs(vm.editSongListItem.songs);
      }

      function addSongList() {
        firebaseFactory.addSongList(angular.copy(vm.newSongList));
        vm.newSongList = angular.copy(staticAppData.new_songList);
        vm.showAddSongList = false;
      }

      function _updateSongOrder() {
        _.each(vm.songsSorted, function(songId, idx) {
          vm.editSongListItem.songs[songId] = idx;
        });
        firebaseFactory.updateSongList(vm.editSongListItem).then(
          function() {
            vm.songsSorted = _sortSongs(vm.editSongListItem.songs);
          }
        );

      }

      function _sortSongs(songsObject) {
        var sorted = [];
        _.each(songsObject, function(order, id) {
          sorted[order] = id;
        });
        return sorted;
      }
    },
  };
});
