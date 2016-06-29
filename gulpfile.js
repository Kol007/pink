'use strict';
var gulp            = require('gulp');

var sass            = require('gulp-sass');
var gcmq            = require('gulp-group-css-media-queries');
var csscomb         = require('gulp-csscomb');
// var cleanCSS     = require('gulp-clean-css');
var sourcemaps      = require('gulp-sourcemaps');
var autoprefixer    = require('gulp-autoprefixer');

var rename          = require('gulp-rename');
var newer           = require('gulp-newer');
var clean           = require('gulp-clean');
var del             = require('del');

var gutil           = require('gulp-util');
var debug           = require('gulp-debug');

var watch           = require('gulp-watch');

var imagemin        = require('gulp-imagemin');
var pngquant        = require('imagemin-pngquant');

var spritesmith     = require('gulp.spritesmith');
// var merge = require('gulp-merge');
// var buffer = require('vinyl-buffer');


var path = require('path');

gulp.task('clean:css', function () {
    console.log('---------- cleaning of css folder');
    return del([
        './build/css'
    ]);
});

gulp.task('clean:img', function () {
    console.log('---------- cleaning of img folder');
    return del([
        './build/img'
    ]);
});

gulp.task('clean:js', function () {
    console.log('---------- cleaning of js folder');
    return del([
        './build/js'
    ]);
});

gulp.task('clean:doc', function () {
    console.log('---------- cleaning of js folder');
    return del([
        './build/*.+(html|txt|ico|png)'
    ]);
    // return gulp.src('./build/*.+(html|txt|ico|png)', {read: false})
    //     .pipe(clean());
});

gulp.task('clean', gulp.parallel(
    'clean:css',
    'clean:img',
    'clean:js',
    'clean:doc'
));

gulp.task('css:scss', function () {
    console.log('---------- SASS compile');
    return gulp
        .src('./src/scss/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true,
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(debug({title: "csscomb:"}))
        .pipe(csscomb())
        .pipe(debug({title: "group media queries:"}))
        .pipe(gcmq())
        .pipe(debug({title: "source map for scss:"}))
        .pipe(sourcemaps.write(/*'./build/css/maps'*/))
        .pipe(debug({title: "autoprefixer:"}))
        .pipe(autoprefixer())
        .pipe(gulp.dest('./build/css'));
});

gulp.task('css:comb', function () {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(csscomb())
        .pipe(gulp.dest('./src/scss'));
});



gulp.task('copy:doc', function() {
    return gulp.src('src/*.+(html|txt|ico|png)')
        .pipe(gulp.dest('./build'))
} );

gulp.task('copy:js', function() {
    return gulp.src('src/js/**/*.js')
        .pipe(gulp.dest('./build/js'))
} );

gulp.task('copy', gulp.parallel(
    'copy:doc',
    'copy:js'
));

gulp.task('img:min', function() {
    return gulp.src('src/img/**/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(debug({title: "compress IMG:"}))
        .pipe(gulp.dest('build/img'));
});


gulp.task('watch', function () {
    gulp.watch('src/*.+(html|txt|ico|png)', gulp.series('clean:doc', 'copy:doc') );
    gulp.watch('src/scss/**/*.scss', gulp.series('clean:css', 'css:scss') );
    gulp.watch('src/img/**/*', gulp.series('clean:img', 'img:min') );
    gulp.watch('src/js/**/*', gulp.series('copy:js') );
});


gulp.task('make:sprite', function () {
    var spriteData = gulp.src('src/img/icon/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        imgPath: '../img/icon/sprite.png',
        cssName: 'sprite.scss',
        cssFormat: 'scss',
        padding:    2,
        cssVarMap: function(sprite) {
            sprite.name = 'icon-' + sprite.name
        }
    }));

    return spriteData
        .pipe(debug({title: "Make Sprite img:"}))
        .pipe(gulp.dest('src/img/icon/'));
});

gulp.task('move:sprite', function () {
    return gulp.src("src/img/icon/sprite.scss")
        .pipe(gulp.dest('src/scss'));
});

gulp.task('clean:sprite', function () {
    return del([
        'src/scss/sprite.css',
        'src/img/icon/sprite.png',
        'src/img/icon/sprite.scss'
    ]);
});

gulp.task('sprite',
    gulp.series(
        'clean:sprite',
        'make:sprite',
        'move:sprite'
    )
);

gulp.task('compile',
    gulp.series(
      'clean',
      gulp.parallel('css:scss', 'copy', 'img:min')
    )
);

gulp.task('default',
    gulp.series(
        // 'clean',
        // 'sprite',
        // gulp.parallel('css:scss', 'copy', 'img:min'),
        gulp.parallel('watch')
    )
);
