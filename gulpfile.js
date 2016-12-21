var gulp = require('gulp');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var webserver = require('gulp-webserver');
var open = require('gulp-open');
var sass = require('gulp-sass');


gulp.task('default', function () {

  gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));

  gulp.src('src/assets/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));

  gulp.src('src/assets/js/*.js')
    .pipe(babel({

        presets: ['es2015']

      })
    )
    .pipe(uglify())
    .pipe(gulp.dest('dist/assets.js'));

  gulp.src('dist')
    .pipe(webserver({
      port: 8000
    }));

  gulp.src('./dist/index.html')
    .pipe(open());

});