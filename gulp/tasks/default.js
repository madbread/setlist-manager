var gulp = require('gulp');

gulp.task('default', ['lint', 'scriptStyle', 'clean'], function() {
  gulp.start('styles', 'scripts', 'images', 'html', 'fonts', 'connect', 'watch');
});
