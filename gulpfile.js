// TODO: разобраться с normalize

const gulp = require(`gulp`);
const plumber = require(`gulp-plumber`);
const rename = require(`gulp-rename`);
const notify = require(`gulp-notify`);

const dartSass = require(`sass`);
const gulpSass = require(`gulp-sass`);
const sass = gulpSass(dartSass);
const postcss = require(`gulp-postcss`);
const autoprefixer = require(`autoprefixer`);
const csso = require(`gulp-csso`);

const fileInclude = require(`gulp-file-include`);
const typograf = require(`gulp-typograf`);

const webpack = require(`webpack-stream`);
const webpackConfig = require(`./webpack.config.js`);

// Styles
const styles = () => {
  return gulp
    .src(`source/sass/style.scss`, { sourcemaps: true })
    .pipe(
      plumber(
        notify.onError({
          title: `Styles`,
          message: `Error: <%= error.message %>`,
        })
      )
    )
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(csso())
    .pipe(rename(`styles.min.css`))
    .pipe(gulp.dest(`./build/css`, { sourcemaps: `.` }));
};

exports.styles = styles;

// Scripts
const scripts = () => {
  return gulp
    .src(`source/js/main.js`)
    .pipe(
      plumber(
        notify.onError({
          title: `JS`,
          message: `Error: <%= error.message %>`,
        })
      )
    )
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(`./build/js`));
};

exports.scripts = scripts;

// Html
const html = () => {
  return gulp
    .src(`source/html/**/*.html`)
    .pipe(
      fileInclude({
        prefix: `@@`,
        basepath: `@file`,
      })
    )
    .pipe(
      typograf({
        locale: [`ru`, `en-US`],
      })
    )
    .pipe(gulp.dest(`./build`));
};

exports.html = html;

exports.default = gulp.series(styles, scripts, html);
