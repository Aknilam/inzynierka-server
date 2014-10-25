(function(module, require) {
  'use strict';

  String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
  };

  var path = require('path');

  var base = 'src\\';

  // Lists of files to be used in various build operations.
  var files = {
    // relative to bower_components
    copy: [],
    copy_dir: [],

    // relative to src
    compiler: [],
    ngtemplates: [],

    // all below relative to webclient
    coffee: [],
    jshint_src: [],
    jshint_build: [],
    karma: [],
    less: [],
    watch_dev: []
  };

  // Helpers used to decide which files should be used in which build
  // operations.

  // External dependencies, downloaded using bower.
  // Filename is relative to bower_components directory.
  function dep(filename, destdir, nokarma, ifNotLib) {
    if (!ifNotLib) {
      destdir = 'lib\\' + destdir;
    }

    // If we want to copy whole directory
    if (filename.endsWith('*')) {
      files.copy_dir.push({
        expand: true,
        cwd: 'bower_components\\',
        src: filename,
        dest: base + destdir,
        flatten: true
      });
      return;
    }

    var libname = path.join('lib', path.basename(filename));
    var destname = path.join('', libname);
    var srcname = path.join('bower_components', filename);

    files.copy.push(filename);
    files.watch_dev.push(srcname);

    if (path.extname(filename) === '.js') {
      files.compiler.push(libname);
      if (!nokarma) {
        files.karma.push(base + destname);
      }
    }

    if (path.extname(filename) === '.less' ||
      path.extname(filename) === '.css') {
        files.less.push(base + destname);
    }
  }

  // Our source file, part of the application runtime.
  // Filename is relative to the src directory.
  function src(filename, generated) {
    if (!generated) {
      files.watch_dev.push(filename);
    }

    if (path.extname(filename) === '.js') {
      files.compiler.push(filename);
      if (!generated) {
        files.jshint_src.push(base + filename);
      }
      files.karma.push(base + filename);
    }

    if (path.extname(filename) === '.html') {
      files.karma.push({pattern: base + filename, included: false});
    }

    if (path.extname(filename) === '.coffee') {
      files.coffee.push(filename);
    }

    if (path.extname(filename) === '.less' ||
      path.extname(filename) === '.css') {
        files.less.push(base + filename);
    }
  }

  // An angular partial template file.
  // Filename is relative to the src directory.
  function template(filename) {
    files.ngtemplates.push(filename);
    files.watch_dev.push(base + filename);
  }

  // A file with test cases, part of the quality assurance code. Not a part of
  // application runtime.
  // Filename is relative to the src directory.
  function test(filename, mocks) {
    if (!mocks) {
      files.jshint_src.push(base + filename);
      files.karma.push(base + filename);
    } else {
      files.karma.push(filename);
    }
    files.watch_dev.push(filename);
  }

  // A file only to be watched. Imported as a dependency in another place.
  // Filename is relative to the src directory.
  function watch(filename) {
    files.watch_dev.push(filename);
  }

  // A file related to the build process. Not a part of application runtime.
  // Filename is relative to the src directory.
  function build(filename) {
    files.jshint_build.push(base + filename);
  }

  // Files.
  dep('jquery\\dist\\jquery.js');
  dep('ng-file-upload\\angular-file-upload-shim.js');
  dep('angular\\angular.js');
  dep('bootstrap\\dist\\js\\bootstrap.js');
  // dep('bootstrap\\dist\\css\\bootstrap.css.map');
  dep('angular-bootstrap\\ui-bootstrap.js');
  dep('angular-bootstrap\\ui-bootstrap-tpls.js');
  dep('jquery-ui\\ui\\jquery-ui.js');
  dep('jquery-ui\\themes\\base\\jquery-ui.css');
  dep('jquery-ui\\themes\\base\\images\\*', 'images', undefined, true);

  dep('angular-ui-router\\release\\angular-ui-router.js');

  dep('angular-cookies\\angular-cookies.js');

  dep('leaflet\\dist\\leaflet-src.js');
  dep('leaflet-plugins\\layer\\Marker.Rotate.js');
  dep('leaflet.markercluster\\dist\\leaflet.markercluster-src.js');
  dep('leaflet.markercluster\\dist\\MarkerCluster.css');
  dep('leaflet.markercluster\\dist\\MarkerCluster.Default.css');
  dep('leaflet\\dist\\leaflet.css');
  dep('leaflet\\dist\\images\\*', 'images', undefined, true);
  dep('angular-leaflet-directive\\dist\\angular-leaflet-directive.js');
  dep('ng-file-upload\\angular-file-upload.js');

  dep('underscore\\underscore.js');
  dep('onsenui\\build\\js\\onsenui.js');
  dep('onsenui\\build\\css\\onsenui.css');
  dep('onsenui\\build\\css\\topcoat-mobile-onsen-android4_4.css');
  dep('font-awesome\\css\\font-awesome.css');
  dep('font-awesome\\fonts\\*', 'fonts', undefined, true);

  dep('bootstrap\\dist\\css\\bootstrap.css');
  dep('ng-tags-input\\ng-tags-input.js');
  dep('ng-tags-input\\ng-tags-input.css');
  dep('ng-tags-input\\ng-tags-input.bootstrap.css');

  dep('angular-pageslide-directive\\dist\\angular-pageslide-directive.js');

  dep('CryptoJS\\rollups\\md5.js');

  dep('exif-js\\exif.js');

  src('js\\*.js');
  src('css\\*.css');

  template('templates\\*.html');

  test('bower_components\\angular-mocks\\angular-mocks.js', true);
  test('test\\*.js');

  src('templates.js', true);
  build('Gruntfile.js');

  // Grunt configuration.
  module.exports = function(grunt) {
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      copy: {
        lib: {
          files: [
            {
              expand: true,
              cwd: 'bower_components\\',
              src: files.copy,
              dest: base + 'lib\\',
              flatten: true
            }
          ].concat(files.copy_dir)
        }
      },
      less: {
        src: {
          files: {
            '.\\src\\app.css': files.less
          }
        }
      },
      ngtemplates: {
        src: {
          cwd: 'src',
          src: files.ngtemplates,
          dest: 'src\\templates.js',
          options: {
            module: 'templates',
            standalone: true,
            htmlmin: {
              collapseBooleanAttributes: true,
              collapseWhitespace: true,
              removeAttributeQuotes: true,
              removeComments: true,
              removeEmptyAttributes: true,
              // removes type="text" from input. current css
              // for wh-login-guard directive doesn't like this
              //removeRedundantAttributes: true,
              removeScriptTypeAttributes: true,
              removeStyleLinkTypeAttributes: true
            }
          }
        }
      },
      'closure-compiler': {
        src: {
          cwd: 'src',
          closurePath: '..\\bower_components\\closure-compiler\\' +
                 'compiler.jar',
          js: files.compiler,
          jsOutputFile: 'src\\app.js',
          options: {
            compilation_level: 'WHITESPACE_ONLY',
              //after adding whTimeline, our code doesn't support 'use strict'
            language_in: 'ECMASCRIPT5',//previous: ECMASCRIPT5_STRICT//ECMASCRIPT5
            create_source_map: 'app.js.map',
            source_map_format: 'v3'
          }
        }
      },
      'append-sourcemapping': {
        src: {
          files: {
            'src\\app.js': 'app.js.map'
          }
        }
      },
      jshint: {
        src: {
          options: {
            browser: true,
            globals: {
              angular: true
            }
          },
          files: [
            {
              expand: true,
              src: files.jshint_src
            }
          ]
        },
        build: {
          options: {
            globals: {
              module: false,
              require: false
            }
          },
          files: [
            {
              expand: true,
              src: files.jshint_build
            }
          ]
        }
      },
      gjslint: {
        options: {
          reporter: {
            name: 'console'
          }
        },
        src: {
          src: files.jshint_src
        },
        build: {
          src: files.jshint_build
        }
      },
      karma: {
        options: {
          browsers: ['PhantomJS'],
          frameworks: ['jasmine'],
          files: files.karma
        },
        ci: {
          singleRun: true
        }
      },
      watch: {
        dev: {
          files: files.watch_dev,
          tasks: ['clear', 'ci'],
          options: {
            interrupt: true,
            atBegin: true
          }
        }
      }
    });

    // note: alphabetical order
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-append-sourcemapping');
    grunt.loadNpmTasks('grunt-clear');
    grunt.loadNpmTasks('grunt-closure-compiler');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-gjslint');
    grunt.loadNpmTasks('grunt-karma');

    // safest single-run task
    grunt.registerTask('default', ['ci']);

    // typical developer's watch-based tasks
    grunt.registerTask('dev', ['watch:dev']);

    // typical CI task
    grunt.registerTask('ci', [
      'copy:lib', 'jshint',// 'gjslint',
      'ngtemplates:src', 'less:src', 'closure-compiler:src',
      'append-sourcemapping:src', 'karma:ci']);
  };
}(module, require));

