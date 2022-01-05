// TODO: разобраться с normalize

const gulp = require(`gulp`);
const plumber = require(`gulp-plumber`);
const dartSass = require(`sass`);
const gulpSass = require(`gulp-sass`);
const sass = gulpSass(dartSass);
const postcss = require(`gulp-postcss`);
const autoprefixer = require(`autoprefixer`);
const csso = require(`gulp-csso`);
const rename = require(`gulp-rename`);
const fileInclude = require(`gulp-file-include`);
const typograf = require("gulp-typograf");

const styles = () => {
  return gulp
    .src(`source/sass/style.scss`, { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(csso())
    .pipe(rename(`styles.min.css`))
    .pipe(gulp.dest(`./build/css`, { sourcemaps: `.` }));
};

exports.styles = styles;

const html = () => {
  return gulp
    .src(`source/html/**/*.html`)
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(
      typograf({
        locale: ["ru", "en-US"],
      })
    )
    .pipe(gulp.dest(`./build`));
};

exports.html = html;

exports.default = gulp.series(styles, html);
