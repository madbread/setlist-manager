angular.module('Setlists').
directive('venueEditor', function(
  firebaseFactory,
  pathsData,
  staticAppData) {
  'use strict';
  return {
    restrict: 'E',
    scope: {},
    controllerAs: 'venueVM',
    bindToController: true,
    replace: true,
    templateUrl: [
      pathsData.directives,
      'venue-editor/venueEditor.html'
    ].join(''),
    controller: function($scope) {
      var vm = this;

      // vm data
      vm.editVenueItem   = undefined;
      vm.newVenue        = angular.copy(staticAppData.new_venue);
      vm.showAddVenue    = false;
      vm.venuesDB        = firebaseFactory.followVenues();
      vm.songListsDB     = firebaseFactory.followSongLists();
      vm.songListsObject = firebaseFactory.followSongListsObject();

      // vm functions
      vm.addVenue        = addVenue;
      vm.displayVenue    = displayVenue;
      vm.toggleAddVenue  = toggleAddSong;
      vm.updateVenue     = updateVenue;

      function addVenue() {
        firebaseFactory.addVenue(angular.copy(vm.newSong));
        vm.newSong     = angular.copy(staticAppData.new_song);
        vm.showAddSong = false;
      }

      function displayVenue(song) {
        vm.editSongItem = song;
      }

      function toggleAddVenue() {
        vm.showAddSong = !vm.showAddSong;
        vm.newSong     = angular.copy(staticAppData.new_song);
      }

      function updateSong() {
        firebaseFactory.updateSong(vm.editSongItem);
        vm.editSongItem = undefined;
      }
    }
  };
});
