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
      tasks: [/*'jshint', 'qunit'*/ 'copy', 'concat']//, 'uglify']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  //grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('test', ['jshint'/*, 'qunit'*/]);

  grunt.registerTask('default', ['concat', 'copy', 'watch']);

};