angular.module('Setlists')
.constant('baseUrl', (function() {
  /**
  *  This backfills any browser without an origin
  *    key on location object, most notably IE, by
  *    building the origin string manually
  **/
  if (!window.location.origin) {
    window.location.origin = window.location.protocol +
                              '//' +
                              window.location.hostname +
                              (window.location.port ? ':' + window.location.port : '');
  }

  return window.location.hostname === 'localhost' ?
    '/' : [window.location.origin, 'setlist-manager/app/'].join('/');
})());
