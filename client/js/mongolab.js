
angular.module('mongolab', ['ngResource']).
	factory('Systems', function($resource) {
	
		var db = {	systems: $resource('https://api.mongolab.com/api/1/databases/saa_testdb/collections/system/:id?apiKey=4fd9cdade4b05cb78ca54269',
									   {id: '@id'},
									   {
											update: { method: 'PUT' }									   
									   }), 
		
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