var gulp = require('gulp');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var webserver = require('gulp-webserver');
var open = require('gulp-open');
var sass = require('gulp-sass');
var server = require('gulp-server-livereload');


gulp.task('default', ['html_task','sass_task','js_task']);

gulp.task('sass_task',function () {

  return gulp.src('src/assets/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/assets/css'));

});

gulp.task('html_task',function () {

  return gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));

});

gulp.task('js_task',function () {

  return gulp.src('src/assets/js/*.js')
    .pipe(babel({

        presets: ['es2015']

      })
    )
    .pipe(uglify())
    .pipe(gulp.dest('dist/assets/js'));

});

gulp.task('webserver', function () {
  return gulp.src('dist')
    .pipe(server({
      livereload: true,
      open:true
    }))
})

gulp.task('watch', ['webserver'], function () {
  gulp.watch('src/*.html', ['html_task']);
  gulp.watch('src/assets/scss/*.scss', ['sass_task']);
  gulp.watch('src/assets/js/*.js', ['js_task']);
});