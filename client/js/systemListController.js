var myModule = angular.module('systemAvailabilityAdmin', ['mongodbModule', 'utilsModule', 'directiveModule']);

myModule.controller("systemListCtrl", function($scope, db, Utils) {

// Collection object for editable lists 

	var	items = data,
		itemToUpdate = {nom:"test", systemgroup:"blank"};


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


	var updateOrderForItemsAfterDeletion = function(fromItem) {
		for (var i = 0; i < items.length; i++) {
			if (items[i].order > fromItem.order && items[i][groupBy] == fromItem[groupBy]) {
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
							updateOrderForItemsAfterDeletion(itemToUpdate);
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