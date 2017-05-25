angular.module('Setlists').
constant('seedData', {
  initial_database: {
    songs: [{
      id: 1,
      title: 'Miss Chicago',
      key: 'C',
      nate: 'Mando',
      mike: 'Bass',
      adam: 'banjo',
      carl: 'guitar'
    }],
    setlists: [{
      id: 1,
      title: 'Example Setlist',
      songs: [1]
    }],
    shows: [{
      id: 1,
      date: 'May 25, 2017',
      venue: 'Martyrs',
      setlist: 1
    }],
    venues: [{
      id: 1,
      title: 'Martyrs'
    }]
  }
});
