/*jshint esversion: 6 */

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-cleancss');
var htmlMin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var changed = require('gulp-changed');
var htmlReaplce = require('gulp-html-replace');
var del = require('del');
var sequence = require('run-sequence');
var babel = require('gulp-babel');


var config = {
  dist: 'dist/',
  src: 'src/',
  cssin: 'src/css/**/*.css',
  jsin: 'src/js/**/*.js',
  imgin: 'src/img/**/*.{jpg,jpeg,png,gif}',
  htmlin: 'src/*.html',
  phpin: 'src/*.php',
  scssin: 'src/scss/**/*.scss',
  cssout: 'dist/css/',
  jsout: 'dist/js/',
  imgout: 'dist/img/',
  htmlout: 'dist/',
  phpout: 'dist/',
  scssout: 'src/css/',
  cssoutname: 'style.css',
  jsoutname: 'main.js',
  phpoutname: 'index.php',
  cssreplaceout: 'css/style.css',
  jsreplaceout: 'js/main.js',
  phpreplaceout: 'src/index.php'
};

gulp.task('reload', function() {
  browserSync.reload();
});

gulp.task('serve', ['sass'], function() {
  browserSync.init({
    proxy: "http://localhost:8090/bonGulp/src/"
    //server: config.src
  });

  gulp.watch([config.htmlin, config.phpin, config.jsin], ['reload']);
  gulp.watch(config.scssin, ['sass']);
});

gulp.task('sass', function() {
  return gulp.src(config.scssin)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 3 versions']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.scssout))
    .pipe(browserSync.stream());
});

gulp.task('css', function() {
  return gulp.src(config.cssin)
    .pipe(concat(config.cssoutname))
    .pipe(cleanCSS())
    .pipe(gulp.dest(config.cssout));
});

// ****Babel le remplace****
// gulp.task('js', function() {
//   return gulp.src(config.jsin)
//     .pipe(concat(config.jsoutname))
//     .pipe(uglify())
//     .pipe(gulp.dest(config.jsout));
// });

gulp.task('img', function() {
  return gulp.src(config.imgin)
    .pipe(changed(config.imgout))
    .pipe(imagemin())
    .pipe(gulp.dest(config.imgout));
});

gulp.task('html', function() {
  return gulp.src(config.htmlin)
    .pipe(htmlReaplce({
      'css': config.cssreplaceout,
      'js': config.jsreplaceout
    }))
    .pipe(htmlMin({
      sortAttributes: true,
      sortClassName: true,
      collapseWhitespace: true
    }))
    .pipe(gulp.dest(config.dist));
});

gulp.task('php', function() {
  return gulp.src(config.phpin)
    .pipe(concat(config.phpoutname))
    .pipe(gulp.dest(config.phpout));
  });

gulp.task('babel', () =>
    gulp.src(config.jsin)
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(concat(config.jsoutname))
        .pipe(uglify())
        .pipe(gulp.dest(config.jsout))
);

gulp.task('clean', function() {
  return del([config.dist]);
});

gulp.task('build', function() {
  sequence('sass', 'babel', ['html', 'php', 'css', 'img']);
});
