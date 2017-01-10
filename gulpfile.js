'use strict';

// Requires ********************************
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var sassdoc = require('sassdoc');

var sassGlob = require('gulp-sass-glob');
//var plumber = require('gulp-plumber');
var cleanCSS = require('gulp-clean-css');
//var browserSync = require('browser-sync').create();
var imagemin = require('gulp-imagemin');
// End Requires *****************************

// Variables ********************************
var scss_input = './sass/*.scss';
var scss_watch_input = './sass/**/*.scss';
var css_output = './css';
var autoprefixerOptions = {browsers: ['last 2 versions', '> 5%', 'Firefox ESR']};
var sass_config = {
    errLogToConsole: true,
    outputStyle: 'expanded',
    //importer: importer,
    /*includePaths: [
        'node_modules/breakpoint-sass/stylesheets/',
        'node_modules/singularitygs/stylesheets/',
        'node_modules/compass-mixins/lib/'
    ]*/
};
// End Variables ******************************

gulp.task('browser-sync', function() {
    browserSync.init({
        //injectChanges: true,
        proxy: "192.168.56.106:80"
    });
    gulp.watch(scss_input, ['sass:dev']).on('change', browserSync.reload);
});

gulp.task('images', function(){
    return gulp
        // Find all image files from the ./images/ folder
        .src('./images/**/*.+(png|jpg|gif|svg)')
        .pipe(imagemin())
        .pipe(gulp.dest('css/images'));
});

gulp.task('sassdoc', function () {
    return gulp
        .src(scss_input)
        .pipe(sassdoc())
        .resume();
});

gulp.task('sass:prod', function () {
  return gulp
    .src(scss_input)
    .pipe(sassGlob())
    .pipe(sass(sass_config).on('error', sass.logError))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest(css_output));
});

gulp.task('sass:dev', function () {
  return gulp
    .src(scss_input)
    //.pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass(sass_config).on('error', sass.logError))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(css_output));
});

gulp.task('sass:watch', function () {
  gulp.watch(scss_watch_input, ['sass:dev']);
});

gulp.task('default', ['sass:dev', 'sass:watch', 'images']);
