angular.module('mongolabModule', ['ngResource']).
	factory('Systems', function($resource) {
	
		var db = {	systems: $resource('https://api.mongolab.com/api/1/databases/saa_testdb/collections/system/:id?apiKey=4fd9cdade4b05cb78ca54269',
									   {id: '@id'},
									   {
											update: { method: 'PUT' }									   
									   }), 
		
					systemnames: $resource('https://api.mongolab.com/api/1/databases/saa_testdb/collections/systemname/:id?apiKey=4fd9cdade4b05cb78ca54269',	
										{id:'@id'},
										{
											update: { method: 'PUT'},
											remove: { method: 'DELETE'}
										}
					),	
					
					systemstatuses: $resource('https://api.mongolab.com/api/1/databases/saa_testdb/collections/systemstatus/:id?apiKey=4fd9cdade4b05cb78ca54269',
										{id:'@id'},
										{
											remove: { method: 'DELETE'}
										}		
					), 
					
					alerttypes: $resource('https://api.mongolab.com/api/1/databases/saa_testdb/collections/alerttype/:id?apiKey=4fd9cdade4b05cb78ca54269',
										{id:'@id'},
										{
											remove: { method: 'DELETE'}
										}	
					
					), 	
					
					alerts: $resource('https://api.mongolab.com/api/1/databases/saa_testdb/collections/alert/:id?apiKey=4fd9cdade4b05cb78ca54269',
										{id: '@id'},
										{
											get: {method: 'GET', isArray:true},
											update: { method: 'PUT'},
											remove: { method: 'DELETE'} 
										}
									 )
					};
					
		return db;
	});