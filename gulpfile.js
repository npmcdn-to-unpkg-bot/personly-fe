/**
 * Created by MrSingh on 2/13/16.
 */

'use strict';

var gulp = require('gulp');
var inject = require('gulp-inject');
var jshint = require('gulp-jshint');
var wiredep = require('wiredep').stream;
var browserSync = require('browser-sync').create();
var historyApiFallback = require('connect-history-api-fallback');
var modRewrite  = require('connect-modrewrite');
var htmlReplace  = require('gulp-html-replace');
var concat  = require('gulp-concat');
var ngAnnotate  = require('gulp-ng-annotate');
var uglify  = require('gulp-uglify');
var es  = require('event-stream');
var ngTemplateCache  = require('gulp-angular-templatecache');
var csso = require('gulp-csso');
var autoprefixer = require('gulp-autoprefixer');
var concatCss = require('gulp-concat-css');
var urlAdjuster = require('gulp-css-url-adjuster');



gulp.task('style', function(){

    var jsFiles = ['app/js/**/*.js'];

    return gulp.src(jsFiles)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish',{
            verbose:true
        }))
});

gulp.task('inject', function(){
    var wiredep = require('wiredep').stream;
    var options = {
        bowerJson: require('./bower.json'),
        directory: './app/bower-components/'
    };


    return gulp.src('./app/index.html')
        .pipe(wiredep(options))
        .pipe(inject(gulp.src(['./app/js/**/*.js', './app/css/**/*.css'], {read: false}), {ignorePath: '/app'}))
        .pipe(gulp.dest('./app'))

});

gulp.task('serve', function(){
    browserSync.init('./app/**/*.*',{
        server:{
            baseDir:'./app',
            middleware: [historyApiFallback()]
        }
    });
});

gulp.task('serve:dist', function(){
    browserSync.init({
        server:{
            baseDir:'./dist',
            middleware: [historyApiFallback()]
        }
    });
});

gulp.task('htmlReplace', function(){

    gulp.src('./app/index.html')
        .pipe(htmlReplace({
            'vendor': 'js/vendor.js',
            'source':'js/bundle.js',
            'css':'css/all.css'
        }))
        .pipe(gulp.dest('./dist'))

});

gulp.task('bundle:source', function(){

    gulp.src([
            './app/js/app.js',
            './app/js/**/*.js'
        ])
        .pipe(concat('bundle.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))

});

gulp.task('bundle:vendor', function(){

    return gulp.src([

            'app/bower-components/jquery/dist/jquery.js',
            'app/bower-components/bootstrap/dist/js/bootstrap.js',
            'app/bower-components/angular/angular.js',
            'app/bower-components/angular-route/angular-route.js',
            'app/bower-components/angular-toastr/dist/angular-toastr.tpls.js',
            'app/bower-components/angular-validation/dist/angular-validation.min.js',
            'app/bower-components/angular-validation/dist/angular-validation-rule.min.js',
            'app/bower-components/angular-cookies/angular-cookies.js',
            'app/bower-components/angular-local-storage/dist/angular-local-storage.js',
            'app/bower-components/ng-file-upload/ng-file-upload.js',
            'app/bower-components/ng-file-upload-shim/ng-file-upload-shim.js',
            'app/bower-components/angular-bootstrap/ui-bootstrap-tpls.js',
            'app/bower-components/ngMask/dist/ngMask.min.js'
        ])
        .pipe(concat('vendor.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))

});


gulp.task('copy:css',function(){

    return gulp.src([
            'app/bower-components/bootstrap/dist/css/bootstrap.css',
            'app/bower-components/font-awesome/css/font-awesome.min.css',
            'app/bower-components/angular-toastr/dist/angular-toastr.css',
            'app/css/**/*.css'
        ])
        .pipe(concatCss('all.css'))
        .pipe(urlAdjuster({
            replace:['bower_components/bootstrap/dist/','/']
        }))
        .pipe(urlAdjuster({
            replace:['bower_components/fontawesome/','/']
        }))
        .pipe(csso())
        .pipe(gulp.dest('./dist/css'))

});

gulp.task('copy:fonts',function(){

    gulp.src([
            'app/bower_components/bootstrap/fonts/**/**.*',
            'app/bower_components/fontawesome/fonts/**/**.*'
        ])
        .pipe(gulp.dest('./dist/fonts'))

});

gulp.task('copy:html',function(){

    gulp.src('app/partials/**/*.html')
        .pipe(gulp.dest('./dist/partials'))

});

gulp.task('copy:images',function(){

    gulp.src('app/images/**/*.*')
        .pipe(gulp.dest('./dist/images'))

});

gulp.task('build',['htmlReplace','bundle:vendor','bundle:source','copy:css','copy:html', 'copy:images','copy:fonts']);


gulp.task('default', ['serve']);