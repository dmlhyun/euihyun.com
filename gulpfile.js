var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var sequence = require('run-sequence');
var babel = require('gulp-babel');
var rename = require('gulp-rename');

gulp.task('sass', function() {
  return gulp.src('app/scss/styles.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('cssnano', function() {
  return gulp.src('app/css/styles.css')
  .pipe(cssnano())
  .pipe(rename( path => {
    path.basename += ".min";
    path.extname = ".css";
  }))
  .pipe(gulp.dest('dist/css'))
});

gulp.task('uglify', function() {
  return gulp.src('app/js/*.js')
  .pipe(babel({presets: ['es2015']}))
  .pipe(uglify())
  .pipe(rename( path => {
    path.basename += ".min";
    path.extname = ".js";
  }))
  .pipe(gulp.dest('dist/js'))
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    }
  })
});

gulp.task('html', function() {
  return gulp.src('app/*.html')
    .pipe(gulp.dest('dist'))
});

gulp.task('images', function() {
  return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
});

gulp.task('clean', function() {
  return del.sync('dist');
});

gulp.task('styles', function(callback) {
  sequence('sass',
    'cssnano',
    callback
  );
});

// Watch task
gulp.task('watch', ['browserSync', 'sass'], function() {
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

// Build task
gulp.task('build', function(callback) {
  sequence('clean',
    ['styles', 'uglify', 'images', 'fonts', 'html'],
    callback
  )
});

gulp.task('default', function(callback) {
  sequence(['sass', 'browserSync'], 'watch',
    callback
  )
});
