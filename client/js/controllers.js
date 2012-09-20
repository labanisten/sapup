var myModule = angular.module('systemAvailability', ['mongodbModule', 'calendarModule', 'utilsModule', 'directiveModule']);


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
		element:"",
		hasValue: false
	};
	
	
	$scope.systemFormData = {
		_id:"",
		system: "",
		status: "",
		start: undefined,
		end: undefined,
		comment: ""
	};

	$scope.system = {
		system: "",
		status: "",
		start: undefined,
		end: undefined,
		comment: "",
		statuslines: []
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
			if (sysIndex == $scope.selectedElement.sysIndex && elmIndex == $scope.selectedElement.elmIndex) {
				classString += " selected";
			};
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
			$scope.systemstatuses = data; 
  		});

		return []; 
	}
	
	
	function getSystemNames(){

		var promise = db.Systemname.get(); 
		promise.then(function(data) {
			$scope.systemnames = data; 
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
	console.log("sada");
		$.each($scope.systemlines, function(i, v_system) {
					
			if (v_system.system == $scope.selectedElement.system) {
			
				//var newObject = jQuery.extend({},true, $scope.systemlines[i].statuslines);
				/*var lines = [];
				
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
				};*/
				
							
				
				var systemElement = { 
						"system": v_system.system,
						"statuslines": $scope.systemlines[i].statuslines
					};
					
					spliceCalendarElement(systemElement, $scope.selectedElement);
					//$scope.clearHoverElement();
					//$scope.unSelectElement();	
					//$('#maintable').remove();
					//$scope.systemlines = getSystemData();
					//$scope.systemlines = [];
				
				
				
				
				
				/*scope.hoverElement.element.popover('hide');
				scope.clearHoverElement();
				scope.unSelectElement();
				scope.$apply();*/
				//$scope.$destroy();
				
				/*
				Systems.systems.update({id:$scope.systemlines[i]._id.$oid}, systemElement, function(item){
					
					//$scope.systemlines = [];
					console.log("db");
					getSystemData();
					//$scope.apply();
				});*/
				
				system = new db.System(systemElement);
				system.update(v_system._id).then(function(newSystemElement) {
					//Utils.addLineToElementModalLog("Element added to " + $scope.systemlines[i].system);
					$scope.unSelectElement();
					getSystemData();
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

		//if($("#elementForm").valid()){	
			
			$.each($scope.systemlines, function(i, v_system) {
					
				if (v_system.system == $scope.systemFormData.system) {
				
					var systemElement = { 
						"system": v_system.system,
						"statuslines": $scope.systemlines[i].statuslines
					};
					
					spliceCalendarElement(systemElement, $scope.selectedElement);
			/*		
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
					*/
					return false;
					
				}else{
					//addLineToElementModalLog("Error!!!!!");
				}
			});
		//}
	};
	
		
	$scope.addStatusElement = function() {

		if ($("#elementForm").valid()) {

			var existingSystem;
			for (var i=1; i < $scope.systemlines.length; i++) {
				if ( $scope.systemlines[i].system == $scope.systemFormData.system) { 
					existingSystem = $scope.systemlines[i];
					break; 
				}
			}


			if (existingSystem) {
				//Update existing system 
				var systemElement = { 
					"system": existingSystem.system,
					"statuslines": existingSystem.statuslines
				};
				
				var statusElement = {
					"start": Utils.viewDateToDBDate($scope.systemFormData.start),
					"end": Utils.viewDateToDBDate($scope.systemFormData.end),
					"status": $scope.systemFormData.status,
					"comment": $scope.systemFormData.comment 
				}
				
				
				systemElement.statuslines.push(statusElement);

				system = new db.System(systemElement);

				system.update(existingSystem._id).then(function(newSystemElement) {
					Utils.addLineToElementModalLog("Element added to " + existingSystem.system);
					$scope.unSelectElement();
					$scope.systemlines = getSystemData();
				})

				
				
			} else {
				//Post new system 
				var systemElement = { 
					"system": $scope.systemFormData.system,
					"statuslines": []
				};
				
				var statusElement = {
					"start": Utils.viewDateToDBDate($scope.systemFormData.start),
					"end": Utils.viewDateToDBDate($scope.systemFormData.end),
					"status": $scope.systemFormData.status,
					"comment": $scope.systemFormData.comment 
				}
								
				systemElement.statuslines.push(statusElement);
				
				var system = new db.System(systemElement);
				system.create().then(function(newSystemElement) {
					Utils.addLineToElementModalLog("Element added to " + newSystemElement.system);
					$scope.unSelectElement();
					$scope.systemlines = getSystemData();
				})

			}
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
		$scope.hoverElement.hasValue = true;
	}
	
	$scope.clearHoverElement = function() {
		if($scope.hoverElement.hasValue) {
			$scope.hoverElement._id = "";
			$scope.hoverElement.system = "";
			$scope.hoverElement.status = "";
			$scope.hoverElement.start = "";
			$scope.hoverElement.end = "";
			$scope.hoverElement.comment = "";
			$scope.hoverElement.hasValue = false;
		}
	}
	
	function fillSelectedElement(sysIndex, elmIndex) {
		var sys = $scope.systemlines[sysIndex];
		var elm = $scope.systemlines[sysIndex].statuslines[elmIndex];
		$scope.selectedElement._id = sys._id;
		$scope.selectedElement.system = sys.system;
		$scope.selectedElement.status = elm.status;
		$scope.selectedElement.start = Utils.convertToDate(elm.start);
		$scope.selectedElement.end = Utils.convertToDate(elm.end);
		//$scope.systemFormData.comment = statusLine.comment;			
	}
	
	function fillSystemFormData(sysIndex, elmIndex) {
		var sys = $scope.systemlines[sysIndex];
		var elm = $scope.systemlines[sysIndex].statuslines[elmIndex];
		$scope.systemFormData._id = sys._id;
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