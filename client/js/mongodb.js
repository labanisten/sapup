angular.module('mongodbModule', []).
	factory('db', function($http) {
	
		var DB_URL = "/mongodb/"; 
		var DB_NAME = "saa_testdb";
		
		var db = db || {};
		
		(function(ns) {
			addResource = function(name, url) {
				ns[name] = function(data) {
					angular.extend(this, data);
				};

				ns[name].get = function(query) {
					if (query) {
						return $http.get(DB_URL + DB_NAME + '/' + url + '/' + '?query=' + JSON.stringify(query)).then(function(repsonse){
							return repsonse.data;
						});					
					} else {
						return $http.get(DB_URL + DB_NAME + '/' + url + '/').then(function(repsonse){
							return repsonse.data;
						});
					}
				};

				ns[name].remove = function(id) {
				 	return $http.delete(DB_URL + DB_NAME + '/' + url + '/' + id).then(function(response) {					 	
						return response;
					});					
				}

				ns[name].prototype.create = create = function() {
					var resource = this;
				 	return $http.post(DB_URL + DB_NAME + '/' + url + '/', resource).then(function(response) {
					 	resource.id = response.data[0]._id;
						return resource;
					});
				};
			};
		
			addResource("System", "system");
			addResource("Systemname", "systemname");
			addResource("Alerttype", "alerttype");
			addResource("Systemstatus", "systemstatus");
			addResource("Alert", "alert");
		
		})(db);

		return db;
});

