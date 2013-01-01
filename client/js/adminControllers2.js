var myModule = angular.module('systemAvailabilityAdmin', ['mongodbModule', 'utilsModule', 'directiveModule']);

myModule.factory('systemlistService', function(db) {
	var service,
		items = [],
		itemToUpdate = {};

	service = {
		
		sortOnGroupAndOrder: function(a, b) {
			if (a[groupBy] < b[groupBy]) {
					return - 1; 
			}; 

			if (a[groupBy] > b[groupBy]) {
				return 1;
			};

			if (a[groupBy] == b[groupBy]) {
				if (a.order < b.order) {
					return - 1; 
				} else {
					return 1; 
				};
			}; 
		},

		getSortedItemArray: function() {
			sortedItems = items; 
			return sortedItems.sort(sortOnGroupAndOrder); 
		},


		getHighestOrderInGroup: function(groupName) {
			var highestOrder = 0;  
			
			for (var i = 0; i < items.length; i++) {
				if (items[i].order > highestOrder && items[i][groupBy] == groupName) {
					highestOrder = items[i].order;
				};
			};
			return highestOrder;
		},


		getItems: function() {
			return items; 
		},

		setItems: function(data) {
			items = data; 
		},

		getItemToUpdate: function() {
			return itemToUpdate;
		},


		isItemWithLowestOrderInGroup: function(item) {
			if (item.order == 1) {
				return true;
			};	
		},

	    isItemWithHighestOrderInGroup: function(item) {
	    	return item.order == getHighestOrderInGroup(item[groupBy]);
		},

		setSelectedItemByID: function(id) {
			var i; 
			for (i = 0; items.length; i++) {
				if (items[i]._id == id) {
					itemToUpdate = items[i];
					break;
				};
			};		
		},

		getClassForUpArrow: function(item) {
			if (isItemWithLowestOrderInGroup(item)) {
				return "invisible";
			};
		},

		getClassForDownArrow: function(item) {
			if (isItemWithHighestOrderInGroup(item)) {
				return "invisible";
			};
		},

		updateItemInDB: function(item) {

			var updateItem = new db(item); 
			updateItem.update(updateItem._id).then(function(response) {
					if (response.data) {
						//Success - update model here?
					} else {
						//Unable to update
					};
			});
			itemToUpdate = {};
		},

	    moveItemUp: function(item) {			
	    	var order; 

			for (var i = 0; i < items.length; i++) {
				if (items[i]._id == item._id) {
					order = items[i].order;		
					break;
				};
			};

			for (var i = 0; i < items.length; i++) {
				if (items[i].order == order && order > 1 && items[i][groupBy] == item[groupBy]) {
					items[i].order--;
					updateItemInDB(items[i]);
				} else if (order - 1 == items[i].order && items[i][groupBy] == item[groupBy]) {
					items[i].order++;
					updateItemInDB(items[i]);
				};
			};
		},

		moveItemDown: function(item) {
			var order; 

			for (var i = 0; i < items.length; i++) {
				if (items[i]._id == item._id) {
					order = items[i].order;		
					break;
				};
			};

			for (var i = 0; i < items.length; i++) {
				if (items[i].order == order && order < items.length && items[i][groupBy] == item[groupBy]) {
					items[i].order++;
					updateItemInDB(items[i]);
				} else if (order + 1 == items[i].order && items[i][groupBy] == item[groupBy]) {
					items[i].order--;
					updateItemInDB(items[i]);
				};
			};
		},


		updateOrderForItemsAfterDeletion: function(fromItem) {
			for (var i = 0; i < items.length; i++) {
				if (items[i].order > fromItem.order && items[i][groupBy] == fromItem[groupBy]) {
					items[i].order--; 
					updateItemInDB(items[i]);
				};
			};
		},

		deleteItem: function() {
			db.remove(itemToUpdate._id).then(function(response) {
					if (response.data) {
						for (var i = 0; i < items.length; i++) {
							if (items[i]._id == itemToUpdate._id) {
								items.splice(i, 1);
								updateOrderForItemsAfterDeletion(itemToUpdate);
							};
						};			
					} else {
						//Unable to delete
					};
			});
		},

		saveItem: function() {

			itemToUpdate.order = getHighestOrderInGroup(itemToUpdate[groupBy]) + 1;

			var newItem = new db(itemToUpdate);
			newItem.create().then(function(createdItem) {
				items.push(createdItem);
			});

			itemToUpdate = {};
		},

		updateItem: function() {

			var system = new db(itemToUpdate); 
			system.update(itemToUpdate._id).then(function(response) {
					if (response.data) {
						//Success - update model here?
					} else {
						//Unable to update
					}
			});
			itemToUpdate = {};
		}
	};	

	return service;

});


