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
  .pipe(cssnano({zindex: false}))
  .pipe(gulp.dest('docs/css'))
});

gulp.task('uglify', function() {
  return gulp.src('app/js/*.js')
  .pipe(uglify())
  .pipe(gulp.dest('docs/js'))
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
    .pipe(gulp.dest('docs'))
});

gulp.task('cname', function() {
  return gulp.src('app/CNAME')
    .pipe(gulp.dest('docs'))
});

gulp.task('assets', function() {
  return gulp.src('app/assets/**/*')
    .pipe(gulp.dest('docs/assets'))
})

gulp.task('images', function() {
  return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest('docs/images'))
});

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('docs/fonts'))
});

gulp.task('clean', function() {
  return del.sync('docs');
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
    ['styles', 'uglify', 'images', 'fonts', 'html', 'assets'],
    'cname',
    callback
  )
});

gulp.task('default', function(callback) {
  sequence(['sass', 'browserSync'], 'watch',
    callback
  )
});
