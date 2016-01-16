var gulp = require('gulp');
var serve = require('gulp-serve');
var watch = require('gulp-watch');
var generator = require('./main.js');
var ncp = require('ncp').ncp;
var config = require("./config.json");
var prettifyHtml = require('gulp-html-prettify');
var prettifyJs = require('gulp-js-prettify');
var install = require("gulp-install");


ncp.limit = 16;
 
gulp.task('prettifyDist', function() {
  	gulp.src('generated/'+config[0].name+'/**/*.html')
    	.pipe(prettifyHtml({indent_char: ' ', indent_size: 2}))
    	.pipe(gulp.dest('dist/'+config[0].name+'/'))

  	gulp.src('generated/'+config[0].name+'/*.js')
    	.pipe(prettifyJs({collapseWhitespace: true}))
    	.pipe(gulp.dest('dist/'+config[0].name+'/'))

  	gulp.src('generated/'+config[0].name+'/controllers/*.js')
    	.pipe(prettifyJs({collapseWhitespace: true}))
    	.pipe(gulp.dest('dist/'+config[0].name+'/controllers/'))

	ncp('generated/' + config[0].name + '/bower_components','dist/' + config[0].name + '/bower_components', function (err) {
		if (err) {
			return console.error(err);
		}
		console.log('bower_components copy done!');
	});
	ncp('generated/' + config[0].name + '/server','dist/' + config[0].name + '/server', function (err) {
		if (err) {
			return console.error(err);
		}
		console.log('server copy done!');
	});

}); 

gulp.task('serveDist',serve('dist/'+config[0].name));

/////////////////////////////////////////

gulp.task('serve',serve('generated/'+config[0].name));

gulp.task('generate',function(){
	//for (var i = 0; i < config.length; i++)
	generator.generate(config[0]);
});

gulp.task('bower',function(){
	ncp('./templates/bower_components', './generated/' + config[0].name + '/bower_components', function (err) {
	 if (err) {
	   return console.error(err);
	 }
	 console.log('bower_components copy done!');
	});
});

gulp.task('api',function(){
	ncp('./templates/server_components', './generated/' + config[0].name + '/server', function (err) {
	 if (err) {
	   return console.error(err);
	 }
	 console.log('server_components copy done!');
	});
});

gulp.task('watch', function() {
  gulp.watch('templates/**/*',['generate']);
  gulp.watch('main.js',['generate']);
  gulp.watch('config.json',['generate']);
});

gulp.task('install', function() {
	gulp.src(['./templates/bower.json', './package.json'])
	  .pipe(install());
});
////////////////////////////////////////

gulp.task('default',['install','generate','watch','bower','api','serve']);
gulp.task('dist',['prettifyDist','serveDist']);