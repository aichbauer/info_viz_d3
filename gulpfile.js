var gulp       = require('gulp');
var uglify     = require('gulp-uglify');
var sass       = require('gulp-sass');
var server     = require('gulp-server-livereload');
var clean      = require('gulp-clean');
var source     = require('vinyl-source-stream');
var browserify = require('browserify');
var babelify = require('babelify');

gulp.task('default', ['htmlTask','sassTask','jsTask']);

gulp.task('serve', ['htmlTask','sassTask','jsTask'], function(){


  gulp.src('./dist')
    .pipe(server({

      livereload: true,
      open:true

    })
  )

  gulp.watch('./src/*.html', ['htmlTask']);
  gulp.watch('./src/assets/scss/*.scss', ['sassTask']);
  gulp.watch('./src/assets/js/*.js', ['jsTask']);

});

gulp.task('sassTask',function () {

  return gulp.src('./src/assets/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./dist/assets/css'));

});

gulp.task('htmlTask',function () {

  return gulp.src('./src/*.html')
    .pipe(gulp.dest('dist'));

});

gulp.task('jsTask',function () {

  return browserify({

    entries: './src/assets/js/index.js'

  })
  .transform(babelify)
  .bundle()
  .on('error',console.error.bind(console))
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('./dist/assets/js'));

});