angular.module('Setlists').
directive('venueEditor', function(
  cacheFactory,
  firebaseFactory,
  pathsData) {
  'use strict';
  return {
    restrict: 'E',
    scope: {},
    controllerAs: 'printVM',
    bindToController: true,
    replace: true,
    templateUrl: [
      pathsData.directives,
      'print/print.html'
    ].join(''),
    controller: function($scope) {
      var vm = this;

      // vm data
      vm.songListsObject  = firebaseFactory.followSongListsObject();
      vm.selectedLists    = [];
      vm.sortableSetlists = {
        cursor: 'move',
        placeholder: 'drop-zone'
      };

      vm.songsObject = firebaseFactory.followSongsObject();
      vm.songListsArray = [];
      vm.viewSongs = false;

      vm.sortedViewList = [];

      // vm functions
      vm.addSelected = addSelected;
      vm.removeList  = removeList;
      vm.showSongs   = showSongs;

      // ==========================================================================================

      function _init() {
        $scope.$evalAsync(function() {
          if (cacheFactory.get('printlist')) {
            vm.selectedLists = cacheFactory.get('printlist');
          }

          vm.songListsArray = firebaseFactory.followSongLists();
        });
      }

      // ==========================================================================================

      function addSelected(songList) {
        if (vm.selectedLists.indexOf(songList.$id) === -1) {
          vm.selectedLists.push(songList.$id);
          songList.selected = true;
          cacheFactory.set('printlist', vm.selectedLists);
        } else {
          alert(songList.title + ' is already selected.');
        }
      }

      // ==========================================================================================

      $scope.$watchCollection(function() {
        return vm.songListsArray;
      }, function(newVal) {
        if (newVal.length) {
          _.each(vm.songListsArray, function(songList) {
            songList.selected =
              vm.selectedLists.indexOf(songList.$id) > -1 ?
                true : false;
          });
        }
      });

      // ==========================================================================================

      function removeList(id) {
        vm.selectedLists = _.without(vm.selectedLists, id);
        cacheFactory.set('printlist', vm.selectedLists);
        var selected = _.find(vm.songListsArray, {$id: id});
        if (selected) {
          selected.selected = false;
        }
      }

      // ==========================================================================================

      function showSongs(songList) {
        vm.viewListTitle = songList.title;
        vm.sortedViewList = [];
        _.each(songList.songs, function(songIndex, songId) {
          vm.sortedViewList[songIndex] = vm.songsObject[songId].title;
        });
        vm.viewSongs = true;
      }

      // ==========================================================================================

      _init();

    }
  };
});
