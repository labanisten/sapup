var myModule = angular.module('systemAvailability', ['mongolabModule', 'calendarModule', 'utilsModule']);

myModule.controller("adminViewCtrl", function($scope, Systems, Utils) {
	
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


myModule.controller("TimelineCtrl", function($scope, Systems, Calendar, Utils) {

	this.Calendar = Calendar;
	this.Systems = Systems;
	this.Utils = Utils;

	$scope.systemlines = getSystemData();
	$scope.systemnames = getSystemNames();
	$scope.systemstatuses = getSystemStatuses();
	$scope.alertlines = getAlertData();
	$scope.alerttypes = getAlertTypes();

	$scope.selectedElement = {
		_id: "",
		system: "",
		status: "",
		start: undefined,
		end: undefined,
		comment: "",
		sysIndex: -1,
		elmIndex: -1
		//hasValue: false
	};
	
	
	$scope.hoverElement = {
		_id: "",
		system: "",
		status: "",
		start: undefined,
		end: undefined,
		comment: "",
		element:""
		//hasValue: false
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
	
	//$scope.selectedYear = Calendar.getCurrentYear();
	//$scope.selectedMonth = Calendar.getCurrentMonth();
	$scope.selectedMonthLabel = Calendar.getMonthName($scope.selectedMonth);

	$scope.getClassForElement = function(sysIndex, elmIndex) {
		//class="element-inner {{systemlines['+i+'].statuslines['+result.index+'].status}} element-click"
		var classString = "";
		
		if($scope.systemlines.length > 0) {
		
			/*if(sysIndex == 12){
			 console.log("");
			}*/
			
			//console.log("sys: " + sysIndex + " elm: " + elmIndex + " status: " + $scope.systemlines[sysIndex].statuslines[elmIndex].status);
			var systemString = $scope.systemlines[sysIndex].statuslines[elmIndex].status;
			classString = "element-inner element-click " + systemString;
			if (sysIndex == $scope.selectedElement.sysIndex && elmIndex == $scope.selectedElement.elmIndex) {classString += " selected";};
		}
		
		return classString;
	}	
	
	function isAlreadySelected(sysIndex, elmIndex) {
		var result = false;
		if($scope.selectedElement.sysIndex == sysIndex && $scope.selectedElement.elmIndex == elmIndex) {result = true;}
		return result;
	}
	
	$scope.selectElement = function(event, sysIndex, elmIndex) {
		if(isAlreadySelected(sysIndex, elmIndex)) {
			$scope.unSelectElement();
		}else{	
			$scope.setSelectedElement(sysIndex, elmIndex);
		}
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
		var calendartable = [];
		var syslines = Systems.systems.query(function() {
			calendartable = syslines;
			calendartable.sort(Utils.ascSystemSort);
			$scope.systemlines = calendartable;
		});
		return calendartable;
	}
	
	
	function getSystemStatuses(){
		var systemStatuses = Systems.systemstatuses.query(function(){});
		return systemStatuses;
	}
	
	
	function getSystemNames(){
		var systemNames = Systems.systemnames.query(function(){});
		return systemNames;
	}


	function getAlertData() {
		var alerts = [];
		var currentDate = Utils.getDateString(new Date());

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
			alertLine.expdate = Utils.viewDateToDBdate(alertLine.expdate);
			Systems.alerts.save(alertLine, function(item){
				$scope.alertlines.push(item);
			});
			$scope.resetNewAlertForm();
		}
	};
	
	$scope.removeAlert = function(id) {
		Systems.alerts.delete({id: id.$oid}, function(){});
	};

	$scope.removeStatusElement = function() {
	
		$.each($scope.systemlines, function(i, v_system) {
					
			if (v_system.system == $scope.systemFormData.system) {
			
				//var newObject = jQuery.extend({},true, $scope.systemlines[i].statuslines);
				var lines = [];
				
				$.each(v_system.statuslines, function(j, v_status) {
					var s = Utils.getDateString($scope.selectedElement.start);
					var e = Utils.getDateString($scope.selectedElement.end);
					if(v_status.start != s || 
						v_status.end != e ||
							v_status.status != $scope.selectedElement.status) {
						lines.push(v_status);
					}
					
				});
				
				var systemElement = { 
					"system": v_system.system,
					"statuslines": lines
				};
				
				//spliceCalendarElement(systemElement, $scope.selectedElement);
				
				//var start = Utils.viewDateToDBdate($scope.systemFormData.start);
				//var end = Utils.viewDateToDBdate($scope.systemFormData.end);
				
				/*var statusElement = {
					"start": start,
					"end": end,
					"status": $scope.systemFormData.status,
					"comment": $scope.systemFormData.comment 
				}*/
				
				//systemElement.statuslines.push(statusElement);
	
				
				Systems.systems.update({id:$scope.systemlines[i]._id.$oid}, systemElement, function(item){
					//$scope.unSelectElement();
					//$scope.clearHoverElement();
					$scope.systemlines = getSystemData();
				});
				
				return false;
				
			}else{
				//addLineToElementModalLog("Error!!!!!");
			}
		});
	};
	
	
	function removeElementInDataBase(system, item) {
	
		$.each(system.statuslines, function(j, v_status) {
			var statusStart = Utils.convertToDate(v_status.start);
			var statusEnd = Utils.convertToDate(v_status.end);
			
			if (statusStart.getTime() == item.start.getTime() && statusEnd.getTime() == item.end.getTime() && v_status.status == item.status) {
				
				system.statuslines.splice(j, 1);
				return false;
			}
		});
	}
	
	
	function spliceCalendarElement(system, item) {
	
		$.each(system.statuslines, function(j, v_status) {
			var statusStart = Utils.convertToDate(v_status.start);
			var statusEnd = Utils.convertToDate(v_status.end);
			
			if (statusStart.getTime() == item.start.getTime() && statusEnd.getTime() == item.end.getTime() && v_status.status == item.status) {
				
				system.statuslines.splice(j, 1);
				return false;
			}
		});
	}
			
	
	$scope.updateStatusElement = function() {

		if($("#elementForm").valid()){	
			
			$.each($scope.systemlines, function(i, v_system) {
					
				if (v_system.system == $scope.systemFormData.system) {
				
					var systemElement = { 
						"system": v_system.system,
						"statuslines": $scope.systemlines[i].statuslines
					};
					
					spliceCalendarElement(systemElement, $scope.selectedElement);
					
					var start = Utils.viewDateToDBdate($scope.systemFormData.start);
					var end = Utils.viewDateToDBdate($scope.systemFormData.end);
					
					var statusElement = {
						"start": start,
						"end": end,
						"status": $scope.systemFormData.status,
						"comment": $scope.systemFormData.comment 
					}
					
					systemElement.statuslines.push(statusElement);
		
					Systems.systems.update({id:$scope.systemlines[i]._id.$oid}, systemElement, function(item){
						Utils.addLineToElementModalLog("Element updated in " + $scope.systemlines[i].system);
						//$scope.unSelectElement();
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
					
						var systemElement = { 
							"system": v_system.system,
							"statuslines": $scope.systemlines[i].statuslines
						};
						
						var start = Utils.viewDateToDBdate($scope.systemFormData.start);
						var end = Utils.viewDateToDBdate($scope.systemFormData.end);
						
						var statusElement = {
							"start": start,
							"end": end,
							"status": $scope.systemFormData.status,
							"comment": $scope.systemFormData.comment 
						}
						
						systemElement.statuslines.push(statusElement);
			
						Systems.systems.update({id:$scope.systemlines[i]._id.$oid}, systemElement, function(item){
							Utils.addLineToElementModalLog("Element added to " + $scope.systemlines[i].system);
							$scope.unSelectElement();
							$scope.systemlines = getSystemData();
						});
						
						return false;
						
					}else{
						//addLineToElementModalLog("Error!!!!!");
					}			
			});
		}
	};

	$scope.setSelectedElement = function(sysIndex, elmIndex) {
		$scope.selectedElement.elmIndex = elmIndex;
		$scope.selectedElement.sysIndex = sysIndex;
		fillSelectedElement(sysIndex, elmIndex);
		fillSystemFormData(sysIndex, elmIndex);
	}
	
	$scope.unSelectElement = function() {
		$scope.selectedElement.elmIndex = -1;
		$scope.selectedElement.sysIndex = -1;
		clearSelectedElement();
		clearSystemFormData();	
	}
	
	$scope.setHoverElement = function(sysIndex, elmIndex, element) {
		var sys = $scope.systemlines[sysIndex];
		var elm = $scope.systemlines[sysIndex].statuslines[elmIndex];
		$scope.hoverElement._id = sys.id;
		$scope.hoverElement.system = sys.system;
		$scope.hoverElement.status = elm.status;
		$scope.hoverElement.start = Utils.dbDateToViewDate(elm.start);
		$scope.hoverElement.end = Utils.dbDateToViewDate(elm.end);
		$scope.hoverElement.comment = elm.comment;	
		$scope.hoverElement.element = element;
	}
	
	$scope.clearHoverElement = function() {
		$scope.hoverElement._id = "";
		$scope.hoverElement.system = "";
		$scope.hoverElement.status = "";
		$scope.hoverElement.start = "";
		$scope.hoverElement.end = "";
		$scope.hoverElement.comment = "";
	}
	
	function fillSelectedElement(sysIndex, elmIndex) {
		var sys = $scope.systemlines[sysIndex];
		var elm = $scope.systemlines[sysIndex].statuslines[elmIndex];
		$scope.selectedElement._id = sys.id;
		$scope.selectedElement.system = sys.system;
		$scope.selectedElement.status = elm.status;
		$scope.selectedElement.start = Utils.convertToDate(elm.start);
		$scope.selectedElement.end = Utils.convertToDate(elm.end);
		//$scope.systemFormData.comment = statusLine.comment;			
	}
	
	function fillSystemFormData(sysIndex, elmIndex) {
		var sys = $scope.systemlines[sysIndex];
		var elm = $scope.systemlines[sysIndex].statuslines[elmIndex];
		$scope.systemFormData._id = sys.id;
		$scope.systemFormData.system = sys.system;
		$scope.systemFormData.status = elm.status;
		//$scope.systemFormData.start = dateObjectToViewDate(statusLine.start);
		//$scope.systemFormData.end = dateObjectToViewDate(statusLine.end);
		$scope.systemFormData.start = Utils.dbDateToViewDate(elm.start);
		$scope.systemFormData.end = Utils.dbDateToViewDate(elm.end);
		$scope.systemFormData.comment = elm.comment;
	}
	
	function clearSelectedElement() {
		$scope.selectedElement._id = "";
		$scope.selectedElement.system = "";
		$scope.selectedElement.status = "";
		$scope.selectedElement.start = "";
		$scope.selectedElement.end = "";
		$scope.selectedElement.comment = "";
	}
	
	function clearSystemFormData() {
		$scope.systemFormData.system = "";
		$scope.systemFormData.status = "";
		$scope.systemFormData.start = "";
		$scope.systemFormData.end = "";
		$scope.systemFormData.comment = "";
	}
	
	$scope.callModal = function(event) {
		$("#editelementdialog").modal('show');
	}
	
	$scope.clearModalLog = function(event) {
		Utils.clearModalLog();
	}
});