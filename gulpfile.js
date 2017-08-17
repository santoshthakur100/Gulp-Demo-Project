var gulp = require('gulp');
var sass = require('gulp-sass');
var config = require('./config.json');
var include = require('gulp-html-tag-include');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var del = require('del');
var bless = require('gulp-bless');
var requirejsOptimize = require('gulp-requirejs-optimize');
var notify = require("gulp-notify");
var reload = browserSync.reload;
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var webshot = require('gulp-webshot');
var rename = require('gulp-rename');

// watch sass + html + js -> copy to aem, generate htmls, concat js


// ---------------------------------------------
// ----------- GULP DEFAULT TASK ---------------
// ---------------------------------------------
gulp.task('default', function() {
  browserSync.init({
    open: false,
	  server: config.browsersync
  });

  gulp.watch(config.scss.src, ['sass','splitcss']);
  gulp.watch(config.scss.base, ['sass', 'splitcss']);
  gulp.watch(config.html.src, ['html-include']);
  gulp.watch(config.html.components, ['html-include']);
  gulp.watch(config.js.src, ['jshint']);
  gulp.watch(config.html.dest+'/*.html').on('change', browserSync.reload);
});

// ---------------------------------------------
// -------------- SASS TASKS -------------------
// ---------------------------------------------
gulp.task('sass', ['cleancss'], function () {
    return gulp.src(config.scss.base)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(sass.sync({outputStyle: 'compressed'})
	.on('error', function(err){
		return notify().write(err); 
	}))
	.pipe(autoprefixer('last 2 version', 'ie 8', 'ie 9', 'Chrome', 'Opera', 'Edge', 'Safari', 'Firefox', 'iOS 7', 'android 4'))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest(config.scss.dest))
	.pipe(gulp.dest(config.build.css))
	.pipe(notify({ message: 'SASS:Success' }))
	.pipe(reload({stream:true}));
});

gulp.task('splitcss', ['sass'], function() {
    return gulp.src(config.scss.dest +'/'+ config.scss.filename)
        .pipe(bless())
        .pipe(gulp.dest(config.scss.iedest))
        .pipe(gulp.dest(config.build.iecss));
});

gulp.task('cleancss', function() {
	return del([config.scss.dest+'/**', '!'+config.scss.dest, config.scss.ignore]);
});


gulp.task('build',['sass','splitcss','html-include']);


// ---------------------------------------------
// -------------- HTML TASKS -------------------
// ---------------------------------------------
gulp.task('html-include', function() {
	return gulp.src(config.html.src)
    .pipe(plumber())
		.pipe(include())
		.pipe(gulp.dest(config.html.dest))
		.pipe(gulp.dest(config.build.dest));
});


// ---------------------------------------------
// ---------------- JS TASKS -------------------
// ---------------------------------------------
gulp.task('jshint', function(){
  return gulp.src(config.js.src)
    .pipe(plumber())
    .pipe(jshint())
	  .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
    .on('error', function(err){
        return notify().write(err);
    })
    .pipe(notify({ message: 'JS:Success' }))
    .pipe(reload({stream:true}));
});

gulp.task('scriptslib', ['jshint'], function () {
    return gulp.src(config.js.libfiles)
      .pipe(plumber())
      .pipe(concat(config.js.libfilename))
      .pipe(uglify())
      .pipe(gulp.dest(config.js.dest))
      .pipe(gulp.dest(config.build.js));
});

gulp.task('scriptsmain', ['jshint'], function () {
    return gulp.src(config.js.src)
        .pipe(plumber())
        .pipe(concat(config.js.filename))
        .pipe(uglify())
        .pipe(gulp.dest(config.js.dest))
        .pipe(gulp.dest(config.build.js));
});

// ---------------------------------------------
// ------------- WWW-BUILT TASKS ---------------
// ---------------------------------------------

// gulp.task('www-built', ['www-built-css', 'www-built-js', 'www-built-html', 'www-built-assets']);

// gulp.task('www-built-css', function (){
//   gulp.src(config.scss.dest+"/**")
// 	.pipe(gulp.dest(config.build.css));
// });

// gulp.task('www-built-js', function (){
//     gulp.src([config.js.dest+"/**"])
//     .pipe(gulp.dest(config.build.js));
// });

// gulp.task('www-built-html', function (){
//     gulp.src(config.html.dest+"/*.html")
//     .pipe(gulp.dest(config.build.dest));
// });

// gulp.task('www-built-assets', function (){
//     gulp.src(config.build.srcassets+"/**")
//     .pipe(gulp.dest(config.build.destassets));
// });