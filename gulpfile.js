// 获取 gulp
var gulp = require('gulp');
const babel = require('gulp-babel');
// 获取 uglify 模块（用于压缩 JS）
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');

// 压缩 js 文件
// 在命令行使用 gulp script 启动此任务
gulp.task('script', function() {
    // 1\. 找到文件
    // gulp.src('modules/controller/*.js')
    gulp.src('modules/controller/component.ctrl.js')
    // 2\. 压缩文件
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify().on('error', function(err){
        	console.log(err)
        }))
    // 3\. 另存压缩后的文件
        .pipe(gulp.dest('dist/modules/controller'))
})
gulp.task('css', function() {
   gulp.src('css/*.css')      //压缩的文件
       .pipe(minifycss().on('error', function(err){
        console.log(err)
    }))//执行压缩
    .pipe(gulp.dest('dist/css'))   //输出文件夹   
});