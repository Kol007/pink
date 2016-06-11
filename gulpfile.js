'use strict';
var gulp    = require('gulp');

var less    = require('gulp-less');
var gcmq     = require('gulp-group-css-media-queries');
var csscomb = require('gulp-csscomb');
var cleanCSS = require('gulp-clean-css');

var rename = require('gulp-rename');
var newer = require('gulp-newer');
var clean = require('gulp-clean');
var del = require('del');

var gutil = require('gulp-util');
var debug = require('gulp-debug');

var watch = require('gulp-watch');

var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

var spritesmith = require('gulp.spritesmith');
var merge = require('gulp-merge');
var buffer = require('vinyl-buffer');


var LessPluginCleanCSS = require('less-plugin-clean-css'),
    LessPluginAutoPrefix = require('less-plugin-autoprefix'),
    cleancss = new LessPluginCleanCSS({ advanced: true }),
    autoprefix= new LessPluginAutoPrefix({ browsers: ["last 2 versions", "ie >= 8", "> 1%"] });

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


gulp.task('css:less', function () {
    console.log('---------- LESS compile');
    return gulp.src('./src/less/main.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ],
            plugins: [autoprefix]
        }).on('error', gutil.log))
        .pipe(debug({title: "csscomb:"}))
        .pipe(csscomb())
        .pipe(debug({title: "group media queries:"}))
        .pipe(gcmq())
        .pipe(gulp.dest('./build/css'));
});

gulp.task('css:comb', function () {
    return gulp.src('./src/less/**/*.less')
        .pipe(csscomb())
        .pipe(gulp.dest('./src/less'));
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
    gulp.watch('src/less/**/*.less', gulp.series('clean:css', 'css:less') );
    gulp.watch('src/img/**/*', gulp.series('clean:img', 'img:min') );
    gulp.watch('src/js/*', gulp.series('copy:js') );
});


gulp.task('make:sprite', function () {
    var spriteData = gulp.src('src/img/icon/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        imgPath: '../img/icon/sprite.png',
        cssName: 'sprite.less',
        cssFormat: 'less',
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
    return gulp.src("src/img/icon/sprite.less")
        .pipe(gulp.dest('src/less'));
});

gulp.task('clean:sprite', function () {
    return del([
        'src/less/sprite.css',
        'src/img/icon/sprite.png',
        'src/img/icon/sprite.less'
    ]);
});
gulp.task('sprite',
    gulp.series(
        'clean:sprite',
        'make:sprite',
        'move:sprite'
    )
);


gulp.task('default',
    gulp.series(
        'clean',
        'sprite',
        gulp.parallel('css:less', 'copy', 'img:min'),
        gulp.parallel('watch')
    )
);
