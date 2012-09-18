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