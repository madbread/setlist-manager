angular.module('Setlists').
factory('firebaseFactory', function($firebaseObject) {
  var methods = {};
  var ref = firebase.database().ref();
  var challengeObject = $firebaseObject(ref);

  var boardData = {
    options: ['-- SELECT BOARD --', 'family', 'parents'],
    selected: 'family'
  };

  methods.calculateGamesPerWeek = function() {
    var completionDate = moment(new Date(challengeObject.data.completion[boardData.selected]));
    var emptySlots = 0;
    var times = challengeObject[boardData.selected].times;

    // Replace each with reduce
    _.each(challengeObject[boardData.selected], function(game) {
      if (game.played !== undefined) {
        emptySlots += (times - game.played);
      }
    });

    // Replace with actual weeks comparison
    var weeksLeft = completionDate.diff(moment(), 'weeks');

    return emptySlots / weeksLeft;
  };

  methods.getBoardData = function() {
    return boardData;
  };

  methods.selectBoard = function(board) {
    if (boardData.options.indexOf(board) > -1) {
      boardData.selected = board;
    }
  };

  methods.followFirebaseRootObject = function() {
    return challengeObject;
  };

  methods.saveData = function() {
    challengeObject.$save();
  };

  methods.setGameTimes = function(gameId, times) {
    challengeObject[boardData.selected][gameId].played = times;
    methods.saveData();
  };

  methods.incrementPlaycount = function(gameId) {
    if (challengeObject[boardData.selected][gameId].played < challengeObject[boardData.selected].times) {
      challengeObject[boardData.selected][gameId].played =
        challengeObject[boardData.selected][gameId].played + 1;
      methods.saveData();
    }
  };

  methods.decrementPlaycount = function(gameId) {
    if (challengeObject[boardData.selected][gameId].played > 0) {
      challengeObject[boardData.selected][gameId].played =
        challengeObject[boardData.selected][gameId].played - 1;
      methods.saveData();
    }
  };

  return methods;
});
