/**
 * Gulp file to automate the various tasks
 */

// Import gulp
const gulp = require('gulp');

// Run tasks in sequence
const runSequence = require('run-sequence');
// Add vendor prefixes to css properties (-moz, -webkit, -ms, etc...)
const autoprefixer = require('gulp-autoprefixer');
// Minify CSS files
const cleanCss = require('gulp-clean-css');
// Compile SASS (.scss) files
const sass = require('gulp-sass');
// Minify JS files
const uglify = require('gulp-uglify');
// Concatenate (aka bundle) files
const concat = require('gulp-concat');
// Delete files and folders
const del = require('del');

// TODO: 2018-09-27 Blockost
// Check out browserSync and live-reloading of files using Gulp

// Define paths
const paths = {
  dist: {
    base: 'dist/assets',
    img: 'dist/assets/img',
    libs: 'dist/assets/vendor'
  },
  base: {
    base: './',
    node: 'node_modules'
  },
  src: {
    base: 'src',
    css: 'src/assets/css',
    html: 'src/**/*.html',
    img: 'src/assets/img/**/*.+(png|jpg|gif|svg)',
    js: 'src/assets/js/**/*.js',
    scss: 'src/assets/scss/**/*.scss'
  }
};

// // Compile SCSS

// gulp.task('scss', function() {
//   return gulp
//     .src(paths.src.scss)
//     .pipe(wait(500))
//     .pipe(sass().on('error', sass.logError))
//     .pipe(postcss([require('postcss-flexbugs-fixes')]))
//     .pipe(
//       autoprefixer({
//         browsers: ['> 1%']
//       })
//     )
//     .pipe(csscomb())
//     .pipe(gulp.dest(paths.src.css))
//     .pipe(
//       browserSync.reload({
//         stream: true
//       })
//     );
// });

// // Minify CSS

// gulp.task('minify:css', function() {
//   return gulp
//     .src([paths.src.css + '/argon.css'])
//     .pipe(cleanCss())
//     .pipe(rename({ suffix: '.min' }))
//     .pipe(gulp.dest(paths.dist.base + '/css'));
// });

// // Minify JS

// gulp.task('minify:js', function(cb) {
//   return gulp
//     .src([paths.src.base + '/assets/js/argon.js'])
//     .pipe(uglify())
//     .pipe(rename({ suffix: '.min' }))
//     .pipe(gulp.dest(paths.dist.base + '/js'));
// });

// // Live reload

// gulp.task('browserSync', function() {
//   browserSync.init({
//     server: {
//       baseDir: [paths.src.base, paths.base.base]
//     }
//   });
// });

// // Watch for changes

// gulp.task('watch', ['browserSync', 'scss'], function() {
//   gulp.watch(paths.src.scss, ['scss']);
//   gulp.watch(paths.src.js, browserSync.reload);
//   gulp.watch(paths.src.html, browserSync.reload);
// });

// // Clean

// gulp.task('clean:assets', function() {
//   return del.sync(paths.dist.base);
// });

// // Copy CSS

// gulp.task('copy:css', function() {
//   return gulp
//     .src([paths.src.base + '/assets/css/argon.css'])
//     .pipe(gulp.dest(paths.dist.base + '/css'));
// });

// // Copy JS

// gulp.task('copy:js', function() {
//   return gulp
//     .src([paths.src.base + '/assets/js/argon.js'])
//     .pipe(gulp.dest(paths.dist.base + '/js'));
// });

// // TODO: 2018-09-26 Blockost
// // Bundle views/assets/js copy + scss compilation in one task!
// gulp.task('copy:assets', function() {
//   return gulp
//     .src(
//       [
//         paths.src.base + '/assets/img/**/*',
//         paths.src.base + '/assets/vendor/**/*'
//       ],
//       { base: './src/assets' }
//     )
//     .pipe(gulp.dest(paths.dist.base));
// });

// // Build

// gulp.task('build', function(callback) {
//   runSequence(
//     'clean:assets',
//     'scss',
//     'copy:css',
//     'copy:js',
//     'copy:assets',
//     'minify:js',
//     'minify:css',
//     callback
//   );
// });

gulp.task('clean', () => {
  // del is returning a Promise so no need to call a
  // callback to tell the engine the task has completed
  return del('./dist');
});

/**
 * Compile, minify and copy sass files to the dist folder.
 */
gulp.task('build:css', (done) => {
  gulp
    .src('./src/assets/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(
      autoprefixer({
        browsers: ['> 1%']
      })
    )
    .pipe(cleanCss())
    .pipe(concat('styles.bundle.css'))
    .pipe(gulp.dest('./dist/assets/'));

  // Task completion
  done();
});

/**
 * Compile, minify and copy JS files to the dist folder.
 */
gulp.task('build:js', (done) => {
  gulp
    .src('./src/assets/**/*.js')
    .pipe(uglify())
    .pipe(concat('scripts.bundle.js'))
    .pipe(gulp.dest('./dist/assets'));

  // Task completion
  done();
});

/**
 * Copy misc assets (e.g fonts, images) to the dist folder.
 */
gulp.task('copy:assets', (done) => {
  gulp
    .src(['./src/assets/fonts/**/*', './src/assets/img/**/*'], {
      base: './src/assets'
    })
    .pipe(gulp.dest('./dist/assets'));

  // Task completion
  done();
});

/**
 * Copy views (PUG files) to the dist folder.
 */
gulp.task('copy:views', (done) => {
  gulp.src('./src/views/**/*', { base: './src' }).pipe(gulp.dest('./dist'));

  // Task completion
  done();
});

gulp.task(
  'build',
  gulp.parallel('build:css', 'build:js', 'copy:assets', 'copy:views'),
  (done) => {
    done();
  }
);

/**
 * Default task.
 */
gulp.task('default', gulp.series('clean', 'build'), (done) => {
  //runSequence(['scss', 'browserSync', 'watch'], done);
  done();
});
