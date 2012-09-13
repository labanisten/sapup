angular.module('mongolabModule', ['ngResource']).
	factory('Systems', function($resource) {
	
		var db = {	systems: $resource('/mongodb/saa_testdb/system/',
									   {},
									   {
											update: { method: 'PUT' }									   
									   }), 
		
					systemnames: $resource('/mongodb/saa_testdb/systemname/',	
										{},
										{
											update: { method: 'PUT'},
											remove: { method: 'DELETE'}
										}
					),	
					
					systemstatuses: $resource('/mongodb/saa_testdb/systemstatus/',
										{},
										{
											remove: { method: 'DELETE'}
										}		
					), 
					
					alerttypes: $resource('/mongodb/saa_testdb/alerttype/',
										{},
										{
											remove: { method: 'DELETE'}
										}
					
					),
					
					alerts: $resource('/mongodb/saa_testdb/alert/',
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