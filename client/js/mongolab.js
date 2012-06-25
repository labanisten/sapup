// This is a module for cloud persistance in mongolab - https://mongolab.com
	
angular.module('mongolab', ['ngResource']).
	factory('Systems', function($resource) {
	
		var Systems = $resource('https://api.mongolab.com/api/1/databases/saa_testdb/collections/system/:id?apiKey=4fd9cdade4b05cb78ca54269', {id:'@id'}, {save: {method:'POST', params:{charge:true}}});	
		//var Systems = $resource('https://api.mongolab.com/api/1/databases/saa_testdb/collections/system?apiKey=4fd9cdade4b05cb78ca54269');
		
		/*var test = Systems.get({sys:'P03'}, function(u, getResponse){
						u.abc = true;
						console.log('t10');
						console.log(u);
						console.log(getResponseHeaders);
					});*/
					
		//console.log("asd: " + test);
		
		/*
		this.save = function(resource) {
			resource.$save(function() {
			  console.log('SUCCESS save');
			}, function() {
			  console.log('ERROR save');
			});
		};
		
		
	    this.delete = function(resource) {
			resource.$delete(function() {
			  console.log('SUCCESS delete');
			}, function() {
			  console.log('ERROR delete');
			});
		};
		*/
		
		return Systems;
	});
	
	
	
	
	
