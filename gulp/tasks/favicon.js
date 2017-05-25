var gulp  = require('gulp'),
    paths = require('../config').paths;

gulp.task('favicon', function() {
  return gulp.src('dev/favicon.ico')
    .pipe(gulp.dest(paths.APP));
});
