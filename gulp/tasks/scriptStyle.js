var gulp  = require('gulp'),
    jscs  = require('gulp-jscs'),
    paths = require('../config').paths;

// Verify javascript style standards
gulp.task('scriptStyle', function() {
  return gulp.src(
      [
        paths.DEV_JS_ENTRY,
        paths.DEV_JS_LOCAL,
        paths.DEV_EXCLUDE_UNIT_TESTS
      ],
      {base: 'dev/js'}
    )
    .pipe(jscs());
});
