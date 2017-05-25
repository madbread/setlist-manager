var gulp   = require('gulp'),
    jshint = require('gulp-jshint'),
    paths  = require('../config').paths;

// Run Lint on all js
gulp.task('lint-all', function() {
  return gulp.src(paths.DEV_JS)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
});
