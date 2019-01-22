
const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const clean = require('gulp-clean');
const cssComb = require('gulp-csscomb');
const cssmin = require('gulp-cssmin');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');

// HTML
function buildHtml() {
  return gulp
    .src('index.html', { allowEmpty: true })
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest('./build'));
}
// CSS
function buildCss() {
  return gulp
    .src('./css/style.css', { allowEmpty: true })
    .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: true }))
    .pipe(cssComb())
    .pipe(cssmin())
    .pipe(gulp.dest('./build/css'));
}
// JS
function buildJs() {
  return gulp
    .src('./js/scripts.js', { allowEmpty: true })
    .pipe(babel({ presets: ['env'] }))
    .pipe(uglify())
    .pipe(gulp.dest('./build/js'));
}
// Imagens para server
function buildImg() {
  return gulp
    .src('./img/**/*', { allowEmpty: true })
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 7 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }]
        })
      ])
    )
    .pipe(gulp.dest('./build/img'));
}

//BUILD
gulp.task('html-build', buildHtml);
gulp.task('css-build', buildCss);
gulp.task('js-build', buildJs);
gulp.task('img-build', buildImg);
// Clean build folder
gulp.task('clean:build', function () {
  return gulp.src('./build', { allowEmpty: true }).pipe(clean());
});

// $ GULP BUILD
//
gulp.task(
  'build',
  gulp.series(
    'clean:build',
    gulp.parallel('html-build', 'css-build', 'js-build', 'img-build')
  )
);
