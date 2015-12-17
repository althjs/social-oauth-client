
'use strict';

var path = require('path');


module.exports = function(grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.loadNpmTasks('grunt-express-server');

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: 'dist'
  };

  grunt.initConfig({
    yeoman: yeomanConfig,
    express: {  // grunt-express-server task
      options: {
        port: 3000,
        hostname: '*'
      },
      dev: {
        options: {
          script: 'demo/app.js'
        }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      livereload: {
        files: ['./static/**', '!./static/admin/src-noconflict/**/*', '!./static/admin/bower_components/**/*', '!./static/admin/bower_components','!./static/admin/dist/**/*', '!./static/margo/**/*']
      },
      express: {
        files:  [ './platforms/**/*.js', 'demo/**/*.js' ],
        tasks:  [ 'express:dev' ],
        options: {
          spawn: false // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
        }
      },
      test: {
        files:  [ 'redisfire/**/*.js', 'service/**/*.js', 'test/route/**/*.js' ],
        tasks:  ['clean', 'copy', 'env:coverage',
          'instrument', 'mochaTest:route', 'storeCoverage', 'makeReport'  // 'mochaTest:unit',
        ],
        options: {
          spawn: true // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
        }
      }
    },

    open: {
      server: {
        url: 'http://localhost:<%= express.options.port %>'
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp',
      coverage: {
        src: ['test/coverage']
      }
    },
    env: {
      livereload: {
        LIVERELOAD_HOST: "http://localhost:35729"
      }
    }

  });

  grunt.registerTask('default', ['dev']);

  grunt.registerTask('dev', ['env:livereload', 'express:dev', 'watch']);
};
