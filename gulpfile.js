let project_folder = "dist";
// ! let project_folder = require("path").basename(__dirname);
let source_folder = "src";
let path = {
  build: {
    html: project_folder + "/",
    css: project_folder + "/css/",
    js: project_folder + "/js/",
    img: project_folder + "/img/",
    fonts: project_folder + "/fonts/",
  },
  src: {
    html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
    css: source_folder + "/scss/main.scss",
    js: source_folder + "/js/script.js",
    img: source_folder + "/img/**/*.{jpg,jpeg,png,gif,svg,ico,webp}",
    fonts: source_folder + "/fonts/**/*",
  },
  watch: {
    html: source_folder + "/**/*.html",
    css: source_folder + "/scss/**/*.scss",
    js: source_folder + "js/**/*.js",
    img: source_folder + "img/**/*.{jpg,jpeg,png,gif,svg,ico,webp}",
    fonts: source_folder + "/fonts/"
  },
  clean: "./" + project_folder + "/"
}

let {src, dest} = require("gulp"),
  gulp = require("gulp"),
  browsersync = require("browser-sync").create(),
  del = require("del"),
  scss = require("gulp-sass"),
  autoprefixer = require("gulp-autoprefixer"),
  fileinclude = require("gulp-file-include"),
  media = require("gulp-group-css-media-queries"),
  cssmin = require("gulp-clean-css"),
  rename = require("gulp-rename"),
  jsmin = require("gulp-uglify-es").default,
  imagemin = require("gulp-imagemin");
  /* webp = require("gulp-webp"),
  webphtml = require("gulp-webp-html") */

// * Syncing with browsers
function sync() {
  browsersync.init({
    server: {
      baseDir: "./" + project_folder + "/"
    },
    port: 3000,
    notify: false,
    browser: "firefox"
  })
}

// * Creating dist directory
function html() {
  return src(path.src.html)
    .pipe(fileinclude())
    // .pipe(webphtml())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}

// * Watching
function files() {
  gulp.watch([path.watch.html],html);
  gulp.watch([path.watch.css],css);
  gulp.watch([path.watch.js],js);
  gulp.watch([path.watch.img],images);
  gulp.watch([path.watch.fonts],fonts);
}

// ! Deleting dist directory
function clean() {
  return del(path.clean);
}

// * SCSS converting
function css() {
  return src(path.src.css)
    .pipe(scss({
      outputStyle: "expanded"
    }))
    .pipe(autoprefixer({
      overrideBrowserslist: ["last 5 versions"],
      cascade: true
    }))
    .pipe(media())
    .pipe(dest(path.build.css))
    .pipe(cssmin())
    .pipe(rename({
      extname: ".min.css"
    }))
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
}

// * JavaScript
function js() {
  return src(path.src.js)
    .pipe(fileinclude())
    .pipe(dest(path.build.js))
    .pipe(jsmin())
    .pipe(rename({
      extname: ".min.js"
    }))
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
}

// * Images
function images() {
  return src(path.src.img)
    /* .pipe(webp({
      quality: 80
    }))
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img)) */
    .pipe(imagemin({
      progressive: true,
      interlaced: true,
      optimizationLevel: 3
    }))
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
}

// * Fonts
function fonts() {
  return src(path.src.fonts)
    .pipe(dest(path.build.fonts))
    .pipe(browsersync.stream())
}

let build = gulp.series(clean,gulp.parallel(fonts,images,js,css,html));
let watch = gulp.parallel(build,files,sync);

exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;