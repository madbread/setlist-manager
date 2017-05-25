var gulp    = require('gulp'),
    connect = require('gulp-connect'),
    paths   = require('../config').paths;

gulp.task('connect', function() {
  connect.server({
    root: paths.APP,
    port: paths.DEV_PORT,
    fallback: './app/404.html'
  });
});
