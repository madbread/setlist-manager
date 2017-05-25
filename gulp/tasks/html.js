var gulp        = require('gulp'),
    paths       = require('../config').paths;

gulp.task('html', function() {
  return gulp.src(paths.DEV_HTML)
    .pipe(gulp.dest(paths.APP));
});
