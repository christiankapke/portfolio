"use strict";
module.exports = function () {
    return {
        "options": {
            "jshintrc": true,
            "reporter": require("jshint-stylish")
        },
        "all": [
            "*{.js,.json}",
            "config/*{.js,.json}",
            "app/lang/**/*.json"
        ]
    };
};
