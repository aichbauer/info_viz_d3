var gulp = require('gulp');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var webserver = require('gulp-webserver');
var open = require('gulp-open');


gulp.task('default', function () {

   gulp.src('src/js/*.js')
    .pipe(babel({

        presets: ['es2015']

      })
    )
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));

   gulp.src('src/*.html')
     .pipe(gulp.dest('dist'));

  gulp.src('dist')
    .pipe(webserver({
      port: 8000
    }));

  gulp.src('./dist/index.html')
    .pipe(open());

});