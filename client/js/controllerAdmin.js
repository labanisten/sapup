var myModule = angular.module('systemAvailability', ['mongodbModule', 'utilsModule', 'directiveModule']);

myModule.controller("adminViewCtrl", function($scope, db, Utils) {

// Collection object for editable lists 
	var collection = function(data, db, groupBy) {

		var that = {},
			items = data,
			itemToUpdate = {};

		var sortOnGroupAndOrder = function(a, b) {
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
		};

		var getSortedItemArray = function() {
			sortedItems = items; 
			return sortedItems.sort(sortOnGroupAndOrder); 
		};

		var getHighestOrderInGroup = function(groupName) {
			var highestOrder = 0;  
			
			for (var i = 0; i < items.length; i++) {
				if (items[i].order > highestOrder && items[i][groupBy] == groupName) {
					highestOrder = items[i].order;
				};
			};
			return highestOrder;
		};


		var getItems = function() {
			return items; 
		};

		var getItemToUpdate = function() {
			return itemToUpdate;
		}; 


		var isItemWithLowestOrderInGroup = function(item) {
			if (item.order == 1) {
				return true;
			};	
		};

	    var isItemWithHighestOrderInGroup = function(item) {
	    	return item.order == getHighestOrderInGroup(item[groupBy]);
		};

		var setSelectedItemByID = function(id) {
			var i; 
			for (i = 0; items.length; i++) {
				if (items[i]._id == id) {
					itemToUpdate = items[i];
					break;
				};
			};		
		};

		var getClassForUpArrow = function(item) {
			if (isItemWithLowestOrderInGroup(item)) {
				return "invisible";
			};
		};

		var getClassForDownArrow = function(item) {
			if (isItemWithHighestOrderInGroup(item)) {
				return "invisible";
			};
		};

		var updateItemInDB = function(item) {
	
			var updateItem = new db(item); 
			updateItem.update(updateItem._id).then(function(response) {
					if (response.data) {
						//Success - update model here?
					} else {
						//Unable to update
					};
			});
			itemToUpdate = {};
		};

	    var moveItemUp = function(item) {			
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
		};

		var moveItemDown = function(item) {
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
		};


		var updateOrderForItemsAfterDeletion = function(fromOrder) {
			for (var i = 0; i < items.length; i++) {
				if (items[i].order > fromOrder) {
					items[i].order--; 
					updateItemInDB(items[i]);
				};
			};
		};

		var deleteItem = function() {

			db.remove(itemToUpdate._id).then(function(response) {
					if (response.data) {
						for (var i = 0; i < items.length; i++) {
							if (items[i]._id == itemToUpdate._id) {
								items.splice(i, 1);
								updateOrderForItemsAfterDeletion(itemToUpdate.order);
							};
						};			
					} else {
						//Unable to delete
					};
			});
		};

		var saveItem = function() {

			itemToUpdate.order = getHighestOrderInGroup(itemToUpdate[groupBy]) + 1;

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
		that.isItemWithLowestOrderInGroup = isItemWithLowestOrderInGroup;
		that.isItemWithHighestOrderInGroup = isItemWithHighestOrderInGroup;
		that.setSelectedItemByID = setSelectedItemByID; 
		that.getClassForDownArrow = getClassForDownArrow; 		
		that.getClassForUpArrow  =getClassForUpArrow;
		that.moveItemDown = moveItemDown; 
		that.moveItemUp = moveItemUp; 
		that.getItems = getItems;
		that.getItemToUpdate = getItemToUpdate;
		that.deleteItem = deleteItem;
		that.saveItem = saveItem; 
		that.updateItem = updateItem; 
		that.getItems = getItems; 

		return that;

	}; 


	// Get systems from DB and create collection 
	var promise = db.Systemname.get();
	promise.then(function(data) {
		$scope.systems = data;				
		$scope.systemsCollection = collection($scope.systems, db.Systemname, 'systemgroup');
	});

	// Get systemgroups from database and create collection
	var promise = db.Systemgroup.get();
	promise.then(function(data) {
		$scope.systemgroups = data;
		$scope.systemgroupsCollection = collection($scope.systemgroups, db.Systemgroup);
	});

	// Get alert from database and create collection
	var promise = db.Alert.get();
	promise.then(function(data) {
		$scope.alerts = data;
		$scope.alertsCollection = collection($scope.alerts, db.Alert);				
	});


	
});