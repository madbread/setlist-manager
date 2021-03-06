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

      // vm data
      vm.editSongItem  = undefined;
      vm.keyOptions    = staticAppData.key_options;
      vm.newSong       = angular.copy(staticAppData.new_song);
      vm.showAddSong   = false;
      vm.singerOptions = angular.copy(staticAppData.singerOptions);
      vm.songsDB       = firebaseFactory.followSongs();
      vm.minuteOptions = staticAppData.minuteOptions;
      vm.secondOptions = staticAppData.secondOptions;
      vm.helpText      = staticAppData.songHelpText;

      // vm functions
      vm.addSong       = addSong;
      vm.displaySong   = displaySong;
      vm.toggleAddSong = toggleAddSong;
      vm.updateSong    = updateSong;
      vm.deleteSong    = deleteSong;

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

      function deleteSong() {
        if (window.confirm(
          'Are you sure you wish to delete this song?\n\n' +
          'Doing so will also remove the song form all existing setlists')) {
          firebaseFactory.deleteSong(vm.editSongItem)
            .then(function() {
              vm.editSongItem = undefined;
            });
        }
      }

      function addSong() {
        firebaseFactory.addSong(angular.copy(vm.newSong));
        vm.newSong = angular.copy(staticAppData.new_song);
        vm.showAddSong = false;
      }
    },
  };
});
