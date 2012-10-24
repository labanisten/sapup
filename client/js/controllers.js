var myModule = angular.module('systemAvailability', ['mongodbModule', 'calendarModule', 'utilsModule', 'directiveModule']);


myModule.controller("TimelineCtrl", function($scope, db, Calendar, Utils) {

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
	
	$scope.updateFormData = {
		_id:"",
		system: "",
		status: "",
		start: undefined,
		end: undefined,
		comment: ""
	};
	
	$scope.addFormData = {
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
	$scope.selectedMonthLabel = Calendar.getMonthName($scope.selectedMonth);
	//$scope.messageAreaClass = "invisible hide";

	$scope.messageAreaClass = function() {
		if ($scope.alertlines.length > 0) {
			return "accordion span12";
		} else {
			return "invisible hide";
		};
	}

	function elementExists(sysIndex, elmIndex) {
		var result = false;
		if($scope.systemlines[sysIndex].statuslines[elmIndex]) {
			result = true;
		}
		return result;
	}
	
	$scope.getClassForElement = function(sysIndex, elmIndex) {
		var classString = "";
		if($scope.systemlines.length > 0) {

			if(elementExists(sysIndex, elmIndex)){
				var systemString = $scope.systemlines[sysIndex].statuslines[elmIndex].status;
				var statusClass; 
				switch (systemString) {
					case 'Downtime' : 
						statusClass = 'downtime'; 
						break; 
					case "Maybe down":
						statusClass = 'maybedown'; 
						break; 
					case "Ready for test":
						statusClass = 'readyfortest'; 
						break; 
				};
				classString = "element-inner element-click " + statusClass; 
				if (sysIndex == $scope.selectedElement.sysIndex && elmIndex == $scope.selectedElement.elmIndex) {
					classString += " selected";
				}
			}
		}
		
		return classString;
	};
	
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
		}
	};
	
	$scope.gotoMonth = function(event, month) {
		
		if($scope.hoverElement.hasValue) {
			$scope.hoverElement.element.popover('hide');
		}
		
		$scope.clearHoverElement();
		$scope.unSelectElement();
						
		$scope.selectedMonth = month;
		var elem = angular.element(event.srcElement);
		elem[0].className += " selectedmonth";
	};
	
	$scope.gotoPreviousYear = function() {
		$scope.selectedYear = $scope.selectedYear - 1;
		getSystemData();
	};
	
	$scope.gotoNextYear = function() {
		$scope.selectedYear = $scope.selectedYear + 1;
		getSystemData();
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
			$scope.systemnames.sort(function(a,b){return a.order - b.order}); //Sort by prder property

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
			// if (alerts.length > 0) {
			// 	$scope.messageAreaClass = "span12 accordion"; 
			// };


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
			}else {
				//Unable to delete
			}
		});
	};
	
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

	$scope.removeStatusElement = function() {
		$.each($scope.systemlines, function(i, v_system) {
			if (v_system.system == $scope.selectedElement.system) {

				var systemElement = {
						"system": v_system.system,
						"statuslines": $scope.systemlines[i].statuslines
					};
					
				spliceCalendarElement(systemElement, $scope.selectedElement);
					
				system = new db.System(systemElement);
				system.update(v_system._id).then(function(newSystemElement) {
					$scope.unSelectElement();
					getSystemData();
				});
				return false;
			}
		});
	};
	
	$scope.updateStatusElement = function() {

		var existingSystem;
		var i;
		for (i = 1; i < $scope.systemlines.length; i++) {
			if ( $scope.systemlines[i].system == $scope.updateFormData.system) {
				existingSystem = $scope.systemlines[i];
				break;
			}
		}

		if (existingSystem) {
			var systemElement = {
				"system": existingSystem.system,
				"statuslines": existingSystem.statuslines
			};
			
			var statusElement = {
				"start": Utils.viewDateToDBDate($scope.updateFormData.start),
				"end": Utils.viewDateToDBDate($scope.updateFormData.end),
				"status": $scope.updateFormData.status,
				"comment": $scope.updateFormData.comment
			};
			
			spliceCalendarElement(systemElement, $scope.selectedElement);
			systemElement.statuslines.push(statusElement);

			var system = new db.System(systemElement);
			system.update(existingSystem._id).then(function(newSystemElement) {
				Utils.addLineToElementModalLog("Element updated");
				$scope.unSelectElement();
				getSystemData();
			});
		}
	};
		
	$scope.addStatusElement = function() {

		if ($("#elementForm").valid()) {

			var existingSystem,
				systemElement,
				statusElement,
				system;

			for (var i = 1; i < $scope.systemlines.length; i++) {
				if ( $scope.systemlines[i].system == $scope.addFormData.system) {
					existingSystem = $scope.systemlines[i];
					break;
				}
			}


			if (existingSystem) {
				//Update existing system
				systemElement = {
					"system": existingSystem.system,
					"statuslines": existingSystem.statuslines
				};
				
				statusElement = {
					"start": Utils.viewDateToDBDate($scope.addFormData.start),
					"end": Utils.viewDateToDBDate($scope.addFormData.end),
					"status": $scope.addFormData.status,
					"comment": $scope.addFormData.comment
				};
				
				
				systemElement.statuslines.push(statusElement);

				system = new db.System(systemElement);

				system.update(existingSystem._id).then(function(newSystemElement) {
					Utils.addLineToElementModalLog("Element added to " + existingSystem.system);
					$scope.unSelectElement();
					getSystemData();
				});

				
				
			} else {
				//Post new system
				var systemText;
				$.each($scope.systemnames, function(i, v_system) {
					if(v_system.name == $scope.addFormData.system) {
						systemText = v_system.text;
						return false;
					}
				});
				
				var systemElement = { 
					"system": $scope.addFormData.system,
					"text": systemText,
					"statuslines": []
				};
				
				statusElement = {
					"start": Utils.viewDateToDBDate($scope.addFormData.start),
					"end": Utils.viewDateToDBDate($scope.addFormData.end),
					"status": $scope.addFormData.status,
					"comment": $scope.addFormData.comment
				};
								
				systemElement.statuslines.push(statusElement);
				
				system = new db.System(systemElement);
				
				system.create().then(function(newSystemElement) {
					Utils.addLineToElementModalLog("Element added to " + newSystemElement.system);
					$scope.unSelectElement();
					getSystemData();
				});

			}
		}
	};
	
	function fillSelectedElement(sysIndex, elmIndex) {
		var sys = $scope.systemlines[sysIndex];
		var elm = $scope.systemlines[sysIndex].statuslines[elmIndex];
		$scope.selectedElement._id = sys._id;
		$scope.selectedElement.system = sys.system;
		$scope.selectedElement.status = elm.status;
		$scope.selectedElement.start = Utils.convertToDate(elm.start);
		$scope.selectedElement.end = Utils.convertToDate(elm.end);
	}
	
	function fillupdateFormData(sysIndex, elmIndex) {
		var sys = $scope.systemlines[sysIndex];
		var elm = $scope.systemlines[sysIndex].statuslines[elmIndex];
		$scope.updateFormData._id = sys._id;
		$scope.updateFormData.system = sys.system;
		$scope.updateFormData.status = elm.status;
		$scope.updateFormData.start = Utils.dbDateToViewDate(elm.start);
		$scope.updateFormData.end = Utils.dbDateToViewDate(elm.end);
		$scope.updateFormData.comment = elm.comment;
	}

	$scope.setSelectedElement = function(sysIndex, elmIndex) {
		$scope.selectedElement.elmIndex = elmIndex;
		$scope.selectedElement.sysIndex = sysIndex;
		fillSelectedElement(sysIndex, elmIndex);
		fillupdateFormData(sysIndex, elmIndex);
	};
	
	$scope.unSelectElement = function() {
		$scope.selectedElement.elmIndex = -1;
		$scope.selectedElement.sysIndex = -1;
		clearSelectedElement();
		clearupdateFormData();
	};
	
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
	};
	
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
	};
		
	function clearSelectedElement() {
		$scope.selectedElement._id = "";
		$scope.selectedElement.system = "";
		$scope.selectedElement.status = "";
		$scope.selectedElement.start = "";
		$scope.selectedElement.end = "";
		$scope.selectedElement.comment = "";
	}
	
	function clearupdateFormData() {
		$scope.updateFormData.system = "";
		$scope.updateFormData.status = "";
		$scope.updateFormData.start = "";
		$scope.updateFormData.end = "";
		$scope.updateFormData.comment = "";
	}
	
	$scope.callModal = function(event) {
		$("#editelementdialog").modal('show');
	};
	
	$scope.clearModalLog = function(event) {
		Utils.clearModalLog();
	};
});