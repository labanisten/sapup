var myModule = angular.module('systemAvailability', ['mongodbModule', 'calendarModule', 'utilsModule', 'adminModule', 'initializeModule']);

myModule.controller("adminViewCtrl", function($scope, db, Utils, admin) {
	
	$scope.systemnames = getSystemNames();
	$scope.systemstatuses = getSystemStatuses();
	$scope.alerttypes = getAlertTypes();
	$scope.alertlog = getAlertLog();
	
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
			admin.updateAlertLogTable(data)
  		});

		return []; 
	}
	
	$scope.saveSystemName = function() {

		if ($scope.systemNameInput) {			
			var systemname = new db.Systemname(); 
			systemname.name = $scope.systemNameInput.toUpperCase();
			systemname.create().then(function(newSystemname) {
			   admin.addLineToSystemNamesTable(newSystemname);
			});
		}
	}
	
	
	$scope.saveStatusType = function() {

		if ($scope.statusTypeInput) {			
			var systemstatus = new db.Systemstatus(); 
			systemstatus.status = $scope.statusTypeInput;
			systemstatus.create().then(function(newSystemstatus) {
			   admin.addLineToStatusTypesTable(newSystemstatus);
			});
		}
	}
	
	
	$scope.saveAlertType = function() {

		if ($scope.alertTypeInput) {			
			var alerttype = new db.Alerttype(); 
			alerttype.type = $scope.alertTypeInput;
			alerttype.create().then(function(newAlerttype) {
			   admin.addLineToAlertTypesTable(newAlerttype);
			});
		}

	}
	
	
	$scope.deleteSystemName = function() {
	
		var selectedItem = admin.getSystemNameSelected();

		if (selectedItem.hasValue)
		{
			db.Systemname.remove(selectedItem.id).then(function(response) {
					if (response.data.ok) {
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
					if (response.data.ok) {
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
					if (response.data.ok) {
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
					if (response.data.ok) {
						admin.removeSelectedAlertLogRow();
					} else {
						//Unable to delete
					}
			});
		}
	};
	
	
});


myModule.controller("TimelineCtrl", function($scope, db, Calendar, Utils) {

	$scope.systemlines = getSystemData(); 
	$scope.systemnames = getSystemNames();
	$scope.systemstatuses = getSystemStatuses();
	$scope.alertlines = getAlertData();
	$scope.alerttypes = getAlertTypes();

	$scope.selectedElement = {
		_id:"",
		system: "",
		status: "",
		start: undefined,
		end: undefined,
		comment: "",
		statusLineRef:""
	};
	
	
	$scope.systemFormData = {
		_id:"",
		system: "",
		status: "",
		start: undefined,
		end: undefined,
		comment: ""
	};
	
	
	$scope.addAlertLine = {
		title: "",
		alerttype: "",
		expdate: undefined,
		comment: ""
	};
	
	
	$scope.monthDayList = Calendar.getMonthDayList();
	$scope.monthWeekList = Calendar.getMonthWeekList();
	$scope.monthName = Calendar.getMonthName();
	
	$scope.selectedYear = Calendar.getCurrentYear();
	$scope.selectedMonth = Calendar.getCurrentMonth();
	
	$scope.noOfDaysInMonth =  Calendar.getNoOfDaysInMonth();
	$scope.dayNamesInMonth = Calendar.getDayNamesInMonth;
	$scope.shortDayNamesInMonth = Calendar.getShortDayNamesInMonth;
	$scope.months = Calendar.monthLabelsShort;
	$scope.monthLabels = Calendar.monthLabels;
	
	$scope.selectedYear = Calendar.getCurrentYear();
	$scope.selectedMonth = Calendar.getCurrentMonth();
	$scope.selectedMonthLabel = Calendar.getMonthName($scope.selectedMonth);

	$scope.setSelectedMonth = function(month) {
		$scope.selectedMonth = month;
	};

	$scope.getClassForMonth = function(month) {
		if (month == $scope.selectedMonth) {
			return "span1 month selectedmonth";
		} else {
			return "span1 month";
		};
	}

	$scope.gotoMonth = function(event, month) {
		$scope.selectedMonth = month;
		var elem = angular.element(event.srcElement);
		elem[0].className += " selectedmonth";
		
	};

	function getSystemData() {

		var promise = db.System.get(); 
		promise.then(function(data) {
			$scope.systemlines = data; 
  		});

		return [];

	}
	
	
	function getSystemStatuses(){

		var promise = db.Systemstatus.get(); 
		promise.then(function(data) {
			$scope.systemstatuses = data.rows; 
  		});

		return []; 
	}
	
	
	function getSystemNames(){

		var promise = db.Systemname.get(); 
		promise.then(function(data) {
			$scope.systemNames = data.rows; 
  		});

		return [];
	}


	function getAlertData() {
		var alerts = [];
		var currentDate = Utils.getDateString(new Date());

		var promise = db.Alert.get(); 
		promise.then(function(data) {
			$.each(data, function(i, v_alert) {
		
				if(v_alert.expdate >= currentDate){
					alerts.push(v_alert);
				}
				
			});
  			$scope.alertlines = alerts;

  		});
		return [];
	}
	
	
	function getAlertTypes(){

		var promise = db.Alerttype.get(); 
		promise.then(function(data) {
			$scope.alerttypes = data; 
  		});
		return []; 
	}
	
	
	$scope.addAlert = function() {
		if($("#alertForm").valid()){
			$('#addalertdialog').modal('hide');			
			var alert = new db.Alert($scope.addAlertLine); 
			alert.expdate = Utils.viewDateToDBDate(alert.expdate);
			alert.create().then(function(newAlert) {
			   $scope.alertlines.push(newAlert);
			});
			Utils.resetNewAlertForm();
		}
	};
	
	$scope.removeAlert = function(id) {
		db.alert.remove(id).then(function(response) {
					if (response.data.ok) {
						//success
					} else {
						//Unable to delete
					}
			});

	};



	$scope.removeStatusElement = function(id) {
		if($("#elementForm").valid()){
			var deletedStatusIndex;
			$.each($scope.systemlines, function(i, v_system) {
				if (v_system.system == $scope.systemFormData.system) {
					$.each(v_system.statuslines, function(j, v_status) {
						if (v_status.start == viewDateToDBdate($scope.systemFormData.start) && v_status.end == viewDateToDBdate($scope.systemFormData.end) && v_status.status == $scope.systemFormData.status) {
							$scope.systemlines[i].statuslines.splice(j, 1);
							CalendarData.fillSpaceWithEmptyElements(v_status, $scope.systemlines[i].statuslines);

							$scope.systemlines[i].statuslines.sort(custom_sort);
							savedStatusIndex = i;
						}
					});
				}
			});	
			
			updateStatuslineToDB(savedStatusIndex);
		}
	};
	
	
	$scope.updateStatusElement = function(id) {

		if($("#elementForm").valid()){	
			
			$.each($scope.systemlines, function(i, v_system) {
					
				if (v_system.system == $scope.systemFormData.system) {
				
					systemElement = { 
						"system": v_system.system,
						"statuslines": $scope.systemlines[i].statuslines
					};
					
					CalendarData.removeCalendarElement(systemElement, $scope.selectedElement);
					
					var start = viewDateToDBdate($scope.systemFormData.start);
					var end = viewDateToDBdate($scope.systemFormData.end);
					
					statusElement = {
						"start": start,
						"end": end,
						"status": $scope.systemFormData.status
					}
					
					systemElement.statuslines.push(statusElement);
		
					Systems.systems.update({id:$scope.systemlines[i]._id.$oid}, systemElement, function(item){
						addLineToElementModalLog("Element updated in " + $scope.systemlines[i].system);
						$scope.systemlines = getSystemData();
					});
					
					return false;
					
				}else{
					//addLineToElementModalLog("Error!!!!!");
				}
						
			});
		
		}
			
	};
	
		
	$scope.addStatusElement = function() {

		if($("#elementForm").valid()){

			$.each($scope.systemlines, function(i, v_system) {
				
					if (v_system.system == $scope.systemFormData.system) {
					
						systemElement = { 
							"system": v_system.system,
							"statuslines": $scope.systemlines[i].statuslines
						};
						
						var start = viewDateToDBdate($scope.systemFormData.start);
						var end = viewDateToDBdate($scope.systemFormData.end);
						
						statusElement = {
							"start": start,
							"end": end,
							"status": $scope.systemFormData.status
						}
						
						systemElement.statuslines.push(statusElement);
			
						Systems.systems.update({id:$scope.systemlines[i]._id.$oid}, systemElement, function(item){
							addLineToElementModalLog("Element added to " + $scope.systemlines[i].system);
							$scope.systemlines = getSystemData();
						});
						
						return false;
						
					}else{
						//addLineToElementModalLog("Error!!!!!");
					}
					
			});
		
		}
	};

});