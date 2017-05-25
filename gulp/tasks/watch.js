var gulp  = require('gulp'),
    paths = require('../config').paths;

gulp.task('watch', function() {
  gulp.watch(paths.DEV_JS, { interval: 5000 }, ['lint', 'scriptStyle', 'scripts']);
  gulp.watch(paths.DEV_STYLES, { interval: 5500 }, ['styles']);
  gulp.watch(paths.DEV_HTML, { interval: 6000 }, ['html']);
});
