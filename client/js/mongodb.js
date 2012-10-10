angular.module('mongodbModule', []).
	factory('db', function($http) {
	
		var db = db || {};
		
		(function(ns) {
			addResource = function(name, url) {
				ns[name] = function(data) {
					angular.extend(this, data);
				};

				ns[name].get = function(query) {
					if (query) {
						return $http.get('/' + url + '/' + '?query=' + JSON.stringify(query)).then(function(repsonse){
							return repsonse.data;
						});					
					} else {
						var seconds = new Date().getTime() / 1000;
						return $http.get('/' + url + '/' + '?' + seconds).then(function(repsonse){
							return repsonse.data;
						});
					}
				};

				ns[name].remove = function(id) {
				 	return $http.delete('/' + url + '/' + id).then(function(response) {					 	
						return response;
					});					
				}

				//TODO returnera berre ok
				ns[name].prototype.create = function() {
					var resource = this;
				 	return $http.post('/' + url + '/', resource).then(function(response) {
						if(!response.data.ok){
							resource.id = response.data[0]._id;
						}
						return resource;
					});
				};

				ns[name].prototype.update = function(id) {
					var resource = this;
				 	return $http.put('/' + url + '/' + id, resource).then(function(response) {
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

