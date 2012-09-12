var myModule = angular.module('systemAvailability', ['mongolabModule', 'calendarModule']);

myModule.controller("adminViewCtrl", function($scope, Systems) {
	
	$scope.systemnames = getSystemNames();
	$scope.systemstatuses = getSystemStatuses();
	$scope.alerttypes = getAlertTypes();
	$scope.alertlog = getAlertLog();
	
	$scope.systemNameInput = "";
	$scope.statusTypeInput = "";
	$scope.alertTypeInput = "";
	
	
	function getSystemNames(){

		var systemNames = Systems.systemnames.query(function() {
			adminTables.updateSystemNamesTable(systemNames);
		});	

		return systemNames;
	}
	
	
	function getSystemStatuses(){
		var statusTypes = Systems.systemstatuses.query(function(){
			adminTables.updateStatusTypesTable(statusTypes);
		});	
		
		return statusTypes;
	}
	
	
	function getAlertTypes(){
		var alertTypes = Systems.alerttypes.query(function(){
			adminTables.updateAlertTypesTable(alertTypes);
		});	
		
		return alertTypes;
	}
	
	
	function getAlertLog(){
		var alertLog = Systems.alerts.query(function(){
			adminTables.updateAlertLogTable(alertLog);
		});	
		
		return alertLog;
	}
	
	$scope.saveSystemName = function() {

		if ($scope.systemNameInput != "")
		{			
			var sLine = { name: "" };						
			sLine.name = $scope.systemNameInput.toUpperCase();
					
			Systems.systemnames.save(sLine, function(item){
				adminTables.addLineToSystemNamesTable(sLine.name, item._id.$oid);
			});				
		}
	}
	
	
	$scope.saveStatusType = function() {

		if ($scope.statusTypeInput != "")
		{			
			var sLine = { status: $scope.statusTypeInput };			
					
			Systems.systemstatuses.save(sLine, function(item){
				adminTables.addLineToStatusTypesTable(sLine.status, item._id.$oid);
			});				
		}
	}
	
	
	$scope.saveAlertType = function() {

		if ($scope.alertTypeInput != "")
		{			
			var sLine = { type: $scope.alertTypeInput };			
					
			Systems.alerttypes.save(sLine, function(item){
				adminTables.addLineToAlertTypesTable(sLine.type, item._id.$oid);
			});				
		}
	}
	
	
	$scope.deleteSystemName = function() {
	
		var selectedItem = adminTables.getSystemNameSelected();

		if (selectedItem.hasValue)
		{
				Systems.systemnames.remove({id:selectedItem.id},  function(item){
					adminTables.removeSelectedSystemNamesRow();
				});
		}
	};
	
	
	$scope.deleteStatusType = function() {
	
		var selectedItem = adminTables.getStatusTypeSelected();

		if (selectedItem.hasValue)
		{
				Systems.systemstatuses.remove({id:selectedItem.id},  function(item){
					adminTables.removeSelectedStatusTypesRow();
				});
		}
	};
	
	
	$scope.deleteAlertType = function() {
	
		var selectedItem = adminTables.getAlertTypeSelected();

		if (selectedItem.hasValue)
		{
				Systems.alerttypes.remove({id:selectedItem.id},  function(item){
					adminTables.removeSelectedAlertTypesRow();
				});
		}
	};
	
	
	$scope.deleteAlertLog = function() {
	
		var selectedItem = adminTables.getAlertLogSelected();

		if (selectedItem.hasValue)
		{
				Systems.alerts.remove({id:selectedItem.id},  function(item){
					adminTables.removeSelectedAlertLogRow();
				});
		}
	};
	
	
});


myModule.controller("TimelineCtrl", function($scope, Systems, Calendar) {

	this.Calendar = Calendar;
	this.Systems = Systems;

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
		//$scope.selectedYear = Calend ar.getCurrentYear();
		console.log("go!!");
		$scope.selectedMonth = month;

		var elem = angular.element(event.srcElement);
		//elem.addClass("selectedmonth");
		elem[0].className += " selectedmonth";
		
	};

	function getSystemData() {
		var calendartable = [];
		var syslines = Systems.systems.query(function() {
			calendartable = syslines;
			calendartable.sort(ascSystemSort);
			$scope.systemlines = calendartable;
		});
		return calendartable;
	}
	
	
	function getSystemStatuses(){
		var systemStatuses = Systems.systemstatuses.query(function(){});
		return systemStatuses;
	}
	
	
	function getSystemNames(){
		var systemNames = Systems.systemnames.query(function() {
		});
		return systemNames;
	}


	function getAlertData() {
		var alerts = [];
		var currentDate = getDateString(new Date());

		var alertLines = Systems.alerts.query(function() {
		
			$.each(alertLines, function(i, v_alert) {
			
				if(v_alert.expdate >= currentDate){
					alerts.push(v_alert);
				}
				
			});
		});
		
		return alerts;
	}
	
	
	function getAlertTypes(){
		var alertTypes = Systems.alerttypes.query(function(){});
		return alertTypes;
	}
	
	
	$scope.addAlert = function() {
		if($("#alertForm").valid()){
			$('#addalertdialog').modal('hide');
			var alertLine = $scope.addAlertLine;
			alertLine.expdate = convertDateToDatabaseFormat(alertLine.expdate);
			Systems.alerts.save(alertLine, function(item){
				$scope.alertlines.push(item);
			});
			$scope.resetNewAlertForm();
		}
	};
	
	$scope.removeAlert = function(id) {
		Systems.alerts.delete({id: id.$oid}, function(){});
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
	
	
	$scope.setSelectetElement = function(systemLine, statusLine) {

		if(statusLine.viewcolor != "available" && statusLine.viewcolor != "selected"){

			if($scope.selectedElement.statusLineRef != ""){
				$scope.selectedElement.statusLineRef.viewcolor = $scope.selectedElement.statusLineRef.status;
			}
				
			$scope.systemFormData._id = systemLine._id;
			$scope.systemFormData.system = systemLine.system;
			$scope.systemFormData.status = statusLine.status;
			//$scope.systemFormData.start = dateObjectToViewDate(statusLine.start);
			//$scope.systemFormData.end = dateObjectToViewDate(statusLine.end);
			$scope.systemFormData.start = dbDateToViewDate(statusLine.start);
			$scope.systemFormData.end = dbDateToViewDate(statusLine.end);
			$scope.systemFormData.comment = "";
			
			$scope.selectedElement._id = systemLine._id;
			$scope.selectedElement.system = systemLine.system;
			$scope.selectedElement.status = statusLine.status;
			$scope.selectedElement.start = convertToDate(statusLine.start);
			$scope.selectedElement.end = convertToDate(statusLine.end);
			//$scope.systemFormData.comment = statusLine.comment;			
			$scope.selectedElement.statusLineRef = statusLine;
			
			statusLine.viewcolor = 'selected';
		}
		else
		{
			statusLine.viewcolor = statusLine.status;
			
			if($scope.selectedElement.statusLineRef != ""){
				$scope.selectedElement.statusLineRef.viewcolor = $scope.selectedElement.statusLineRef.status;
			}
			
			$scope.systemFormData.system = "";
			$scope.systemFormData.status = "";
			$scope.systemFormData.start = "";
			$scope.systemFormData.end = "";
			$scope.systemFormData.comment = "";
			
			
			$scope.selectedElement._id = "";
			$scope.selectedElement.system = "";
			$scope.selectedElement.status = "";
			$scope.selectedElement.start = "";
			$scope.selectedElement.end = "";
			$scope.selectedElement.comment = "";

		}	
	};
	
	
});