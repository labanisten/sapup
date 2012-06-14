// This is a module for cloud persistance in mongolab - https://mongolab.com
	
angular.module('mongolab', ['ngResource']).
	factory('Systems', function($resource) {
		var Systems = $resource('https://api.mongolab.com/api/1/databases/saa_testdb/collections/system?apiKey=4fd9cdade4b05cb78ca54269');
		return Systems;
	});
	
	
	
	
	
