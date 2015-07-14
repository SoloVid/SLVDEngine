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
			ignorePath: 'files/levels/',
			addRootSlash: false,
			transform: function(filepath, index, length) {
				return '<level>' + filepath + '</level>'
			},
			starttag: '<!-- inject-files:{{ext}} -->',
			endtag: '<!-- end-inject-files -->'
		},
		level_files: {
			files: {
				'files/main/master.xml': ['files/levels/**/*.xml'],
			}
		}
	},
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
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
      files: ['<%= jshint.files %>'],
      tasks: [/*'jshint', 'qunit'*/ 'injector', 'copy', 'concat', 'uglify']
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