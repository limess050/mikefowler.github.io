/*global module:false*/
module.exports = function(grunt) {

  // show elapsed time at the end
  require('time-grunt')(grunt);

  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    app: {
      dev: 'http://mikefowler.dev',
      prod: 'http://mikefowler.me'
    },

    site: {
      build: '_site'
    },

    uglify: {
      dist: {
        src: 'assets/js/app.js',
        dest: 'assets/js/app.min.js'
      }
    },
    
    jshint: {
      all: ['Gruntfile.js', 'assets/js/*.js', '!assets/js/*.min.js']
    },

    compass: {
      dist: {
        options: {
          config: 'config.rb',
          importPath: 'assets/fonts'
        }
      }
    },

    watch: {
      scripts: {
        files: '<%= jshint.all %>',
        tasks: ['jshint'/*, 'uglify'*/]
      },
      compass: {
        files: 'assets/sass/**/*',
        tasks: ['compass']
      },
      icons: {
        files: ['assets/images/icons/{,*/}*.svg'],
        tasks: ['exec:fontcustom']
      },
      livereload: {
        options: {
          livereload: 35730
        },
        files: [
          '<%= site.build %>/assets/css/**/*.css',
          '<%= site.build %>/assets/js/**/*.js',
          '<%= site.build %>/assets/images/*.{jpg,png,svg,webp}',
          '<%= site.build %>/**/*.html'
        ]
      }
    },

    exec: {
      build: {
        cmd: 'jekyll build'
      },
      staging: {
        cmd: 'jekyll serve -w'
      },
      write: {
        cmd: 'jekyll serve -w --drafts'
      },
      deploy: {
        cmd: 'git add . && git commit && git push'
      },
      fontcustom: {
        cmd: 'fontcustom compile assets/images/icons/ -c ./_config/'
      }
    },

    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      write: {
        tasks: ['exec:write', 'watch'],
      },
      staging: {
        tasks: ['exec:staging', 'watch'],
      }
    },

    open: {
      dev: {
        path: '<%= app.dev %>'
      },
      prod: {
        path: '<%= app.prod %>'
      }
    },

    env: {
      dev: {
        src: '_config/.env'
      }
    },

    pagespeed: {
      prod: {
        options: {
          paths: ['/'],
          locale: 'en_US',
          strategy: 'desktop',
          threshold: 80
        }
      },
      options: {
        key: process.env.key,
        url: 'http://mikefowler.me'
      }
    }

  });

  // Tasks
  
  grunt.registerTask('write', ['concurrent:write']);
  grunt.registerTask('staging', ['concurrent:staging']);
  grunt.registerTask('deploy', ['exec:deploy']);
  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('performance', ['env:dev', 'pagespeed']);
  grunt.registerTask('default', ['write']);

};
