// This is a module for cloud persistance in mongolab - https://mongolab.com
	
angular.module('mongolab', ['ngResource']).
	factory('Systems', function($resource) {
	
		var db = {	systems: $resource('https://api.mongolab.com/api/1/databases/saa_testdb/collections/system/?apiKey=4fd9cdade4b05cb78ca54269'), 
					systemnames: $resource('https://api.mongolab.com/api/1/databases/saa_testdb/collections/systemname/?apiKey=4fd9cdade4b05cb78ca54269'), 			
					systemstatuses: $resource('https://api.mongolab.com/api/1/databases/saa_testdb/collections/systemstatus/?apiKey=4fd9cdade4b05cb78ca54269'), 
					alerttypes: $resource('https://api.mongolab.com/api/1/databases/saa_testdb/collections/alerttype/?apiKey=4fd9cdade4b05cb78ca54269'), 	
					alerts: $resource('https://api.mongolab.com/api/1/databases/saa_testdb/collections/alert/:id?apiKey=4fd9cdade4b05cb78ca54269',
										{id: '@id'},
										{
											get: {method: 'GET', isArray:true},
											update: { method: 'PUT' },
											remove: { method: 'DELETE'} 
										}
									 )
					};
				
		return db;
		
	});