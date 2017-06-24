angular.module('Setlists').
factory('firebaseFactory', function($firebaseObject, $firebaseArray) {
  var methods = {};

  var instrumentsRef = firebase.database().ref('meta/instruments');
  var instrumentsDB = $firebaseArray(instrumentsRef);

  var songsRef = firebase.database().ref('data/songs');
  var songsDB = $firebaseArray(songsRef);
  var songsObject = $firebaseObject(songsRef);

  var songListsRef = firebase.database().ref('data/songLists');
  var songListsDB = $firebaseArray(songListsRef);
  var songListsObject = $firebaseObject(songListsRef);

  var venuesRef = firebase.database().ref('data/venues');
  var venuesDB = $firebaseArray(venuesRef);

  // ==============================================================================================

  methods.readDataOnce = function(type) {
    var returnVal;
    switch (type) {
      case 'instruments':
        returnVal = instrumentsDB.$ref().once('value');
        break;
      case 'songs':
        returnVal = songsDB.$ref().once('value');
        break;
      case 'songLists':
        returnVal = songListsDB.$ref().once('value');
        break;
      case 'shows':
        returnVal = showsDB.$ref().once('value');
        break;
      case 'venues':
        returnVal = venuesDB.$ref().once('value');
        break;
      default:
        returnVal = instrumentsDB.$ref().once('value');
        break;
    }
    return returnVal;
  };

  // ==============================================================================================

  methods.followInstruments = function() {
    return instrumentsDB;
  };
  methods.addInstrument = function(instrument) {
    instrumentsDB.$add(instrument);
  };

  // ==============================================================================================

  methods.followSongs = function() {
    return songsDB;
  };
  methods.followSongsObject = function() {
    return songsObject;
  };
  methods.addSong = function(song) {
    return songsDB.$add(song);
  };
  methods.updateSong = function(song) {
    return songsDB.$save(song);
  };
  methods.deleteSong = function(song) {
    // Remove song from all songlists
    _.each(songListsDB, function(songList) {
      if (_.keys(songList.songs).indexOf(song.$id) !== -1) {
        methods.removeSongFromList(song.$id, songList);
        methods.updateSongList(songList);
      }
    });
    return songsDB.$remove(song);
  };

  // ==============================================================================================

  methods.removeSongFromList = function(songId, songList) {
    var removedIdx = angular.copy(songList.songs[songId]);
    delete songList.songs[songId];
    _.each(songList.songs, function(order, songId) {
      if (order > removedIdx) {
        songList.songs[songId]--;
      }
    });
  };

  // ==============================================================================================

  methods.followSongLists = function() {
    return songListsDB;
  };
  methods.followSongListsObject = function() {
    return songListsObject;
  };
  methods.addSongList = function(songList) {
    return songListsDB.$add(songList);
  };
  methods.updateSongList = function(songList) {
    return songListsDB.$save(songList);
  };
  methods.deleteSongList = function(songList) {
    return songListsDB.$remove(songList);
  };

  // ==============================================================================================

  methods.followVenues = function() {
    return venuesDB;
  };
  methods.addVenue = function(venue) {
    return venuesDB.$add(venue);
  };
  methods.updateVenue = function(venue) {
    return venuesDB.$save(venue);
  };

  // ==============================================================================================

  methods.populate = function() {
    // Write a script here and run through admin
  };

  // ==============================================================================================

  return methods;
});
