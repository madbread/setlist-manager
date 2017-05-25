/**
*   gulp build runs the tasks to build the /app/
*     folder without running a local node server
**/
var gulp = require('gulp');

gulp.task('build', ['lint', 'scriptStyle', 'clean'], function() {
  gulp.start('styles', 'scripts', 'images', 'html', 'fonts', 'favicon');
});
