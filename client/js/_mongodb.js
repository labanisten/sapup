angular.module('mongodbModule', []).
	factory('db', function($http) {
	
		var db = db || {};
		
		(function(ns) {

			ns.noCache = function() {
				return '?_=' + Math.random();
			}

			addResource = function(name, url) {
				ns[name] = function(data) {
					angular.extend(this, data);
				};

				ns[name].get = function(query) {
					if (query) {
						return $http.get('/' + url + '/' + '?query=' + JSON.stringify(query)).then(function(response){
							return response.data;
						});					
					} else {
						return $http.get('/' + url + ns.noCache()).then(function(response){
							return response.data;
						});
					}
				};

				ns[name].remove = function(id) {
					return $http.delete('/' + url + '/' + id).then(function(response) {					 	
						return response;
					});					
				}

				ns[name].prototype.update = function(id) {
					var resource = this;
					delete resource._id;
				 	return $http.put('/' + url + '/' + id, resource).then(function(response) {
						return resource;
					});
				};

				ns[name].prototype.create = function() {
					var resource = this;
				 	return $http.post('/' + url + '/', resource).then(function(response) {
						return response.data[0];
					});
				};

			};
		
			addResource("Systemgroup", "resources/systemgroups");
			addResource("System", "resources/systems");
			addResource("Systemname", "resources/systemnames");
			addResource("Alerttype", "resources/alerttypes");
			addResource("Systemstatus", "resources/systemstatuses");
			addResource("Alert", "resources/alerts");
			addResource("User", "resources/users");
			addResource("Userdata", "userdata");
		
		})(db);

		return db;
});

