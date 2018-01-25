angular.module('Setlists').
constant('staticAppData', {

  // SETTINGS
  // ==========================================================================
  defaultBassist: 'mike',
  defaultNate: 'Mandolin',
  singerColorHash: {
    'Nate': 'bg-soft-green',
    'Carl': 'bg-soft-yellow',
    'Mike': 'bg-soft-pink',
    'Adam': 'bg-soft-blue',
    'Instrumental': 'bg-soft-purple'
  },
  instrumentColorHash: {
    'Bass': 'bg-soft-green',
    'Banjo': 'bg-soft-yellow',
    'Mandolin': 'bg-soft-pink',
    'Fiddle': 'bg-soft-blue',
    'Guitar': 'bg-soft-purple',
    'Electric': 'bg-soft-brown',
    'Harmonica': 'bg-soft-gray'
  },
  songHelpText: {
    edit: 'Click a title below to edit the song info.',
    new: 'Only add songs that we can perform live.'
  },

  // APP DATA
  // ==========================================================================
  key_options: [
    'A', 'Am', 'Bb', 'Bbm', 'B', 'Bm', 'C', 'Cm', 'C#', 'C#m', 'D', 'Dm',
    'Eb', 'Ebm', 'E', 'Em', 'F', 'Fm', 'F#', 'F#m', 'G', 'Gm', 'Ab', 'Abm'
  ],
  singerOptions: [
    'Nate',
    'Carl',
    'Mike',
    'Adam',
    'Instrumental'
  ],
  instrumentOptions: [
    'Bass',
    'Banjo',
    'Mandolin',
    'Fiddle',
    'Guitar',
    'Electric',
    'Harmonica',
    'Kit',
    'Cajon'
  ],
  playerOptions: [
    'nate',
    'mike',
    'adam',
    'carl',
    'mark'
  ],
  minuteOptions: [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
  ],
  secondOptions: [
    0, 15, 30, 45
  ],
  new_song: {
    title: '',
    key: 'C',
    carl: 'Guitar',
    adam: 'Banjo',
    nate: 'Mandolin',
    mike: 'Bass',
    mark: 'Cajon',
    singer: 'Nate',
    minutes: 3,
    seconds: 0
  },
  new_songList: {
    title: ''
  },
  new_venue: {
    title: ''
  },

  // Fixtures
  // ==========================================================================
  fixtureSongs: [
    {
      adam: 'Banjo',
      carl: 'Guitar',
      key: 'Em',
      mike: 'Bass',
      minutes: 3,
      nate: 'Mandolin',
      seconds: 0,
      singer: 'Nate',
      title: 'TEST One Load Lighter',
      order: 2
    },
    {
      adam: 'Harmonica',
      carl: 'Electric',
      key: 'F#',
      mike: 'Bass',
      minutes: 3,
      nate: 'Guitar',
      seconds: 0,
      singer: 'Nate',
      title: 'TEST Old 55',
      order: 0
    },
    {
      adam: 'Bass',
      carl: 'Guitar',
      key: 'A',
      mike: 'Fiddle',
      minutes: 3,
      nate: 'Mandolin',
      seconds: 0,
      singer: 'Carl',
      title: 'TEST Change in the Weather',
      order: 1
    }
  ]
});
