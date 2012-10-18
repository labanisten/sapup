var myModule = angular.module('systemAvailability', ['mongodbModule', 'utilsModule', 'adminModule', 'directiveModule']);

myModule.controller("adminViewCtrl", function($scope, db, Utils, admin) {
	
	$scope.systemnames = getSystemNames();
	$scope.systemstatuses = getSystemStatuses();
	$scope.alerttypes = getAlertTypes();
	$scope.alertlog = getAlertLog();
	
	$scope.systemNameInput = "";
	$scope.systemTypeInput = "";
	$scope.systemTextInput = "";
	
	$scope.systemNameInput = "";
	$scope.statusTypeInput = "";
	$scope.alertTypeInput = "";
	
	
	function getSystemNames(){

		var promise = db.Systemname.get();
		promise.then(function(data) {
			admin.updateSystemNamesTable(data);
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
			admin.updateAlertLogTable(data);
		});

		return [];
	}
	
	$scope.saveSystemName = function() {

		if ($scope.systemNameInput) {
			var systemname = new db.Systemname();
			systemname.name = $scope.systemNameInput.toUpperCase();
			systemname.type = $scope.systemTypeInput.toUpperCase();
			systemname.text = $scope.systemTextInput.toUpperCase();
			systemname.create().then(function(newSystemname) {
				admin.addLineToSystemNamesTable(newSystemname);
			});
		}
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
	
		var selectedItem = admin.getSystemNameSelected();

		if (selectedItem.hasValue)
		{
			db.Systemname.remove(selectedItem.id).then(function(response) {
					if (response.data) {
						admin.removeSelectedSystemNamesRow();
					} else {
						//Unable to delete
					}
			});
		}
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
	
	
	$scope.deleteAlertLog = function() {
	
		var selectedItem = admin.getAlertLogSelected();

		if (selectedItem.hasValue) {
			db.Alert.remove(selectedItem.id).then(function(response) {
					if (response.data.delete) {
						admin.removeSelectedAlertLogRow();
					} else {
						//Unable to delete
					}
			});
		}
	};
	
	
});