myModule.factory('systemgroupListService', function(db) {
	
	var service,
		items = [],
		itemToUpdate = {};

	service = {
		
		sortOnOrder: function(a, b) {
			return a.order - b.order;
		},

		getSortedItemArray: function() {
			sortedItems = items; 
			return sortedItems.sort(sortOnGroupAndOrder); 
		},


		getHighestOrder: function() {
			var highestOrder = 0;  
			
			for (var i = 0; i < items.length; i++) {
				if (items[i].order > highestOrder) {
					highestOrder = items[i].order;
				};
			};
			return highestOrder;
		},


		getItems: function() {
			return items; 
		},

		setItems: function(data) {
			items = data; 
		},

		getItemToUpdate: function() {
			return itemToUpdate;
		},


		isItemWithLowestOrder: function(item) {
			if (item.order == 1) {
				return true;
			};	
		},

	    isItemWithHighestOrder: function(item) {
	    	return item.order == getHighestOrder();
		},

		setSelectedItemByID: function(id) {
			var i; 
			for (i = 0; items.length; i++) {
				if (items[i]._id == id) {
					itemToUpdate = items[i];
					break;
				};
			};		
		},

		getClassForUpArrow: function(item) {
			if (isItemWithLowestOrder(item)) {
				return "invisible";
			};
		},

		getClassForDownArrow: function(item) {
			if (isItemWithHighestOrder(item)) {
				return "invisible";
			};
		},

		updateItemInDB: function(item) {

			var updateItem = new db(item); 
			updateItem.update(updateItem._id).then(function(response) {
					if (response.data) {
						//Success - update model here?
					} else {
						//Unable to update
					};
			});
			itemToUpdate = {};
		},

	    moveItemUp: function(item) {			
	    	var order; 

			for (var i = 0; i < items.length; i++) {
				if (items[i]._id == item._id) {
					order = items[i].order;		
					break;
				};
			};

			for (var i = 0; i < items.length; i++) {
				if (items[i].order == order && order > 1) {
					items[i].order--;
					updateItemInDB(items[i]);
				} else if (order - 1 == items[i].order) {
					items[i].order++;
					updateItemInDB(items[i]);
				};
			};
		},

		moveItemDown: function(item) {
			var order; 

			for (var i = 0; i < items.length; i++) {
				if (items[i]._id == item._id) {
					order = items[i].order;		
					break;
				};
			};

			for (var i = 0; i < items.length; i++) {
				if (items[i].order == order && order < items.length) {
					items[i].order++;
					updateItemInDB(items[i]);
				} else if (order + 1 == items[i].order) {
					items[i].order--;
					updateItemInDB(items[i]);
				};
			};
		},


		updateOrderForItemsAfterDeletion: function(fromItem) {
			for (var i = 0; i < items.length; i++) {
				if (items[i].order > fromItem.order) {
					items[i].order--; 
					updateItemInDB(items[i]);
				};
			};
		},

		deleteItem: function() {
			db.remove(itemToUpdate._id).then(function(response) {
					if (response.data) {
						for (var i = 0; i < items.length; i++) {
							if (items[i]._id == itemToUpdate._id) {
								items.splice(i, 1);
								updateOrderForItemsAfterDeletion(itemToUpdate);
							};
						};			
					} else {
						//Unable to delete
					};
			});
		},

		saveItem: function() {

			itemToUpdate.order = getHighestOrder() + 1;

			var newItem = new db(itemToUpdate);
			newItem.create().then(function(createdItem) {
				items.push(createdItem);
			});

			itemToUpdate = {};
		},

		updateItem: function() {

			var system = new db(itemToUpdate); 
			system.update(itemToUpdate._id).then(function(response) {
					if (response.data) {
						//Success - update model here?
					} else {
						//Unable to update
					}
			});
			itemToUpdate = {};
		}
	};	

	return service;

});

myModule.controller("adminMainCtrl", function($scope, db, Utils) {
});


myModule.controller("systemModalCtrl", function($scope, db, Utils) {
	
});

myModule.controller("systemgroupModalCtrl", function($scope, db, Utils) {
	
});

myModule.controller("alertListCtrl", function($scope, db, Utils) {



	// Get alert from database and create collection
	var promise = db.Alert.get();
	promise.then(function(data) {
		$scope.alerts = data;
	});

});

myModule.controller("systemListCtrl", function($scope, db, Utils) {


	$scope.systems = {};
	$scope.systemgroups = {};

	// Get systems from DB and create collection 
	var promise = db.Systemname.get();
	promise.then(function(data) {
		$scope.systems = data;				
	});

	// Get systemgroups from database and create collection
	var promise = db.Systemgroup.get();
	promise.then(function(data) {
		$scope.systemgroups = data;
	});

});
	
myModule.controller("systemgroupListCtrl", function($scope, db, Utils, systemgroupListService) {

	// Get systemgroups from database and create collection
	var promise = db.Systemgroup.get();
	promise.then(function(data) {
		systemgropuListService.setItems(data);
	});
	
	$scope.systemgroups = sytemgroupListService.getItems();


	
});