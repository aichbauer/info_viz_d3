var gulp        = require('gulp');
var uglify      = require('gulp-uglify');
var sass        = require('gulp-sass');
var server      = require('gulp-server-livereload');
var clean       = require('gulp-clean');
var source      = require('vinyl-source-stream');
var browserify  = require('browserify');
var babelify    = require('babelify');
var del         = require('del');


gulp.task('default', ['htmlTask','sassTask','jsTask', 'dataTask']);


gulp.task('serve', ['htmlTask','sassTask','jsTask', 'dataTask'], function(){


  gulp.src('./dist')
    .pipe(server({

      livereload: true,
      open:true

    })
  )

  gulp.watch('./src/*.html', ['htmlTask']);

  gulp.watch('./src/assets/scss/*.scss', ['sassTask']);

  gulp.watch('./src/assets/js/*.js', ['jsTask']);
  gulp.watch('./src/assets/js/**/*.js', ['jsTask']);
  gulp.watch('./src/assets/js/**/**/*.js', ['jsTask']);
  gulp.watch('./src/assets/js/**/**/**/*.js', ['jsTask']);
  gulp.watch('./src/assets/js/**/**/**/**/*.js', ['jsTask']);

  gulp.watch('./src/assets/json/*.*', ['dataTask']);

});


gulp.task('sassTask',function () {

  del(['./dist/assets/scss/*.scss']).then(paths => {

    console.log('Deleted files and folders:\n', paths.join('\n'));

    return gulp.src('./src/assets/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./dist/assets/css'))
    .on('error', handleError);;

  });

});


gulp.task('htmlTask',function () {

  del(['./dist/*.html']).then(paths => {

    console.log('Deleted files and folders:\n', paths.join('\n'));

    return gulp.src('./src/*.html')
    .pipe(gulp.dest('dist'))
    .on('error', handleError);;
    
  });

});


gulp.task('jsTask',function () {

  del(['./dist/assets/js/bundle.js']).then(paths => {

    console.log('Deleted files and folders:\n', paths.join('\n'));

    return browserify({

    entries: './src/assets/js/index.js'

  })
  .transform(babelify)
  .bundle()
  .on('error', function(err){
        console.log(err.message);
    })
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('./dist/assets/js'))
  .on('error', handleError);;
    
  });

});


gulp.task('dataTask',function () {

  del(['./dist/assets/data/*.*']).then(paths => {

    console.log('Deleted files and folders:\n', paths.join('\n'));

    return gulp.src('./src/assets/data/*.*')
    .pipe(gulp.dest('./dist/assets/data'))
    .on('error', handleError);

  });

});

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}