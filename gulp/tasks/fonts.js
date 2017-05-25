var gulp  = require('gulp')
    paths = require('../config').paths;

// Smiply moves over the html for now
gulp.task('fonts', function() {
  return gulp.src(
    [
      'dev/fonts/*.eot',
      'dev/fonts/*.svg',
      'dev/fonts/*.ttf',
      'dev/fonts/*.woff'
    ]
  )
  .pipe(gulp.dest(paths.APP_FONTS));
});
