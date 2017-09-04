var gulp = require('gulp')
var babel = require('gulp-babel')
var nunjucks = require('gulp-nunjucks')
var concat = require('gulp-concat')
var autoprefixer = require('gulp-autoprefixer')
var stylus = require('gulp-stylus')
var minicss = require('gulp-minify-css')
var rename = require('gulp-rename')
var browserify = require('gulp-browserify')
var fs = require('fs')
var yaml = require('js-yaml')

var connect = require('gulp-connect')

var config = yaml.safeLoad(fs.readFileSync('_config.yml', 'utf8'))
var language = yaml.safeLoad(fs.readFileSync('./language/zh-CN.yml', 'utf8'))
var json = Object.assign({}, config, language)

gulp.task('nj-yml', () => {
  gulp.src('template/index.html')
      .pipe(nunjucks.compile(json))
      .pipe(gulp.dest('dist'))
})

gulp.task('assets', () => {
  gulp.src('assets/**/*')
      .pipe(gulp.dest('dist/assets'))
})

// gulp.task('js', () => {
//   gulp.src('lib/*.js')
//       .pipe(babel({
//         presets: ['es2015']
//       }))
//       .pipe(browserify({
//         insertGlobals : true,
//         debug : !gulp.env.production
//       }))
//       .pipe(rename('bundle.js'))
//       .pipe(gulp.dest('dist/js'))
// })

gulp.task('style', () => {
  gulp.src('styles/style.styl')
      .pipe(concat('style.styl'))
      .pipe(stylus())
      .pipe(autoprefixer({
        browsers: ['last 2 version','iOS >= 7','Android >= 4.0'],
        cascade: true
      }))
      .pipe(rename({suffix: '.min'}))
      .pipe(minicss())
      .pipe(gulp.dest('dist/style'))
})

gulp.task('connect', () => {
  connect.server({
    root: './dist',
    port: process.env.port || 4396,
    liveload: true
  })
})

gulp.task('template:w', ['nj-yml', 'assets', 'style'], () => {
  gulp.watch(['template/*/**', 'styles/*/**'], ['nj-yml', 'assets', 'style'])
})

gulp.task('default', ['nj-yml', 'assets', 'style'])
