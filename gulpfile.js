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

const imagemin = require(`gulp-imagemin`);
const webp = require(`gulp-webp`);

const svgstore = require(`gulp-svgstore`);
const cheerio = require(`gulp-cheerio`);

// paths
const mainFolders = {
  source: `./source`,
  build: `./build`,
};

const paths = {
  sourceStyles: `${mainFolders.source}/sass/style.scss`,
  buildStyles: `${mainFolders.build}/css`,
  sourceJs: `${mainFolders.source}/js/main.js`,
  buildJs: `${mainFolders.build}/js`,
  sourceHtml: `${mainFolders.source}/html/**/*.html`,
  buildHtml: `${mainFolders.build}`,
  sourceImages: `${mainFolders.source}/img/**/*.{jpg,png,svg}`,
  buildImages: `${mainFolders.build}/img`,
  sourceWebp: `${mainFolders.build}/img/**/*.{jpg,png}`,
  buildWebp: `${mainFolders.build}/img`,
  sourceResources: `${mainFolders.source}/resources/**`,
  buildResources: `${mainFolders.build}`,
  sourceSprite: `${mainFolders.source}/img/svg/icon-*.svg`,
  buildSprite: `${mainFolders.build}/img`,
};

// Styles
const styles = () => {
  return gulp
    .src(paths.sourceStyles, { sourcemaps: true })
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
    .pipe(gulp.dest(paths.buildStyles, { sourcemaps: `.` }));
};

exports.styles = styles;

// Scripts
const scripts = () => {
  return gulp
    .src(paths.sourceJs)
    .pipe(
      plumber(
        notify.onError({
          title: `JS`,
          message: `Error: <%= error.message %>`,
        })
      )
    )
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(paths.buildJs));
};

exports.scripts = scripts;

// Html
const html = () => {
  return gulp
    .src(paths.sourceHtml)
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
    .pipe(gulp.dest(paths.buildHtml));
};

exports.html = html;

// Images
const images = () => {
  return gulp
    .src(paths.sourceImages)
    .pipe(
      imagemin([
        imagemin.optipng({ optimizationLevel: 3 }),
        imagemin.mozjpeg({ quality: 90, progressive: true }),
        imagemin.svgo({
          plugins: [
            {
              removeDimensions: true,
            },
          ],
        }),
      ])
    )
    .pipe(gulp.dest(paths.buildImages));
};

exports.images = images;

// Webp
const webpImages = () => {
  return gulp
    .src(paths.sourceWebp)
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest(paths.buildWebp));
};

exports.webp = webpImages;

// Sprite
const sprite = () => {
  return gulp
    .src(paths.sourceSprite)
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(
      cheerio({
        run: ($) => {
          $(`symbol`).attr(`fill`, `none`);
        },
        parserOptions: { xmlMode: true },
      })
    )
    .pipe(rename(`sprite.svg`))
    .pipe(gulp.dest(paths.buildSprite));
};

exports.sprite = sprite;

// Resources
const resources = () => {
  return gulp.src(paths.sourceResources).pipe(gulp.dest(paths.buildResources));
};

exports.resources = resources;

exports.default = gulp.series(styles, scripts, html);
