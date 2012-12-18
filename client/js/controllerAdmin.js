var myModule = angular.module('systemAvailability', ['mongodbModule', 'utilsModule', 'directiveModule']);

myModule.controller("adminViewCtrl", function($scope, db, Utils) {

// Collection object for editable lists 
	var collection = function(data, db) {

		var that = {};
		var items = data; 

		var itemToUpdate = {};


		var getItems = function() {
			return items; 
		};

		var getItemToUpdate = function() {
			return itemToUpdate;
		}; 


		var isItemWithLowestOrder = function(order) {
			if (order == 1) {
				return true;
			};	
		};

	    var isItemWithHighestOrder = function(order) {
			var highestOrder = 0; 
			for (var i = 0; i < items.length; i++) {
				if (items[i].order > highestOrder) {
					highestOrder = items[i].order;
				}
			};
			if (order == highestOrder) {
				return true;
			}; 		
		};

		var setSelectedItemByID = function(id) {
			var i; 
			for (i = 0; items.length; i++) {
				if (items[i]._id == id) {
					itemToUpdate = items[i];
					break;
				}
			};		
		};

		var getClassForUpArrow = function(order) {
			if (isItemWithLowestOrder(order)) {
				return "invisible";
			}
		};

		var getClassForDownArrow = function(order) {
			if (isItemWithHighestOrder(order)) {
				return "invisible";
			}
		};

		function setSelectedItemByIndex(index) {
			itemToUpdate = items[index];
		};

		var updateItemInDB = function() {
	
			var item = new db(itemToUpdate); 
			item.update(item._id).then(function(response) {
					if (response.data) {
						//Success - update model here?
					} else {
						//Unable to update
					}
			});
			itemToUpdate = {};
		};

	    var moveItemUp = function(system) {
			var order; 

			for (var i = 0; i < items.length; i++) {
				if (items[i]._id == system._id) {
					order = items[i].order;		
					break;
				}			
			};

			for (var i = 0; i < items.length; i++) {
				if (items[i].order == order && order > 1) {
					items[i].order--;
					setSelectedItemByIndex(i); 
					updateItemInDB();
				} else if (order - 1 == items[i].order) {
					items[i].order++;
					setSelectedItemByIndex(i); 
					updateItemInDB();
				};
			};
		}
		var moveItemDown = function(item) {
			var order; 

			for (var i = 0; i < items.length; i++) {
				if (items[i]._id == item._id) {
					order = items[i].order;		
					break;
				}
			};

			for (var i = 0; i < items.length; i++) {
				if (items[i].order == order && order < items.length) {
					items[i].order++;
					setSelectedItemByIndex(i); 
					updateItemInDB();
				} else if (order + 1 == items[i].order) {
					items[i].order--;
					setSelectedItemByIndex(i); 
					updateItemInDB();
				};
			};
		}


		var updateOrderForItemsAfterDeletion = function(fromOrder) {
			for (var i = 0; i < items.length; i++) {
				if (items[i].order > fromOrder) {
					items[i].order--; 
					setSelectedSystemByIndex(i); 
					updateItemInDB();
				}	
			};
		}

		var deleteItem = function() {

			db.remove(itemToUpdate._id).then(function(response) {
					if (response.data) {
						for (var i = 0; i < items.length; i++) {
							if (items[i]._id == itemToUpdate._id) {
								items.splice(i, 1);
								updateOrderForItemsAfterDeletion(itemToUpdate.order);
							}
						};			
					} else {
						//Unable to delete
					}
			});
		};

		var saveItem = function() {

			itemToUpdate.order = items.length + 1;
			var newItem = new db(itemToUpdate);
			newItem.create().then(function(createdItem) {
				items.push(createdItem);
			});

			itemToUpdate = {};

		};

		var updateItem = function() {
		
			var system = new db(itemToUpdate); 
			system.update(itemToUpdate._id).then(function(response) {
					if (response.data) {
						//Success - update model here?
					} else {
						//Unable to update
					}
			});
			itemToUpdate = {};
		};


		// Public methods
		that.isItemWithLowestOrder = isItemWithLowestOrder;
		that.isItemWithHighestOrder = isItemWithHighestOrder;
		that.setSelectedItemByID = setSelectedItemByID; 
		that.getClassForDownArrow = getClassForDownArrow; 		
		that.getClassForUpArrow  =getClassForUpArrow;
		that.moveItemDown = moveItemDown; 
		that.moveItemUp = moveItemUp; 
		that.setSelectedItemByIndex = setSelectedItemByIndex;
		that.getItems = getItems;
		that.getItemToUpdate = getItemToUpdate;
		that.deleteItem = deleteItem;
		that.saveItem = saveItem; 
		that.updateItem = updateItem; 
		that.items = items; 

		return that;

	}; 

	// Filter for systems
	$scope.filterSystems = ''; 
	$scope.setSystemgroupForFilter = function(group) {
		$scope.filterSystems = group.name; 
	}

	// Get systemgroups from database and create collection
	var promise = db.Systemgroup.get();
	promise.then(function(data) {
		$scope.systemgroups = data;
		$scope.systemgroupsCollection = collection($scope.systemgroups, db.Systemgroup);				
	});

	// Get systems from DB and create collection 
	var promise = db.Systemname.get();
	promise.then(function(data) {
		$scope.systems = data;				
		$scope.systemsCollection = collection($scope.systems, db.Systemname);				
	});
	

	// Get alert from database and create collection
	var promise = db.Alert.get();
	promise.then(function(data) {
		$scope.alerts = data;
		$scope.alertsCollection = collection($scope.alerts, db.Alert);				
	});


	
});