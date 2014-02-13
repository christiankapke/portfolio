"use strict";
module.exports = function (grunt) {

    // Load grunt tasks
    require("load-grunt-tasks")(grunt);
    // Activate timing
    require("time-grunt")(grunt);

    // Load configs from `config` dir
    var configs = require("load-grunt-configs")(grunt);

    grunt.initConfig(configs);

    // Default development task. Just type "grunt" into prompt
    // It will start an local webserver and likewise the watch task
    grunt.registerTask("default", ["connect:dev", "watch"]);

    // Initialization task
    grunt.registerTask("init", [
        "copy:init",
        "bake:de",
        "replace",
        "concat",
        "less",
        "compress:svg"
    ]);

    // Test task, currently used by `npm test` and hence TravisCI
    grunt.registerTask("test", [
        "copy:public",
        "bake",
        "replace",
        "processhtml",
        "less",
        "uncss",
        "clean:public",
        "cssmin",
        "uglify",
        "compress:svg",
        "svg2png",
        "imagemin",
        "htmlmin",
        "htmlhint"
    ]);

    // Running `grunt public` to generate the final `public version for live deployment
    grunt.registerTask("public", [
        "test",
        "open:public",
        "connect:public:keepalive"
    ]);

    // Running `grunt live` to push the `public` version to the FTP server
    grunt.registerTask("live", [
        "ftp-deploy:live",
        "clean:live",
        "bumpup",
        "open:live"
    ]);

};
