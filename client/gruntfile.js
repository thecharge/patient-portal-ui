/**
 * These Grunt build scrips are based on famous ngbp, angular-app and yo angular generated template
 * which is based on angular-seed
 */

'use strict';

module.exports = function (grunt) {
    /**
     * Load required Grunt tasks. These are installed based on the versions listed
     * in `package.json` when you do `npm install` in this directory.
     * Load multiple grunt plugin tasks using globbing patterns.
     */
    require('load-grunt-tasks')(grunt);

    require('time-grunt')(grunt);
    /**
     * Load in our build configuration file.
     */
    var userConfig = require('./build.config.js');
    /**
     * This is the configuration object Grunt uses to give each plugin its
     * instructions.
     */
    var taskConfig = {
        /**
         * We read in our `package.json` file so we can access the package name and
         * version. It's already there, so we don't repeat ourselves here.
         */
        pkg: grunt.file.readJSON("package.json"),
        /**
         * The banner is the comment that is placed at the top of our compiled
         * source files. It is first processed as a Grunt template, where the `<%=`
         * pairs are evaluated based on this very configuration object.
         */
        meta: {
            banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.map(pkg.licenses, "type").join(", ") %> */\n'
        },
        /**
         * Increments the version number, etc.
         */
        bump: {
            options: {
                files: ["package.json"],
                commit: false,
                commitMessage: 'chore(release): v%VERSION%',
                commitFiles: ["package.json"],
                createTag: false,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: false,
                pushTo: 'origin'
            }
        },
        /**
         * Should use above clean task configuration. But
         * we are using WebStorm's functionalities provided for karma.
         * Once Run 'karma.conf.js' in WebStorm target/debug folder is locked and can not delete it.
         * We make a comprise here for cleaning: everyting in the target folder will be cleared except debug folder itself.
         */
        clean: {
            all: {
                src: ['<%= build_dir %>**', '<%= build_reports_dir %>', 'app_ts/**/*.js', 'app_ts/**/*.map']
            }
        },
        /**
         * The `copy` task just copies files from A to B. We use it here to copy
         * our project assets (images, fonts, etc.) and javascripts into
         * `build_debug_dir`, and then to copy the assets to `build_dist_dir`.
         */
        copy: {
            build_app_assets: {
                files: [
                    {
                        src: ['**'],
                        dest: '<%= build_debug_dir %>/assets/',
                        cwd: 'assets',
                        expand: true
                    }
                ]
            },
            build_vendor_assets: {
                files: [
                    {
                        src: ['<%= vendor_files.assets %>'],
                        dest: '<%= build_debug_dir %>/assets/',
                        cwd: '.',
                        expand: true,
                        flatten: true
                    }
                ]
            },
            build_configInitializationjs: {
                files: [
                    {
                        src: ['<%= configInitialization_files.js %>'],
                        dest: '<%= build_debug_dir %>/',
                        cwd: '.',
                        expand: true
                    }
                ]
            },
            build_appjs: {
                files: [
                    {
                        src: ['<%= app_files.js %>'],
                        dest: '<%= build_debug_dir %>/',
                        cwd: '.',
                        expand: true
                    }
                ]
            },
            build_appjs_generated: {
                files: [
                    {
                        src: ['<%= app_files.js_generated %>'],
                        dest: '<%= build_debug_dir %>/',
                        cwd: '.',
                        expand: true
                    }
                ]
            },
            build_appjsmap_generated: {
                files: [
                    {
                        src: ['<%= app_files.jsmap_generated %>'],
                        dest: '<%= build_debug_dir %>/',
                        cwd: '.',
                        expand: true
                    }
                ]
            },
            build_systemjs_resources: {
                files: [
                    {
                        src: ['<%= system_resources.js %>'],
                        dest: '<%= build_debug_dir %>/',
                        cwd: '.',
                        expand: true
                    }
                ]
            },
            build_tpl: {
                files: [
                    {
                        src: ['<%= app_files.atpl %>'],
                        dest: '<%= build_debug_dir %>/',
                        cwd: '.',
                        expand: true
                    }
                ]
            },
            build_vendorjs: {
                files: [
                    {
                        src: ['<%= vendor_files.js %>'],
                        dest: '<%= build_debug_dir %>/',
                        cwd: '.',
                        expand: true
                    }
                ]
            },
            compile_assets: {
                files: [
                    {
                        src: ['**'],
                        dest: '<%= build_dist_dir %>/assets',
                        cwd: '<%= build_debug_dir %>/assets',
                        expand: true
                    }
                ]
            },
            angular2_lib: {
                files: [
                    {
                        src: ['<%= vendor_files.angular2_lib %>'],
                        dest: '<%= build_debug_dir %>/',
                        cwd: '.',
                        expand: true
                    }
                ]
            }
        },

        /**
         * `grunt concat` concatenates multiple source files into a single file.
         */
        concat: {
            /**
             * The `build_css` target concatenates compiled CSS and vendor CSS
             * together.
             */
            build_css: {
                src: [
                    '<%= vendor_files.css %>',
                    '<%= recess.build.dest %>'
                ],
                dest: '<%= recess.build.dest %>'
            },
            /**
             * The `compile_js` target is the concatenation of our application source
             * code and all specified vendor source code into a single file.
             */
            compile_js: {
                options: {
                    banner: '<%= meta.banner %>',
                    stripBanners: true,
                    // Replace all 'use strict' statements in the code except the one in module.prefix file
                    process: function (src, filepath) {
                        console.log(filepath);
                        if (filepath.indexOf('module.prefix') !== -1) {
                            return src;
                        }
                        return '// Source: ' + filepath + '\n' +
                            src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                    }
                },
                src: [
                    '<%= vendor_files.js %>',
                    '<%= build_debug_dir %>/app/**/*.js',
                    '<%= html2js.app.dest %>'
                ],
                dest: '<%= build_dist_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js'
            }
        },
        /**
         * Minify the sources!
         */
        uglify: {
            compile: {
                options: {
                    banner: '<%= meta.banner %>'
                },
                files: {
                    '<%= concat.compile_js.dest %>': '<%= concat.compile_js.dest %>'
                }
            }
        },
        /**
         * `recess` handles our LESS compilation and uglification automatically.
         * Only our `main.less` file is included in compilation; all other files
         * must be imported from this file.
         */
        recess: {
            build: {
                src: ['<%= app_files.less %>'],
                dest: '<%= build_debug_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css',
                options: {
                    compile: true,
                    compress: false,
                    noUnderscores: false,
                    noIDs: false,
                    zeroUnits: false
                }
            },
            compile: {
                src: ['<%= recess.build.dest %>'],
                dest: '<%= recess.build.dest %>',
                options: {
                    compile: true,
                    compress: false,
                    noUnderscores: false,
                    noIDs: false,
                    zeroUnits: false
                }
            }
        },
        cssmin: {
            target: {
                files: [{
                    src: ['<%= recess.build.dest %>'],
                    dest: '<%= recess.build.dest %>'
                }]
            }
        },
        /**
         * `jshint` defines the rules of our linter as well as which files we
         * should check. This file, all javascript sources, and all our unit tests
         * are linted based on the policies listed in `options`. But we can also
         * specify exclusionary patterns by prefixing them with an exclamation
         * point (!); this is useful when code comes from a third party but is
         * nonetheless inside `src/`.
         */
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            src: [
                '<%= app_files.js %>'
            ],
            test: [
                '<%= app_files.jsunit %>'
            ],
            gruntfile: [
                'gruntfile.js'
            ]
            /*
             // The problem here is that ci target doesn't support two reports. i.e. we want report in file, but also we want report on the console
             ci:{
             options: {
             reporter: 'checkstyle',
             reporterOutput: "<%= build_reports_dir %>/jslint/jshint-checkstyle-rpt.xml"
             //checkstyle: '.out/client-checkstyle.xml' // write a checkstyle-XML, does not work
             },
             src: ['<%= app_files.js %>', '<%= app_files.jsunit %>', 'Gruntfile.js']
             }*/
        },
        /**
         * HTML2JS is a Grunt plugin that takes all of your template files and
         * places them into JavaScript files as strings that are added to
         * AngularJS's template cache. This means that the templates too become
         * part of the initial payload as one JavaScript file. Neat!
         */
        html2js: {
            /**
             * These are the templates from `App`.
             */
            app: {
                options: {
                    base: '.'
                },
                src: ['<%= app_files.atpl %>'],
                dest: '<%= build_debug_dir %>/templates-app.module.js'
            }
        },
        /**
         * The Karma configurations.
         */
        karma: {
            options: {
                configFile: '<%= build_debug_dir %>/<%= karma_conf_file %>'
            },
            // This is the target used in alias tasks: build:debug and build:dist
            unit: {
                singleRun: true,
                reporters: ['dots']
            },
            // gWatch target is for grunt watch
            // Karma Server with Grunt Watch is the preferred method for development
            gWatch: {
                runnerPort: 9101,
                background: true, // The background option will tell grunt to run karma in a child process so it doesn't block subsequent grunt tasks
                singleRun: false,
                autoWatch: false,
                browsers: ['PhantomJS_custom']
            },
            // ci target is for CI
            ci: {
                singleRun: true,
                reporters: ['dots', 'junit', 'coverage'],
                junitReporter: {
                    outputFile: '<%= build_reports_dir %>/unit/test-result.xml'
                },
                coverageReporter: {
                    type: 'html',
                    dir: '<%= build_reports_dir %>/unit/coverage/'
                },
                browsers: ['PhantomJS_custom'] //'IE' doesn't work   ['Chrome', 'Firefox']
            },
            // This watch can be run by itself, but cannot run with Grunt Watch.
            // And can be used for debug (open the development tools in chrome, insert debugger statement in js script)
            watch: {
                singleRun: false,
                autoWatch: true,
                background: false,
                browsers: ['Chrome']
            }
        },
        /**
         * The `index` task compiles the `index.html` file as a Grunt template. CSS
         * and JS files co-exist here but they get split apart later.
         */
        index: {
            /**
             * During development, we don't want to have wait for compilation,
             * concatenation, minification, etc. So to avoid these steps, we simply
             * add all script files directly to the `<head>` of `index.html`. The
             * `src` property contains the list of included files.
             */
            build: {
                dir: '<%= build_debug_dir %>',
                src: [
                    '<%= vendor_files.js %>',
                    '<%= recess.build.dest %>'
                ]
            },
            /**
             * When it is time to have a completely compiled application, we can
             * alter the above to include only a single JavaScript and a single CSS
             * file. Now we're back!
             */
            compile: {
                dir: '<%= build_dist_dir %>',
                src: [
                    '<%= concat.compile_js.dest %>',
                    '<%= recess.compile.dest %>'
                ]
            }
        },
        /**
         * This task compiles the karma template so that changes to its file array
         * don't have to be managed manually.
         */
        karmaconfig: {
            unit: {
                dir: '<%= build_debug_dir %>',
                src: [
                    '<%= vendor_files.js %>',
                    '<%= html2js.app.dest %>',
                    '<%= test_files.js %>'
                ]
            }
        },
        /**
         * And for rapid development, we have a watch set up that checks to see if
         * any of the files listed below change, and then to execute the listed
         * tasks when they do. This just saves us from having to type "grunt" into
         * the command-line every time we want to see what we're working on; we can
         * instead just leave "grunt watch" running in a background terminal. Set it
         * and forget it, as Ron Popeil used to tell us.
         *
         * But we don't need the same thing to happen for all the files.
         */
        delta: {
            /**
             * By default, we want the Live Reload to work for all tasks; this is
             * overridden in some tasks (like this file) where browser resources are
             * unaffected. It runs by default on port 35729, which your browser
             * plugin should auto-detect.
             */
            options: {
                livereload: true
            },
            /**
             * When the Gruntfile changes, we just want to lint it. In fact, when
             * your Gruntfile changes, it will automatically be reloaded!
             */
            gruntfile: {
                files: 'Gruntfile.js',
                tasks: ['jshint:gruntfile'],
                options: {
                    livereload: false
                }
            },
            /**
             * When our JavaScript source files change, we want to run lint them and
             * run our unit tests.
             */
            jssrc: {
                files: [
                    '<%= app_files.js %>'
                ],
                tasks: ['jshint:src', 'karma:gWatch:run', 'copy:build_appjs']
            },
            /**
             * When Assets are changed, copy them. Note that this will *not* copy new
             * files, so this is probably not very useful.
             */
            assets: {
                files: [
                    'assets/**/*'
                ],
                tasks: ['copy:build_Assets']
            },
            /**
             * When index.html changes, we need to compile it.
             */
            html: {
                files: ['<%= app_files.html %>'],
                tasks: ['index:build']
            },
            /**
             * When our templates change, we only rewrite the template cache.
             */
            tpls: {
                files: ['<%= app_files.atpl %>'],
                tasks: ['html2js']
            },
            /**
             * When the CSS files change, we need to compile and minify them.
             */
            less: {
                files: ['src/**/*.less'],
                tasks: ['recess:build']
            },
            /**
             * When a JavaScript unit test file changes, we only want to lint it and
             * run the unit tests. We don't want to do any live reloading.
             */
            jsunit: {
                files: [
                    '<%= app_files.jsunit %>'
                ],
                tasks: ['jshint:test', 'karma:gWatch:run'],
                options: {
                    livereload: false
                }
            }
        },
        compress: {
            dist: {
                options: {
                    archive: '<%= build_dir %>/<%= pkg.name %>-<%= pkg.version %>.tar.gz'
                },
                files: [
                    {
                        expand: true,
                        cwd: '',
                        src: ['<%= build_debug_dir %>/**/*', '<%= build_dist_dir %>/**/*']
                    }
                ]
            }
        },
        ngconstant: {
            options: {
                space: '  ',
                wrap: '"use strict";\n\n {%= __ngModule %}',
                name: 'app.config',
                dest: '<%= config_dir %>/config.js'
            },
            app: {
                constants: {
                    envService: {
                        version: '<%= pkg.version %>'
                    }
                }
            }
        },
        /*
         * Build a WAR (web archive) without Maven or the JVM installed.
         */
        war: {
            target: {
                options: {
                    war_dist_folder: '<%= build_war_dir %>', /* Folder where to generate the WAR. */
                    war_name: '<%= pkg.name %>', /* The name fo the WAR file (.war will be the extension) */
                    webxml_display_name: '<%= pkg.name %>'
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= build_debug_dir %>',
                        src: ['**'],
                        dest: ''
                    }
                ]
            }
        },
        ngAnnotate: {
            options: {
                remove: true,
                add: true,
                singleQuotes: true
            },
            compile: {
                files: [
                    {
                        expand: true,
                        src: ['<%= app_files.debug_js %>']
                    }
                ]
            }
        },
        angularFileLoader: {
            options: {
                scripts: ['<%= app_files.debug_js %>']
            },
            compile: {
                src: ['<%= build_debug_dir %>/index.html']
            }
        },
        typings: {
            install: {}
        },
        ts: {
            default: {
                src: [
                    "app_ts/**/*.ts",
                    "!node_modules/**", "!target/**", "!vendor/**", "!protractor/**", "!resources/**",
                    "!node/**", "!less/**", "!karma/**", "!assets/**", "!app/**/*.js",
                    "typings/globals/angular/*.d.ts", "typings/globals/jquery/*.d.ts", "typings/globals/es6-shim/*.d.ts"
                ],
                dest: "app_ts/",
                options: {
                    module: 'commonjs',
                    moduleResolution: 'node',
                    target: 'ES5',
                    sourceMap: true,
                    experimentalDecorators: true,
                    emitDecoratorMetadata: true,
                    removeComments: false,
                    noImplicitAny: false,
                    lib: ['es2015', 'dom']
                }
            }
        }
    };
    grunt.initConfig(grunt.util._.extend(taskConfig, userConfig));
    /**
     * A utility function to get all app JavaScript sources.
     */
    function filterForJS(files) {
        return files.filter(function (file) {
            return file.match(/\.js$/);
        });
    }

    /**
     * A utility function to get all app CSS sources.
     */
    function filterForCSS(files) {
        return files.filter(function (file) {
            return file.match(/\.css$/);
        });
    }

    /**
     * The index.html template includes the stylesheet and javascript sources
     * based on dynamic names calculated in this Gruntfile. This task assembles
     * the list into variables for the template to use and then runs the
     * compilation.
     */
    grunt.registerMultiTask('index', 'Process index.html template', function () {
        var dirRE = new RegExp('^(' + grunt.config('build_debug_dir') + '|' + grunt.config('build_dist_dir') + ')\/', 'g');
        var jsFiles = filterForJS(this.filesSrc).map(function (file) {
            return file.replace(dirRE, '');
        });
        var cssFiles = filterForCSS(this.filesSrc).map(function (file) {
            return file.replace(dirRE, '');
        });

        grunt.file.copy('index.html', this.data.dir + '/index.html', {
            process: function (contents, path) {
                return grunt.template.process(contents, {
                    data: {
                        scripts: jsFiles,
                        styles: cssFiles,
                        version: grunt.config('pkg.version')
                    }
                });
            }
        });
    });
    /**
     * In order to avoid having to specify manually the files needed for karma to
     * run, we use grunt to manage the list for us. The `karma/*` files are
     * compiled as grunt templates for use by Karma. Yay!
     */
    grunt.registerMultiTask('karmaconfig', 'Process karma config templates', function () {
        var jsFiles = filterForJS(this.filesSrc);

        var filePath = grunt.config('build_debug_dir') + '/' + grunt.config('karma_conf_file');

        grunt.file.copy('karma/karma.conf.tpl.js', filePath, {
            process: function (contents, path) {
                return grunt.template.process(contents, {
                    data: {
                        scripts: jsFiles
                    }
                });
            }
        });

        grunt.log.oklns('Created karma configuration file as ' + filePath);
    });
    grunt.registerTask('jshint-all', ['jshint:src', 'jshint:test', 'jshint:gruntfile']);

    /**
     * The `compile` task gets your app ready for deployment by concatenating and
     * minifying your code.
     */
    grunt.registerTask('compile', [
        'cssmin', 'copy:compile_assets', 'ngAnnotate', 'concat:compile_js', 'uglify', 'index:compile'
    ]);
    // Alias task for karma:watch. Run this task after grunt build
    grunt.registerTask('karma-watch', ['karma:watch']);
    /**
     * The `build` task gets your app ready to run for development and testing.
     */
    grunt.registerTask('build-debug', 'build:debug');
    /**
     * Snake case build:dist
     */
    grunt.registerTask('build-dist', 'build:dist');
    /**
     * Snake case build:ci
     */
    grunt.registerTask('build-ci', 'build:ci');

    grunt.registerTask('version', 'Shows version number', function () {
        var pkg = grunt.file.readJSON('package.json');
        console.log(pkg.name, pkg.version);
    });
    /**
     * build task supporting multiple targets, but it is not multi-target task
     */
    grunt.registerTask('build', function (target) {
        var targetEnum = {
            debug: 'debug',
            dist: 'dist',
            ci: 'ci'
        };

        var taskList;

        taskList = ['clean'];

        taskList.push(
            'typings',
            'ts:default',
            'html2js',
            'jshint-all',
            'recess:build',
            'ngconstant:app',
            'concat:build_css',
            'copy:build_app_assets',
            'copy:build_vendor_assets',
            'copy:build_configInitializationjs',
            'copy:build_appjs',
            'copy:build_systemjs_resources',
            'copy:angular2_lib',
            'copy:build_vendorjs',
            'index:build',
            'angularFileLoader',
            'karmaconfig'
        );

        if (target === targetEnum.debug) {
            taskList.push('copy:build_appjsmap_generated');
        } else {
            taskList.push('copy:build_appjs_generated');
        }

        if (target === targetEnum.debug || target === targetEnum.dist) {
            taskList.push('karma:unit');
        } else if (target === targetEnum.ci) {
            taskList.push('karma:ci');
        }

        if (target === targetEnum.debug || target === targetEnum.dist || target === targetEnum.ci) {
            taskList = taskList.concat(['compile']);
        }
        grunt.task.run(taskList);
    });

    /**
     * In order to make it safe to just compile or copy *only* what was changed,
     * we need to ensure we are starting from a clean, fresh build. So we rename
     * the `watch` task to `delta` (that's why the configuration var above is
     * `delta`) and then add a new task called `watch` that does a clean build
     * before watching for changes.
     */
    grunt.renameTask('watch', 'delta');
    // Before run grunt watch, run grunt or grunt build first.
    // But build task couldn't be put inside of watch alisa task. If doing so, will not get karma:gWatch output
    // karma:gWatch:start is to start karma server
    grunt.registerTask('watch', ['karma:gWatch:start', 'delta']);
    /**
     * The default task is to build and compile.
     */
    grunt.registerTask('default', ['build:dist']);
};