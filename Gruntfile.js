'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({


    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      gruntfile: ['Gruntfile.js'],
      //libs_n_tests: ['lib/**/*.js', '<%= nodeunit.all %>'],
      //subgrunt: ['<%= subgrunt.all %>'],
      all: ['client/js/controllers.js'],
      options: {
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
        node: true,
        es5: true
      }
    }

  });

  // Load the plugin that provides the "jshint" task.
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task(s).
  grunt.registerTask('default', ['jshint']);

};