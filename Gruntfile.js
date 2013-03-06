"use strict";

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({


    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      gruntfile: ['Gruntfile.js'],
      //libs_n_tests: ['lib/**/*.js', '<%= nodeunit.all %>'],
      //subgrunt: ['<%= subgrunt.all %>'],
      all: ['client/js/controllers.js', 'client/js/utils.js', 'client/js/mongodb.js', 'client/js/calendar.js'/*, 'client/js/directives.js'*/],
      options: {
        "predef": ["module", "angular", "jQuery", "$"],
        //strict: false,
        globalstrict: true,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        //node: true,
        es5: true
      }
    }

  });

  // Load the plugin that provides the "jshint" task.
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task(s).
  grunt.registerTask('default', ['jshint']);

};