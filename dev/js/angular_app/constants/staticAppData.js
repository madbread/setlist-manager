angular.module('Setlists').
constant('staticAppData', {
  key_options: [
    'A', 'Am', 'Bb', 'Bbm', 'B', 'Bm', 'C', 'Cm', 'C#', 'C#m', 'D', 'Dm',
    'Eb', 'Ebm', 'E', 'Em', 'F', 'Fm', 'F#', 'F#m', 'G', 'Gm', 'Ab', 'Abm'
  ],
  singerOptions: [
    'Nate',
    'Carl',
    'Joel',
    'Mike',
    'Adam',
    'Instrumental'
  ],
  new_song: {
    title: '',
    key: 'C',
    carl: 'Guitar',
    adam: 'Banjo',
    nate: 'Mandolin',
    mike: 'Bass',
    singer: 'Nate'
  },
  new_songList: {
    title: ''
  },
  new_venue: {
    title: ''
  }
});

// venue > shows: {
//   datestring: {
//     setlist_id: 0,
//     setlist_id2: 1,
//   }
// } // collection of setList objects as {id: order}
