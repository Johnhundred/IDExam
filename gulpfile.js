var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var connect = require('gulp-connect-php');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var runSequence = require('run-sequence');
var imageMin = require('gulp-imagemin');
var del = require('del');
var htmlMin = require('gulp-htmlmin');

// Following tasks are generally for development purposes. Sass task is also used for building the dist.

gulp.task("connect-sync", function(){
    browserSync.init({
        server: {
            baseDir: 'app'
        }
    })
});

gulp.task("sass", function(){
    return gulp.src("app/assets/sass/style.scss") //source file
        .pipe(sass()) //SASS-compile into css
        .pipe(gulp.dest("app/assets/css")) //destination directory
        .pipe(browserSync.stream()) //stream new css to the browser
});

gulp.task("watch", ["connect-sync"], function(){ // run the browserSync task before allowing the watch task to run
    console.log("Log: Server started, watching SCSS.");
    gulp.watch("app/assets/sass/**/*.scss", ["sass"]); //watch for changes in any scss files, run sass task on change
    console.log("Log: Watching HTML.");
    gulp.watch("**/*.html", browserSync.reload); //watch for changes in html files, reload if changes detected
    console.log("Log: Watching JS.");
    gulp.watch("app/**/*.js", browserSync.reload); // any js file changed, reload browser
    console.log("Log: Watcher setup complete.");
});



// Following tasks have to do with building the project for distribution/production.

gulp.task("htmlHandler", function(){
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest("dist"))
});

gulp.task("fontHandler", function(){
    return gulp.src('app/assets/fonts/*')
        .pipe(gulp.dest('dist/assets/fonts'))
});

gulp.task("imageHandler", function(){
    return gulp.src('app/assets/img/**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(imageMin({
            interlaced: true,
            verbose: true
        }))
        .pipe(gulp.dest('dist/assets/img'))
});

gulp.task("htmlMinifier", function(){
    return gulp.src('dist/*.html')
        .pipe(htmlMin({
            collapseWhitespace: true,
            caseSensitive: true
        }))
        .pipe(gulp.dest("dist"))
});

gulp.task("build", function(cb){
    // Deletes everything inside the dist folder, clean slate.
    del(['dist/*']);
    // Compiles SCSS, bundles/minifies CSS and JS, transfers fonts, minifies & transfers images, in that order.
    console.log("Log: Building files.");
    runSequence('sass', 'htmlHandler', 'htmlMinifier', 'fontHandler', 'imageHandler', cb);
});

