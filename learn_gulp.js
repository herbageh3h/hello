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
var runSequence = require('run-sequence');

gulp.task('hello', function() {
    console.log('Hello World!');
});

gulp.task('sass', function() {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});

gulp.watch('src/scss/**/*.scss', ['sass']);

gulp.task('serve', ['sass'], function() {
    browserSync.init({
        server: './src'
    });

    gulp.watch('src/scss/**/*.scss', ['sass']);
    gulp.watch('src/**/*.js', browserSync.reload);
    gulp.watch('src/**/*.html', browserSync.reload);
});

gulp.task('useref', function() {
    return gulp.src('src/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'));
});

gulp.task('images', function() {
    return gulp.src('src/images/**/*.+(png|jpg|gif|svg)')
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function() {
    return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('clean:dist', function() {
    return del.sync('dist');
});

gulp.task('build', function(callback) {
    runSequence('clean:dist', ['sass', 'useref', 'images', 'fonts'], callback);
});

gulp.task('default', function(callback) {
    runSequence(['sass', 'browserSync', 'watch'], callback);
});
