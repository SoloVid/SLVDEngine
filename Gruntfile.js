module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';\n'
      },
      dist: {
        src: ['codeBase/runtime/globals.js', 
			'codeBase/static/**/*.js', 
			'files/code/**/*.js', 	
			/*"codeBase/runtime/load.js",
			"files/main/initialize.js",
			"codeBase/runtime/main.js"*/],
        dest: 'dist/static.js'//'dist/<%= pkg.name %>.js'
      }
    },
	copy: {
		main: {
			files: [
				{ expand: true, cwd: 'codeBase/runtime', src: ['*'], dest: 'dist/' },
				{ expand: true, cwd: 'files/main/', src: ['initialize.js'], dest: 'dist/' }
			]
		}
	},
	injector: {
		options: {
			addRootSlash: false
		},
		level_files: {
			options: {
				templateString: '<?xml version="1.0" encoding="UTF-8"?>\n<stuff>\n\t<levels>\t\n</levels>\n\t<images>\n\t</images>\n\t<musics>\n\t</musics>\n\t<soundeffects>\n\t</soundeffects>\n</stuff>',
				starttag: '<levels>',
				endtag: '</levels>',
				transform: function(filepath, index, length) {
					return '\t<level>' + filepath + '</level>'
				},
				ignorePath: 'files/levels/'
			},
			files: {
				'files/main/master.xml': ['files/levels/**/*.xml'],
			}
		},
		music_files: {
			options: {
				starttag: '<musics>',
				endtag: '</musics>',
				transform: function(filepath, index, length) {
					return '\t<music>' + filepath + '</music>'
				},
				ignorePath: 'files/audio/music/'
			},
			files: {
				'files/main/master.xml': ['files/audio/music/**/*.mp3'],
			}
		},
		sound_effect_files: {
			options: {
				starttag: '<soundeffects>',
				endtag: '</soundeffects>',
				transform: function(filepath, index, length) {
					return '\t<soundeffect>' + filepath + '</soundeffect>'
				},
				ignorePath: 'files/audio/soundeffects/'
			},
			files: {
				'files/main/master.xml': ['files/audio/soundeffects/**/*.mp3'],
			}
		},
		preloaded_image_files: {
			options: {
				starttag: '<images>',
				endtag: '</images>',
				transform: function(filepath, index, length) {
					return '\t<image>' + filepath + '</image>'
				},
				ignorePath: 'files/images/preloaded/'
			},
			files: {
				'files/main/master.xml': ['files/images/preloaded/**/*'],
			}
		}		
	},
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n;(function() {\n',
		footer: '\n} ());'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['dist/static.js', 'dist/load.js', 'dist/initialize.js', 'dist/main.js']//<%= concat.dist.dest %>']
        }
      }
    },
//    qunit: {
//      files: ['test/**/*.html']
//    },
    jshint: {
      files: ['Gruntfile.js', 'codeBase/**/*.js', 'files/**/*.js'],//, 'test/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>', 'files/levels/**/*.xml'],
      tasks: [/*'jshint', 'qunit'*/ 'injector', 'copy', 'concat']//, 'uglify']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  //grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-script-link-tags');
  grunt.loadNpmTasks('grunt-injector');

  grunt.registerTask('test', ['jshint'/*, 'qunit'*/]);

  grunt.registerTask('default', ['injector', 'concat', 'copy', 'uglify', 'watch']);
};