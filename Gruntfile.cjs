module.exports = function (grunt) {
	grunt.initConfig({
	// define source files and their destinations
	uglify: {
	  files: {
		expand: true, 
		flatten: true, 
		ext: ".min.js",
		build: {
			src: 'src/*.js',
			dest: 'dist/'
		  }
	  },
	},
  });

  // load plugins
  grunt.loadNpmTasks("grunt-contrib-uglify");

  // register at least this one task
  grunt.registerTask("default", ["uglify"]);
}


