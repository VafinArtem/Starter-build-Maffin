// TODO: разобраться с normalize

const gulp = require(`gulp`);
const plumber = require(`gulp-plumber`);
const dartSass = require(`sass`);
const gulpSass = require(`gulp-sass`);
const sass = gulpSass(dartSass);
const postcss = require(`gulp-postcss`);
const autoprefixer = require("autoprefixer");
const csso = require("gulp-csso");
const rename = require("gulp-rename");

const styles = () => {
  return gulp
    .src(`source/sass/style.scss`, { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(csso())
    .pipe(rename(`styles.min.css`))
    .pipe(gulp.dest("build/css"));
};

exports.styles = styles;

exports.default = styles;
