// Anavo has very few images, so this is just a move task
// Please compress and minify addidional images locally

var gulp = require('gulp');

gulp.task('images', function() {
  return gulp.src([
      'dev/images/*.gif',
      'dev/images/*.png',
      'dev/images/*.svg',
      'dev/images/*.jpg'
    ])
    .pipe(gulp.dest(paths.APP_ASSETS_IMAGES));
});
