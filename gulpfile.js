let project_folder = "dist";
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
    html: source_folder + "/*.html",
    css: source_folder + "/scss/main.scss",
    js: source_folder + "/js/script.js",
    img: source_folder + "/img/**/*.{jpg,jpeg,png,gif,svg,ico,webp}",
    fonts: source_folder + "/fonts/",
  },
  watch: {
    html: source_folder + "/**/*.html",
    css: source_folder + "/scss/**/*.scss",
    js: source_folder + "js/**/*.js",
    img: source_folder + "img/**/*.{jpg,jpeg,png,gif,svg,ico,webp}"
  },
  clean: "./" + project_folder + "/"
}

let {src, dest} = require("gulp"),
  gulp = require("gulp"),
  browsersync = require("browser-sync").create(),
  del = require("del"),
  scss = require("gulp-sass"),
  autoprefixer = require("gulp-autoprefixer");

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
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}

// * Watching
function files() {
  gulp.watch([path.watch.html],html);
  gulp.watch([path.watch.css],css);
}

// * Deleting dist directory
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
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
}

let build = gulp.series(clean,gulp.parallel(css,html));
let watch = gulp.parallel(build,files,sync);

exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;