
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var serveStatic = require('serve-static');
var mountFolder = function (connect, dir) {
    return connect().use(serveStatic(dir));
//    return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    'use strict';
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    var serveStatic = require('serve-static');

    grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),

	concat: {
	      options: {
		separator: ';'
	      },
	      dist: {
		src: ['app/js/**/*.js'],
		dest: 'dist/<%= pkg.name %>.js'
	      }
	    },
	    uglify: {
	      options: {
		banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
	      },
	      dist: {
		files: {
		  'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
		}
	      }
	    },
	    jshint: {
	      files: ['Gruntfile.js', 'app/js/**/*.js'],
	      options: {
		// options here to override JSHint defaults
		globals: {
		  console: true,
		  module: true,
		  document: true
		}
	      }
	    },

        watch: {
            options: {
                nospawn: true
            },
            less: {
                files: ['app/styles/*.less'],
                tasks: ['less:server']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    'app/*.html',
                    'app/styles/{,*/}*.css',
                    'app/scripts/{,*/}*.js',
                    'app/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        connect: {
            options: {
                port: 9000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, 'app'),
                            lrSnippet
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            }
        },
        less: {
            server: {
                options: {
                    paths: ['app/components/bootstrap/less', 'app/styles']
                },
                files: {
                    'app/styles/main.css': 'app/styles/main.less'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('server', function (target) {

        grunt.task.run([
            'less:server',
            'connect:livereload',
            'open',
            'watch'
        ]);
    });

    grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

};
