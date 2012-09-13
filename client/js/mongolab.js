angular.module('mongolabModule', ['ngResource']).
	factory('Systems', function($resource) {
	
		var db = {	systems: $resource('http://mongodb/saa_testdb/system/',
									   {},
									   {
											update: { method: 'PUT' }									   
									   }), 
		
					systemnames: $resource('http://mongodb/saa_testdb/systemname/',	
										{},
										{
											update: { method: 'PUT'},
											remove: { method: 'DELETE'}
										}
					),	
					
					systemstatuses: $resource('http://mongodb/saa_testdb/systemstatus/',
										{},
										{
											remove: { method: 'DELETE'}
										}		
					), 
					
					alerttypes: $resource('http://mongodb/saa_testdb/alerttype/',
										{},
										{
											remove: { method: 'DELETE'}
										}
					
					),
					
					alerts: $resource('http://mongodb/saa_testdb/alert/',
										{},
										{
											get: {method: 'GET', isArray:true},
											update: { method: 'PUT'},
											remove: { method: 'DELETE'}
										}
									 )
					};
					
		return db;
	});