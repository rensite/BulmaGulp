const   gulp            = require('gulp'),
        sass            = require('gulp-sass'),
        postcss         = require('gulp-postcss'),
        browserSync     = require('browser-sync').create(),
        del             = require('del'),
        autoprefixer    = require('autoprefixer'),
        pug             = require('gulp-pug'),
        fs              = require('fs'),
        rename          = require("gulp-rename");

const   outputDir = 'build';
const   inputDir = 'src';

function watch () {
    browserSync.init({
        watch: true,
        server: {
            baseDir: outputDir
        }
    })
    gulp.watch(inputDir + '/js/**/*.js', js);
    gulp.watch(inputDir + '/scss/**/*.scss', scss);
    gulp.watch(inputDir + '/pages/**/*.pug', pages);
    gulp.watch(inputDir + '/**/*').on('change', browserSync.reload);
}

function scss () {
    return gulp.src(inputDir + '/scss/**/*.scss')
        .pipe(sass())
        .pipe(postcss([ autoprefixer({}) ]))
        .pipe(gulp.dest(outputDir + '/css'))
}

function js () {
    return gulp.src(inputDir + '/js/**/*')
        .pipe(gulp.dest(outputDir + '/js'));
};

function images () {
    return gulp.src(inputDir + '/images/**/*')
        .pipe(gulp.dest('build/images'));
};

function pages () {
    return gulp.src([inputDir + '/pages/**/*.pug', '!' + inputDir + '/pages/_**/*.pug'])
        .pipe(pug({pretty: true}))
        .pipe(rename(function (path) {
            path.extname = ".html";
          }))
        .pipe(gulp.dest(outputDir));
};

function clean (done) {
    del(outputDir, {force: true});
    done();
}

gulp.task('watch', watch);

gulp.task('build', gulp.series(clean, scss, js, images, pages));