var gulp       = require('gulp'),
    uglify     = require('gulp-uglify'),
    concat     = require('gulp-concat-util'),
    ngAnnotate = require('gulp-ng-annotate'),
    gutil      = require('gulp-util'),
    paths      = require('../config').paths;

gulp.task('scripts', function() {
  return gulp.src(
      /**
      * Gather angular-base first,
      * then vendor files,
      * then util files,
      * then main angular app declaration,
      * then all angular modules
      * then exclude unit test specs
      */
      [
        'dev/js/angular_base/jquery.js',
        'dev/js/angular_base/jquery-ui.js',
        'dev/js/angular_base/angular.js',
        'dev/js/angular_base/moment.js',
        paths.DEV_VENDOR,
        paths.DEV_JS_ENTRY,
        paths.DEV_JS_LOCAL,
        paths.DEV_EXCLUDE_UNIT_TESTS
      ],
      {base: 'dev/js'}
    )
    .pipe(concat(paths.OUT_JS_FILENAME + '.js'))
    .pipe(ngAnnotate())
    // .pipe(uglify())
    .pipe(gulp.dest(paths.APP_ASSETS_JS));
});
