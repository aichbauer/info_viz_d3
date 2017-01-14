var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var server = require('gulp-server-livereload');
var clean = require('gulp-clean');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var babelify = require('babelify');
var del = require('del');
var gutil = require('gulp-util');


gulp.task('default', ['htmlTask', 'sassTask', 'jsTask', 'dataTask']);


gulp.task('serve', ['htmlTask', 'sassTask', 'jsTask', 'dataTask'], function () {


  gulp.src('./dist')
    .pipe(server({

      livereload: true,
      open: true

    })
    );

  gulp.watch('./src/*.html', ['htmlTask']);

  gulp.watch('./src/assets/scss/*.scss', ['sassTask']);

  gulp.watch('./src/assets/js/*.js', ['jsTask']);
  gulp.watch('./src/assets/js/**/*.js', ['jsTask']);
  gulp.watch('./src/assets/js/**/**/*.js', ['jsTask']);
  gulp.watch('./src/assets/js/**/**/**/*.js', ['jsTask']);
  gulp.watch('./src/assets/js/**/**/**/**/*.js', ['jsTask']);

  gulp.watch('./src/assets/json/*.*', ['dataTask']);

});

function handleError(err) {
  console.error.bind(console);
  gutil.log(gutil.colors.red(err));
  this.emit('end');
}


gulp.task('sassTask', function () {

  return gulp.src('./src/assets/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./dist/assets/css'))
    .on('error', handleError);
});


gulp.task('htmlTask', function () {

  return gulp.src('./src/*.html')
    .pipe(gulp.dest('dist'))
    .on('error', handleError);
});


gulp.task('jsTask', function () {

  return browserify({

    entries: './src/assets/js/index.js'

  })
    .transform(babelify)
    .bundle()
    .on('error', handleError)
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./dist/assets/js'));
});

gulp.task('dataTask', function () {

  return gulp.src('./src/assets/data/*.*')
    .pipe(gulp.dest('./dist/assets/data'))
    .on('error', handleError);
});