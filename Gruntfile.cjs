module.exports = function (grunt) {
	grunt.initConfig({
	// define source files and their destinations
	uglify: {
	  files: {
		src: "src/*.js", 
		dest: "dist/", 
		expand: true, 
		flatten: true, 
		ext: ".min.js",
	  },
	},
  });

  // load plugins
  grunt.loadNpmTasks("grunt-contrib-uglify");

  // register at least this one task
  grunt.registerTask("default", ["uglify"]);
}


