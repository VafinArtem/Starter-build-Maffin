const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const resolveUrl = require('gulp-resolve-url');
const sync = require("browser-sync").create();
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const uglify = require("gulp-uglify-es").default;
const imagemin = require("gulp-imagemin");
const svgstore = require("gulp-svgstore");
const webp = require("gulp-webp");
const del = require("del");

// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(resolveUrl())
    .pipe(rename("styles.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename("styles.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream())
}

exports.styles = styles;

// Images

const images = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.mozjpeg({ quality: 90, progressive: true }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: false }
        ]
      })
    ]))
    .pipe(gulp.dest("source/img"))
}

exports.images = images;

// Sprite

const sprite = () => {
  return gulp.src("source/img/**/icon-*.svg")
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"))
}

exports.sprite = sprite;

// WebP

const iwebp = () => {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest("source/img"))
}

exports.webp = iwebp;

// Copy

const copy = () => {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"))
}

exports.copy = copy;

// HTML

const html = () => {
  return gulp.src("source/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"))
    .pipe(sync.stream())
}

exports.html = html;

// JS

const js = () => {
  return gulp.src("source/js/script.js")
    .pipe(rename("script.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("build/js"))
    .pipe(sync.stream());
}

exports.js = js;

// Delete

const clean = () => {
  return del("build");
}

exports.clean = clean;

// Build

const build = (done) => gulp.series(clean, copy, styles, html, js, sprite)(done);
exports.build = build;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: "build"
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/js/*.js", gulp.series("js"));
  gulp.watch("source/*.html", gulp.series("html"));
}

exports.default = gulp.series(
  build, server, watcher
);
