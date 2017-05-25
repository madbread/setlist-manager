// Run Lint on non-vendor js
var gulp   = require('gulp'),
    jshint = require('gulp-jshint'),
    paths  = require('../config').paths;

gulp.task('lint', function() {
  return gulp.src([
      paths.DEV_JS_ENTRY,
      paths.DEV_JS_LOCAL
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
});
