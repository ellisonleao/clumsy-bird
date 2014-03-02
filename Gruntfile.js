/*global module:false*/
module.exports = function(grunt) {
  var sourceFiles = [
    'js/game.js',
    'js/resources.js',
    'js/entities/entities.js',
    'js/entities/HUD.js',
    'js/screens/title.js',
    'js/screens/play.js',
    'js/screens/gameover.js',
  ];

  // Project configuration.
  grunt.initConfig({
    concat: {
      dist: {
        src: sourceFiles,
        dest: 'build/clumsy.js'
      }
    },

    uglify: {
      options: {
        report: 'min',
        preserveComments: 'some'
      },
      dist: {
        files: {
          'build/clumsy-min.js': [
            sourceFiles
          ]
        }
      }
    },

    jshint: {
      options: {
        jshintrc: ".jshintrc"
      },

      beforeConcat: {
        files: {
          src: sourceFiles
        }
      },

      afterConcat: {
        files: {
          src: [ sourceFiles ]
        }
      }
    },

    clean: {
      dist: [
        'build/clumsy.js',
        'build/clumsy-min.js'
      ],
    },

    manifest: {
      generate:{
        options: {
          basePath: '.',
          cache: sourceFiles,
          master: ['index.html']        
        },
        src: sourceFiles + ['index.html', 'index.css', 'data/*', 'lib/*']     
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-manifest');


  // Default task.
  grunt.registerTask('default', ['concat', 'uglify', 'manifest']);
  grunt.registerTask('lint', ['jshint:beforeConcat', 'concat', 'jshint:afterConcat']);
};
