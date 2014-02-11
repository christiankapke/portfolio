module.exports = function(grunt) {

  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
  
  grunt.loadNpmTasks('grunt-jquerybuilder');
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    //
    // --------------------------
    // DEVELOPMENT TASKS
    // --------------------------

    // Copy files and folders
    copy: {
      init: {
        files: [
          // Copy stuff to dev folder
          {
            expand: true, cwd: 'app/', src: ['fonts/**'], dest: 'dev/css/'
          },
          {
            expand: true, cwd: 'app/', src: ['img/*.*'], dest: 'dev/', filter: 'isFile'
          },
          {
            expand: true, cwd: 'app/', src: ['.htaccess', 'robots.txt', 'sitemap.xml'], dest: 'dev/', filter: 'isFile'
          },
        ]
      },
      public: {
        files: [
           // Copy stuff to public folder
          {
            expand: true, cwd: 'dev/css/', src: ['fonts/**'], dest: 'public/css/'
          },
          {
            expand: true, cwd: 'dev/', src: ['img/**'], dest: 'public/'
          },
          {
            expand: true, cwd: 'dev/', src: ['.htaccess', 'robots.txt', 'sitemap.xml'], dest: 'public/', filter: 'isFile'
          },
        ]
      },
    },

    // Compile less-files
    less: {
      css: {
        files: {
          'dev/css/main.css': 'app/less/main.less'
        }
      }
    },

    // Templating & localization
    bake: {
      de: {
        options: {
          content: "app/lang/language.json",
          section: "de"
        },
        files: {
          "dev/index.html": "app/index.html",
        }
      },
      en: {
        options: {
          content: "app/lang/language.json",
          section: "en"
        },
        files: {
          "dev/index_en.html": "app/index.html",
        }
      }
    },

    // Process HTML
    processhtml: {
      dev: {
        options: {
          process: true
        },
        files: {
          'dev/index.html': ['dev/index.html'],
          'dev/index_en.html': ['dev/index_en.html']
        }
      },
      public: {
        options: {
          process: true
        },
        files: {
          'public/index.html': ['dev/index.html'],
          'public/index_en.html': ['dev/index_en.html']
        }
      },
    },

    // Merge JavaScript files
    concat: {
      js: {
        // predefines the order of merging
        src: ['app/js/jquery.custom.js', 'app/js/bootstrap.js', 'app/js/lazyload.js', 'app/js/collapse.js', 'app/js/script.js'],
        dest: 'dev/js/main.js',
      }
    },

    // Compress vector images
    compress: {
      svg: {
        options: {
          mode: 'gzip'
        },
        files: [
          {
            expand: true,
            cwd: 'app/img/svg/',
            src: '*.svg',
            dest: 'dev/img/',
            ext: '.svgz'
          }
        ]
      }
    },

    //
    // ------------------
    // DEPLOYMENT TASKS
    // ------------------

    // Remove unused CSS
    uncss: {
      dist: {
        files: {
          'public/css/main.clean.min.css': ['dev/index.html']
        }
      },
      options: {
        ignore: [
        '.carousel-inner > .item',
        '.carousel-inner .active',
        '.info-txt a',
        '.carousel-inner > .active.left',
        '.carousel-inner > .active.right',
        '.carousel-inner > .item > img',
        '.carousel-inner > .active',
        '.carousel-inner > .next',
        '.carousel-inner > .prev',
        '.carousel-inner > .next.left',
        '.carousel-inner > .prev.right',
        '.carousel-inner > .item > a > img',
        '.site-header .link.enabled',
        '.lang-en .active-en',
        '.show'
        ]
      }
    },

    // Minify CSS
    cssmin: {
      minify: {
        options: {
          noAdvanced: true
        },
        expand: true,
        cwd: 'public/css/',
        src: ['main.clean.min.css'],
        dest: 'public/css/',
      }
    },

    // Minify Javascript
    uglify: {
      my_target: {
        files: {
          'public/js/main.min.js': 'dev/js/main.js'
        }
      }
    },

    // Fallback for SVG files
    svg2png: {
      all: {
        // specify files in array format with multiple src-dest mapping
        files: [
          // rasterize all SVG files in "img" and its subdirectories to "img/png"
          {
            src: ['app/img/svg/*.svg'], dest: 'public/img/png/'
          }
        ]
      }
    },

    // Optimization of pixel images
    imagemin: {
      dynamic: {
        options: {
          optimizationLevel: 3
        },
        files: [{
          expand: true,
          cwd: 'public/img',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'public/img'
        }]
      }
    },

    // Minify HTML
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'public/index.html': 'public/index.html',
          'public/index_en.html': 'public/index_en.html'
        }
      }
    },

    ///////////////////////////////////////

    // Validate HTML
    htmlhint: {
      build: {
        options: {
          'tag-pair': true,
          'tagname-lowercase': true,
          'attr-lowercase': true,
          'attr-value-double-quotes': true,
          'doctype-first': true,
          'spec-char-escape': true,
          'id-unique': true,
          'head-script-disabled': true,
          'style-disabled': true
        },
        src: ['public/index.html', 'dev/index.html']
      }
    },

    // Validate Javascript
    jshint: {
     all: ['gruntfile.js', 'app/lang/**/*.json']
    },

    //
    // -------------------
    // ROLLOUT: LIVE
    // -------------------

    // Deploy the 'public' package to FTP-Server
    'ftp-deploy': {
      live: {
        auth: {
          host: 'srv17.domainssaubillig.de',
          port: 21,
          authKey: 'key1'
        },
        src: 'public/',
        dest: 'htdocs/ckapke',
      }
    },

    // Opens the compiled project directly in browser
    open: {
      public: {
        path : 'http://localhost:8090'
      },
      live: {
        path : 'http://ckapke.de/'
      }
    },

    // Remove no more needed files and folders
    clean: {
      public: ['public/css/main.css', 'public/js/main.js'],
      live: ['public/']
    },

    //
    //--------------------------
    // Release stuff
    //--------------------------

    // Web Server
    connect: {
      dev: {
        options: {
          port: 8089,
          base: 'dev'
        }
      },
      public: {
        options: {
          port: 8090,
          base: 'public'
        },
        open: {
          target: 'http://localhost:8090', // target url to open
          appName: 'open', // name of the app that opens, ie: open, start, xdg-open
          callback: function() {} // called when the app has opened
        }
      }
    },

    // Bumup the current release version in package.json and bower.json
    bumpup: {
        files: ['package.json', 'bower.json']
    },

    // Write current version number to template (taken from package.json)
    replace: {
      dev: {
        src: ['dev/*.html'],
        dest: 'dev/',
        replacements: [{
          from: '{{%release.version%}}',
          to: "<%= pkg.version %>"
        }]
      }
    },

    // jQuery custum package builder
    jquery: {
      // the parts you want to exclude from your build
      // possible values ['ajax', 'css', 'deprecated', 'dimensions', 'effects', 'offset']
      exclude: ['ajax', 'deprecated'],
      // the jQuery version (currently only 1.8.3 is supported) - defaults to 1.8.3
      version: '1.8.3',
      // output location (relative to your grunt.js file location)
      dest: 'app/js/jquery.custom.js',
      // minify the output (true or false) - defaults to false
      minify: true
    },

    // Running `grunt watch` will watch for changes
    watch: {
      // Activate live reloading
      options: {
        livereload: true,
      },
      // Check for changes in /app/index.html
      // save result to /dev/index.html
      index: {
        files: ['app/index.html'],
        tasks: ['processhtml:dev', 'bake', 'replace', 'less', 'concat', 'htmlhint'],
      },
      // Check for changes in /app/templates/*.* or /app/lang/**,
      // save chages to /dev/index.html
      bake: {
        files: ['app/templates/**', 'app/lang/**'],
        tasks: ['bake', 'replace', 'htmlhint'],
      },
      // Check for changes in /app/img/ or /app/fonts/,
      // save changes to /dev/**
      copy: {
          files: ['app/img/**', 'app/fonts/**'],
          tasks: ['copy:init'],
      },
      // Check for changes in /app/img/svg/,
      // create new files in /dev/img/ *.svgz
      svg: {
          files: ['app/img/svg/*.svg'],
          tasks: ['compress:svg'],
      },
      // Check for changes in app/less/**/*.less,
      // compiled version will saved in dev/css/main.css
      less: {
          files: ['app/less/**/*.less'],
          tasks: ['less'],
      },
      // Check for changes in /app/js/**/*.js
      // changes will be saved in /dev/js
      jshint: {
          files: ['app/lang/*.json', 'gruntfile.js', 'bower.json', 'package.json'],
          tasks: ['jshint'],
      },
      concat: {
          files: ['app/js/**/*.js'],
          tasks: ['concat'],
      }
    }
});

  // Default development task. Just type 'grunt' into prompt
  // It will start an local webserver and likewise the watch task
  grunt.registerTask('default', ['connect:dev', 'watch']);

  // Initialization task
    grunt.registerTask('init', [
                              'copy:init',
                              'bake:de',
                              'replace',
                              'jquery',
                              'concat',
                              'less',
                              'compress:svg'
                              ]);

  // Running `grunt deploy` to generate the final public version for live deployment
  grunt.registerTask('public', [
                                'copy:public',
                                'bake',
                                'replace',
                                'processhtml',
                                'less',
                                'uncss',
                                'clean:public',
                                'cssmin',
                                'uglify',
                                'compress:svg',
                                'svg2png',
                                'imagemin',
                                'htmlmin',
                                'htmlhint',
                                'open:public',
                                'connect:public:keepalive'
                                ]);

  grunt.registerTask('test', [
                                'copy:public',
                                'bake',
                                'replace',
                                'processhtml',
                                'less',
                                'uncss',
                                'clean:public',
                                'cssmin',
                                'uglify',
                                'compress:svg',
                                'svg2png',
                                'imagemin',
                                'htmlmin',
                                'htmlhint'
                                ]);

  // Running `grunt live` to push the `public` version to the FTP server
  grunt.registerTask('live', [
                              'ftp-deploy:live',
                              'clean:live',
                              'bumpup',
                              'open:live'
                              ]);

};
