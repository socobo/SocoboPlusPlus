const gulp = require("gulp");
const ts = require("gulp-typescript");
const watch = require("gulp-watch");

const tsProject = ts.createProject("tsconfig.json");

gulp.task("build", () => {
  return tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest("./dist"));
});

gulp.task("watch", () => {
  gulp.watch("./src/**/*.ts", ["build"]);
});