var myModule = angular.module('systemAvailability', ['mongodbModule', 'utilsModule', 'adminModule', 'directiveModule']);

myModule.controller("adminViewCtrl", function($scope, db, Utils, admin) {
	
	$scope.systemnames = getSystemNames();
	$scope.systemstatuses = getSystemStatuses();
	$scope.alerttypes = getAlertTypes();
	$scope.alertlog = getAlertLog();
	

	$scope.systemnameToUpdate = {};
	
	$scope.statusTypeInput = "";
	$scope.alertTypeInput = "";

	$scope.editMode = false;

	$scope.toggleEditMode = function() {
		$scope.editMode = !$scope.editMode;
	}
	
	$scope.setSelectedSystemByID = function(id) {
		var i; 
		for (i = 0; $scope.systemnames.length; i++) {
			if ($scope.systemnames[i]._id == id) {
				$scope.systemnameToUpdate = $scope.systemnames[i];
				break;
			}
		};		
	}


	$scope.isItemWithLowestOrder = function(order) {
		if (order == 1) {
			return "invisible";
		} 
	} 

	$scope.isItemWithHighestOrder = function(thisOrder) {
		var highestOrder = 0; 
		for (var i = 0; i < $scope.systemnames.length; i++) {
			if ($scope.systemnames[i].order >= highestOrder) {
				highestOrder = $scope.systemnames[i].order;		
			}
		};		
		if (thisOrder == highestOrder) {
			return "invisible";
		}; 
	}

	$scope.moveItemUp = function(system) {
		
		var order; 

		for (var i = 0; i < $scope.systemnames.length; i++) {
			if ($scope.systemnames[i]._id == system._id) {
				order = $scope.systemnames[i].order;		
				break;
			}			
		};

		for (var i = 0; i < $scope.systemnames.length; i++) {
			if ($scope.systemnames[i].order == order && order > 1) {
				$scope.systemnames[i].order--;
			} else if (order - 1 == $scope.systemnames[i].order) {
				$scope.systemnames[i].order++;
			};
		};

		for (var i = 0; i < $scope.systemnames.length; i++) {
			setSelectedSystemByIndex(i); 
			$scope.updateSystemName();
		};

	}

	$scope.moveItemDown = function(system) {
		
		var order; 

		for (var i = 0; i < $scope.systemnames.length; i++) {
			if ($scope.systemnames[i]._id == system._id) {
				order = $scope.systemnames[i].order;		
				break;
			}
		};

		for (var i = 0; i < $scope.systemnames.length; i++) {
			if ($scope.systemnames[i].order == order && order < $scope.systemnames.length) {
				$scope.systemnames[i].order++;
			} else if (order + 1 == $scope.systemnames[i].order) {
				$scope.systemnames[i].order--;
			};
		};
	
		for (var i = 0; i < $scope.systemnames.length; i++) {
			setSelectedSystemByIndex(i); 
			$scope.updateSystemName();
		};

	}
	
	function setSelectedSystemByIndex(index) {
		$scope.systemnameToUpdate = $scope.systemnames[index];
	}

	function getSystemNames(){

		var promise = db.Systemname.get();
		promise.then(function(data) {
			admin.updateSystemNamesTable(data);
			$scope.systemnames = data;
		});

		return [];
	}
	

	function getSystemStatuses(){

		var promise = db.Systemstatus.get();
		promise.then(function(data) {
			admin.updateStatusTypesTable(data);
		});

		return [];
	}
	
	
	function getAlertTypes(){
	
		var promise = db.Alerttype.get();
		promise.then(function(data) {
			admin.updateAlertTypesTable(data);
		});

		return [];
	}
	
	
	function getAlertLog(){
	
		var promise = db.Alert.get();
		promise.then(function(data) {
			$scope.alertlog = data;
		});

		return [];
	}
	
	$scope.saveSystemName = function() {

		$scope.systemnameToUpdate.name.toUpperCase();
		$scope.systemnameToUpdate.order = $scope.systemnames.length + 1;
		var newSystem = new db.Systemname($scope.systemnameToUpdate);
		newSystem.create().then(function(createdSystem) {
			$scope.systemnames.push(createdSystem);
		});

	};
	
	
	$scope.saveStatusType = function() {

		if ($scope.statusTypeInput) {
			var systemstatus = new db.Systemstatus();
			systemstatus.status = $scope.statusTypeInput;
			systemstatus.create().then(function(newSystemstatus) {
				admin.addLineToStatusTypesTable(newSystemstatus);
			});
		}
	};
	
	
	$scope.saveAlertType = function() {

		if ($scope.alertTypeInput) {
			var alerttype = new db.Alerttype();
			alerttype.type = $scope.alertTypeInput;
			alerttype.create().then(function(newAlerttype) {
				admin.addLineToAlertTypesTable(newAlerttype);
			});
		}

	};
	
	
	$scope.deleteSystemName = function() {

		db.Systemname.remove($scope.systemnameToUpdate._id).then(function(response) {
				if (response.data) {
					for (var i = 0; i < $scope.systemnames.length; i++) {
						if ($scope.systemnames[i]._id == $scope.systemnameToUpdate._id) {
							$scope.systemnames.splice(i, 1);
						}
					};			
				} else {
					//Unable to delete
				}
		});
	};
	
	$scope.updateSystemName = function() {
	
		var systemname = new db.Systemname($scope.systemnameToUpdate); 
		delete systemname._id;
		systemname.update($scope.systemnameToUpdate._id).then(function(response) {
				if (response.data) {
					var updatedSystemname;
				} else {
					//Unable to update
				}
		});
	};
	
	
	$scope.deleteStatusType = function() {
	
		var selectedItem = admin.getStatusTypeSelected();

		if (selectedItem.hasValue) {
			db.Systemstatus.remove(selectedItem.id).then(function(response) {
					if (response.data.delete) {
						admin.removeSelectedStatusTypesRow();
					} else {
						//Unable to delete
					}
			});
		}
	};
	
	
	$scope.deleteAlertType = function() {
	
		var selectedItem = admin.getAlertTypeSelected();

		if (selectedItem.hasValue) {
			db.Alerttype.remove(selectedItem.id).then(function(response) {
					if (response.data.delete) {
						admin.removeSelectedAlertTypesRow();
					} else {
						//Unable to delete
					}
			});
		}
	};
	
	
	$scope.deleteAlertLog = function(index) {
	
		db.Alert.remove($scope.alertlog[index]._id).then(function(response) {
				if (response.data.delete) {
					$scope.alertlog.splice(index, 1);
				} else {
					//Unable to delete
				}
		});
	};
	
	
});