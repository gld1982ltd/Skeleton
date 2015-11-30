var gulp = require('gulp');
var gulpif = require('gulp-if');
var postcss = require('gulp-postcss');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');

var header = require('gulp-header');
var moment = require('moment');
var pkg = require('./package.json');

var banner = ['/*!',
  ' Skeleton Framework',
  ' | v<%= pkg.version %>',
  ' | <%= pkg.license %>',
  ' | ' + moment().format("MMM Do, YYYY"),
  ' */',
  '\n \n'
  ].join('');

var paths = {
  css: {
    src: 'src/skeleton.css',
    dev: 'dev/css',
    dist: 'dist/css'
  },
  html: {
    src: 'src/*.html',
    dev: 'dev',
    dist: 'dist'
  },
  images: {
    src: 'src/images',
    dev: 'dev/images',
    dist: 'dist/images'
  },
  watch: 'src/**/*'
};

var processors = [
  require('postcss-import')(),
  require('postcss-custom-properties')(),
  require('postcss-calc')({
    precision: 8
  }),
  require('autoprefixer-core')()
];

var buildCSS = function(options) {
  return gulp.src(options.src)
    .pipe(postcss(processors))
    .pipe(gulpif(options.banner, header(banner, { pkg : pkg })))
    .pipe(gulp.dest(options.dest))
    .pipe(gulpif(options.minify, rename({
      extname: ".min.css"
    })))
    .pipe(gulpif(options.minify, cssmin(options.cssmin)))
    .pipe(gulpif(options.minify, gulp.dest(options.dest)));
};

var copyHTML = function(options) {
  return gulp.src(options.src)
    .pipe(gulp.dest(options.dest));
};

var copyImages = function(options) {
  return gulp.src(options.src)
    .pipe(gulp.dest(options.dest));
};

gulp.task('dev', function() {
  buildCSS({
    src: paths.css.src,
    banner: false,
    minify: false,
    dest: paths.css.dev
  });
  copyHTML({
    src: paths.html.src,
    dest: paths.html.dev
  });
  copyImages({
    src: paths.images.src,
    dest: paths.images.dev
  });
});

gulp.task('watch', function() {
  gulp.watch(paths.watch, ['dev']);
});

gulp.task('prod', function() {
  buildCSS({
    src: paths.css.src,
    banner: true,
    minify: true,
    cssmin: {
      advanced: true,
      aggressiveMerging: true,
      benchmark: false,
      compatibility: '*',
      debug: false,
      keepBreaks: false,
      mediaMerging: true,
      roundingPrecision: 10,
      shorthandCompacting: false
    },
    dest: paths.css.dist
  });
  copyHTML({
    src: paths.html.src,
    dest: paths.html.dist
  });
  copyImages({
    src: paths.images.src,
    dest: paths.images.dist
  });
});
