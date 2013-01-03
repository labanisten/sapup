var myModule = angular.module('systemAvailabilityAdmin', ['mongodbModule', 'directiveModule']);

myModule.factory('systemListService', function(db) {
	var service,
		items = [],
		oldGroup = "",
		itemToUpdate = {},
		db = db.Systemname,
		promise,
		groupBy = "systemgroup";

	var	sortOnGroupAndOrder = function(a, b) {
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

		updateItemInDB = function(item) {

			var updateItem = new db(item); 
			updateItem.update(updateItem._id).then(function(response) {
					if (response.data) {
						updateItemInModel(itemToUpdate._id);
					} else {
						//Unable to update
					};
			});
		},

		getHighestOrderInGroup = function(groupName) {
			var highestOrder = 0;  
			
			for (var i = 0; i < items.length; i++) {
				if (items[i].order > highestOrder && items[i][groupBy] == groupName) {
					highestOrder = items[i].order;
				};
			};
			return highestOrder;
		},

		updateItemInModel = function(id) {
			var i; 
			for (i = 0; items.length; i++) {
				if (items[i]._id == id) {
					items[i] = itemToUpdate;
					break;
				};
			};		
		},

		updateOrderForItemsAfterDeletion = function(fromItem) {
			for (var i = 0; i < items.length; i++) {
				if (items[i].order > fromItem.order && items[i][groupBy] == fromItem[groupBy]) {
					items[i].order--; 
					updateItemInDB(items[i]);
				};
			};
		};



	service = {
		getItems: function() {
			if (items.length > 0) {
				return items;
			} else if (!promise) {
				promise = db.get();
				promise.then(function(data) {
					items = data;
					return items;
				});
			};
		},
		
		getNoItemsOfGroup: function(groupName) {
			var count = 0;
			for (var i = 0; i < items.length; i++) {				
				if (items[i][groupBy] == groupName) {
					count++;	
				};
			};
			return count;
		},

		getItemToUpdate: function() {
			oldGroup = itemToUpdate.systemgroup;
			return itemToUpdate;
		},

		changeGroup: function() {
			var oldItem = {systemgroup: oldGroup, order: itemToUpdate.order};
			itemToUpdate.order = 0;
			itemToUpdate.order = getHighestOrderInGroup(itemToUpdate.systemgroup) + 1;
			updateOrderForItemsAfterDeletion(oldItem);
		},

		setSelectedItemByID: function(id) {
			var i; 
			for (i = 0; items.length; i++) {
				if (items[i]._id == id) {
					itemToUpdate = items[i]
;					break;
				};
			};		
		},

		isFirstItemInGroup: function(item) {
			if (item.order == 1) {
				return true;
			};	
		},

	    isLastItemInGroup: function(item) {
	    	return item.order == getHighestOrderInGroup(item[groupBy]);
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
			delete itemToUpdate._id;
			itemToUpdate.order = getHighestOrderInGroup(itemToUpdate[groupBy]) + 1;
			var newItem = new db(itemToUpdate);
			newItem.create().then(function(createdItem) {
				items.push(createdItem);
			});
			itemToUpdate = {};
		},

		updateItem: function() {

			var item = new db(itemToUpdate); 
			item.update(itemToUpdate._id).then(function(response) {
				if (response) {
				} else {
					//Unable to update
				};
			});
		}
	}

	return service;

});


myModule.factory('systemgroupListService', function(db) {
	
	var service,
		items = [],	
		itemToUpdate = {},
		promise,
		db = db.Systemgroup;

	var	getHighestOrder = function() {
			var highestOrder = 0;  
			
			for (var i = 0; i < items.length; i++) {
				if (items[i].order > highestOrder) {
					highestOrder = items[i].order;
				};
			};
			return highestOrder;
		},

		updateItemInDB = function(item) {

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

		updateOrderForItemsAfterDeletion = function(fromItem) {
			for (var i = 0; i < items.length; i++) {
				if (items[i].order > fromItem.order) {
					items[i].order--; 
					updateItemInDB(items[i]);
				};
			};
		};



	service = {
		
		sortOnOrder: function(a, b) {
			return a.order - b.order;
		},

		getSortedItemArray: function() {
			sortedItems = items; 
			return sortedItems.sort(sortOnGroupAndOrder); 
		},

		getItems: function() {
			if (items.length > 0) {
				return items;
			} else if (!promise) {
				promise = db.get();
				promise.then(function(data) {
					items = data;
					return items;
				});
			};
		},

		getItemToUpdate: function() {
			return itemToUpdate;
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

		isFirstItem: function(item) {
			if (item.order == 1) {
				return true;
			};	
		},

	    isLastItem: function(item) {
	    	return item.order == getHighestOrder();
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
		}

	};	

	return service;

});

myModule.factory('alertListService', function(db) {
	
	var service,
		items = [],
		itemToUpdate = {},
		promise, 
		db = db.Alert;

	var	isFirstItem = function(item) {
			if (item.order == 1) {
				return true;
			};	
		},

	    isLastItem = function(item) {
	    	return item.order == getHighestOrder();
		},

		getHighestOrder = function() {
			var highestOrder = 0;  
			
			for (var i = 0; i < items.length; i++) {
				if (items[i].order > highestOrder) {
					highestOrder = items[i].order;
				};
			};
			return highestOrder;
		},

		updateItemInDB = function(item) {

			var updateItem = new db(item); 
			updateItem.update(updateItem._id).then(function(response) {
					if (response.data) {
					} else {
						//Unable to update
					};
			});
			itemToUpdate = {};
		},

		updateOrderForItemsAfterDeletion = function(fromItem) {
			for (var i = 0; i < items.length; i++) {
				if (items[i].order > fromItem.order) {
					items[i].order--; 
					updateItemInDB(items[i]);
				};
			};
		};



	service = {
		

		getItems: function() {
			if (items.length > 0) {
				return items;
			} else if (!promise) {
				promise = db.get();
				promise.then(function(data) {
					items = data;
					return items;
				});
			};
		},

		getItemToUpdate: function() {
			return itemToUpdate;
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
					} else {
						//Unable to update
					}
			});
			itemToUpdate = {};
		}
	};	

	return service;

});


myModule.controller("systemModalCtrl", function($scope, systemListService, systemgroupListService) {
	
	$scope.systemList = systemListService;
	$scope.systemgroupList = systemgroupListService;

});

myModule.controller("systemgroupModalCtrl", function($scope, systemgroupListService) {
	$scope.list = systemgroupListService;
});

myModule.controller("alertListCtrl", function($scope, alertListService) {

	$scope.alertList = alertListService;

});

myModule.controller("systemListCtrl", function($scope, systemListService, systemgroupListService) {

	$scope.systemList = systemListService;
	$scope.systemgroupList = systemgroupListService;

});
	
myModule.controller("systemgroupListCtrl", function($scope, systemgroupListService) {

	$scope.list = systemgroupListService;
	
});