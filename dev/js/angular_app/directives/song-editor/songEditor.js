angular.module('Setlists').
directive('songEditor', function(
  firebaseFactory,
  pathsData,
  staticAppData) {
  'use strict';

  return {
    restrict: 'E',
    scope: {},
    controllerAs: 'songVM',
    bindToController: true,
    replace: true,
    templateUrl: [
      pathsData.directives,
      'song-editor/songEditor.html'
    ].join(''),

    controller: function($scope) {
      var vm = this;

      vm.newSong     = angular.copy(staticAppData.new_song);
      vm.keyOptions  = staticAppData.key_options;
      vm.songsDB     = firebaseFactory.followSongs();
      vm.addSong     = addSong;
      vm.toggleAddSong = toggleAddSong;
      vm.showAddSong = false;
      vm.displaySong = displaySong;
      vm.editSongItem = undefined;
      vm.updateSong = updateSong;
      vm.singerOptions = angular.copy(staticAppData.singerOptions);

      function toggleAddSong() {
        vm.showAddSong = !vm.showAddSong;
        vm.newSong     = angular.copy(staticAppData.new_song);
      }

      function displaySong(song) {
        vm.editSongItem = song;
      }

      // Set Instrument Options from meta/instruments
      vm.instrumentOptions = [];
      firebaseFactory.readDataOnce('instruments').then(
        function(response) {
          $scope.$applyAsync(function() {
            _.each(response.val(), function(instrument, key) {
              vm.instrumentOptions.push(instrument.title);
            });
          });
        }
      );

      function updateSong() {
        firebaseFactory.updateSong(vm.editSongItem);
        vm.editSongItem = undefined;
      }

      function addSong() {
        firebaseFactory.addSong(angular.copy(vm.newSong));
        vm.newSong = angular.copy(staticAppData.new_song);
        vm.showAddSong = false;
      }
    },
  };
});
