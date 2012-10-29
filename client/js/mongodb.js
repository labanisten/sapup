angular.module('mongodbModule', []).
	factory('db', function($http) {
	
		var DB_URL = "/mongodbloc";
		
		var db = db || {};
		
		(function(ns) {
			addResource = function(name, url) {
				ns[name] = function(data) {
					angular.extend(this, data);
				};

				ns[name].get = function(query) {
					if (query) {
						return $http.get(DB_URL + '/' + url + '/' + '?query=' + JSON.stringify(query)).then(function(repsonse){
							return repsonse.data;
						});					
					} else {
						var seconds = new Date().getTime() / 1000;
						return $http.get(DB_URL + '/' + url + '/' + '?' + seconds).then(function(repsonse){
							return repsonse.data;
						});
					}
				};

				ns[name].remove = function(id) {
					/*return $http.del(DB_URL + '/' + url + '/' + id).then(function(response) {					 	
						return response;
					});*/
					
					return $http.post(DB_URL + '/' + url + '/' + id).then(function(response) {
						if(!response.data.ok){
							resource.id = response.data[0]._id;
						}
						return "{ok}";
					});
				};

				ns[name].prototype.create = function() {
					var resource = this;
					return $http.post(DB_URL + '/' + url + '/', resource).then(function(response) {
						if(!response.data.ok){
							resource.id = response.data[0]._id;
						}
						return resource;
					});
				};

				ns[name].prototype.update = function(id) {
					var resource = this;
					return $http.put(DB_URL + '/' + url + '/' + id, resource).then(function(response) {
						return resource;
					});
				};
			};
		
			addResource("System", "systems");
			addResource("Systemname", "systemnames");
			addResource("Alerttype", "alerttypes");
			addResource("Systemstatus", "systemstatuses");
			addResource("Alert", "alerts");
		
		})(db);

		return db;
});

