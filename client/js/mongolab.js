angular.module('mongolabModule', ['ngResource']).
	factory('Systems', function($resource) {
	
		var db = {	systems: $resource('/mongodb/saa_testdb/system/:id/',
									   {},
									   {
									   		query: {method: 'GET', isArray:false},
											update: { method: 'PUT' }									   
									   }), 
		
					systemnames: $resource('/mongodb/saa_testdb/systemname/:id',	
										{},
										{
											update: { method: 'PUT'},
											remove: { method: 'DELETE'}
										}
					),	
					
					systemstatuses: $resource('/mongodb/saa_testdb/systemstatus/:id',
										{},
										{
											remove: { method: 'DELETE'}
										}		
					), 
					
					alerttypes: $resource('/mongodb/saa_testdb/alerttype/:id',
										{},
										{
											remove: { method: 'DELETE'}
										}
					
					),
					
					alerts: $resource('/mongodb/saa_testdb/alert/:id',
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