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

	$scope.selectedCompactSystem = {
		_id: "",
		system: "",
		sysIndex: -1,
		sysNameIndex: -1,
		hasValue: false
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
	$scope.elementUpdateClass = "hide";
	$scope.elementUpdateMessage = "";

	$scope.monthListCompact = Utils.buildCompactMonthList(Calendar.getCurrentMonth());
	$scope.selectedYearCompact = Calendar.getCurrentYear();
	$scope.selectedMonthCompact = Calendar.getCurrentMonth();
	$scope.systemCompactViewList = [];
	$scope.displayCompactMessageView = false;

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

	$scope.compactMessageViewClick = function() {
		$scope.displayCompactMessageView = true;
	};

	$scope.getClassForCompactMessageContainer = function() {
		var classString = 'message-container-compact row-fluid';

		if(!$scope.displayCompactMessageView){
			classString += ' hidden';
		}
		
		return classString;
	}
	

	$scope.getClassForCompactMonth = function(month) {
		var classString = '';

		if (month == $scope.selectedMonthCompact) {
			classString += "btn btn-success month selectedmonth";
		} else {
			classString += "btn btn-primary month";
		}

		//if($scope.selectedCompactSystem.sysIndex < 0){
		if($scope.selectedCompactSystem.hasValue == false) {
			classString += ' hidden';//ein
		}
		
		return classString;
	};

	$scope.getClassForCompactYearButton = function(month) {
		var classString = 'btn btn-primary yearbtn-compact';

		//if($scope.selectedCompactSystem.sysIndex < 0){
		if($scope.selectedCompactSystem.hasValue == false) {
			classString += ' hidden';
		}

		return classString;
	};

	$scope.getClassForCompactHomeButton = function(month) {
		var classString = 'btn btn-primary homebtn-compact';

		//if($scope.selectedCompactSystem.sysIndex < 0 && $scope.displayCompactMessageView == false){
		if($scope.selectedCompactSystem.hasValue == false && $scope.displayCompactMessageView == false){
			classString += ' hidden';
		}
		
		return classString;
	};

	$scope.getClassForCompactSearchButton = function(month) {
		var classString = 'btn btn-primary searchbtn-compact';

		//if($scope.selectedCompactSystem.sysIndex > -1){
		if($scope.selectedCompactSystem.hasValue == true) {
			classString += ' hidden';
		}
		
		return classString;
	};

	$scope.getClassForCompactMessageButton = function(month) {
		var classString = 'btn btn-primary messagebtn-compact';

		//if($scope.selectedCompactSystem.sysIndex > -1 || $scope.displayCompactMessageView == true){
		if($scope.selectedCompactSystem.hasValue == true || $scope.displayCompactMessageView == true){
			classString += ' hidden';
		}
		
		return classString;
	};
	
	$scope.getClassForCompactSystemViewLabel = function(month) {
		var classString = 'systemview-heading-compact';

		//if($scope.selectedCompactSystem.sysIndex > -1){
		if($scope.selectedCompactSystem.hasValue == true){
			classString += ' hidden';
		}
		
		return classString;
	};

	function fillExistingCompactData(syslinesIndex) {
		$scope.systemCompactViewList = [];

		//Find system text, might not be needed...
		if( $scope.selectedCompactSystem.hasValue == false) {
			var systemtext;
			var j;
			for(j = 0; j < $scope.systemnames.length; j++){
				if($scope.systemnames[j].name == $scope.systemlines[syslinesIndex].system) {
					systemtext = $scope.systemlines[syslinesIndex].system + ' - ' + $scope.systemnames[j].text;
					break;
				}
			}

			//$scope.selectedCompactSystem._id = "";
			$scope.selectedCompactSystem.system = systemtext; 
			//$scope.selectedCompactSystem.sysIndex = index;
		}

		var i;
		for(i = 0; i < $scope.systemlines[syslinesIndex].statuslines.length; i++){
			var line = $scope.systemlines[syslinesIndex].statuslines[i];
			var start = Utils.convertToDate(line.start);
			var end = Utils.convertToDate(line.end);

			if(start.getMonth() == $scope.selectedMonthCompact && start.getFullYear() == $scope.selectedYearCompact) {

				var elm = {
					status: line.status,
					start: start.getDate() + ' ' + $scope.monthLabels[start.getMonth()],
					end: end.getDate() + ' ' + $scope.monthLabels[end.getMonth()],
					comment: line.comment
				}

				$scope.systemCompactViewList.push(elm);
			}
		}

		if($scope.systemCompactViewList <= 0){
			fillEmptyCompactListElement();
		}else{
			$scope.selectedCompactSystem.hasValue = true;
		}

		$scope.selectedCompactSystem.hasValue = true;
	}

	function fillEmptyCompactListElement() {
		$scope.systemCompactViewList = [];

		var elm = {
			status: '',
			start: '',
			end: '',
			comment: '',
			error: 'No data',
			type: 'error'
		}

		$scope.systemCompactViewList.push(elm);
	}

	//kjem inn nameindex
	$scope.fillSystemCompactViewList = function(index) {
		
		$scope.selectedCompactSystem.sysNameIndex = index;
		var systemMatch = Utils.findSystem($scope.systemlines, $scope.systemnames[index].name);
		
		if(systemMatch.result) {
			$scope.selectedCompactSystem.sysIndex = index;
			fillExistingCompactData(systemMatch.index);
		}else{
			fillEmptyCompactListElement();
		}

	}

	$scope.getClassForSystemCompactView = function(element) {
		var classString = 'status';

		if(element.type == 'error'){
			classString = ' error';
		}

		if($scope.selectedCompactSystem.hasValue == false){
			classString += ' hidden';
		}

		return classString;
	}

	$scope.compactListReset = function() {
		$scope.selectedCompactSystem._id = "";
		$scope.selectedCompactSystem.system = ""; 
		$scope.selectedCompactSystem.sysIndex = -1;
		$scope.selectedCompactSystem.hasValue = false;

		$scope.displayCompactMessageView = false;

		$scope.selectedYearCompact = Calendar.getCurrentYear();
		$scope.selectedMonthCompact = Calendar.getCurrentMonth();
		$scope.monthListCompact = Utils.buildCompactMonthList($scope.selectedMonthCompact);

		$scope.systemCompactViewList = [];
	}

	$scope.getClassForCompactList = function() {
		var classString = '';
		//if($scope.selectedCompactSystem.sysIndex >= 0 || $scope.displayCompactMessageView == true){
		if($scope.selectedCompactSystem.hasValue == true || $scope.displayCompactMessageView == true) {
			classString = 'hidden';
		}
		
		return classString;
	}

	$scope.gotoMonthCompact = function(event, month) {
		$scope.selectedMonthCompact = month;
		$scope.monthListCompact = Utils.buildCompactMonthList($scope.selectedMonthCompact);
		//if($scope.selectedCompactSystem.sysIndex > -1){
		if($scope.selectedCompactSystem.hasValue == true) {
			fillExistingCompactData($scope.selectedCompactSystem.sysIndex);
		}
		
		//$scope.fillSystemCompactViewList($scope.selectedCompactSystem.sysIndex);
	}	
	
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

		//$scope.monthListCompact = Utils.buildCompactMonthList($scope.selectedMonth);
		//$scope.fillSystemCompactViewList($scope.selectedCompactSystem.sysIndex);

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

	function issueElementUpdateMessage(system) {
		$scope.elementUpdateMessage = "Status was updated for system " + system;
		$scope.elementUpdateClass = "display";
	};
	
	$scope.addAlert = function() {
		if($("#alertForm").valid()){
			$('#addalertdialog').modal('hide');
			var alert = new db.Alert($scope.addAlertLine);
			alert.expdate = Utils.viewDateToDBDate(alert.expdate);
			var timestamp = new Date().getTime();
			alert.timestamp = timestamp;
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
				issueElementUpdateMessage(systemElement.system); 
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

			var i;
			for (i = 1; i < $scope.systemlines.length; i++) {
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

					issueElementUpdateMessage(systemElement.system); 
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
					issueElementUpdateMessage(systemElement.system); 
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
		$scope.elementUpdateMessage = ""; 
		$scope.elementUpdateClass = "hide";
	};
	
	$scope.getClassForDayColumn = function(day) {
		var classText = '';
		var currentDate = new Date();
		
		if(day == currentDate.getDate() && $scope.selectedMonth == currentDate.getMonth() && $scope.selectedYear == currentDate.getFullYear()){
			classText = 'currentday'
		}

		return classText;
	};
	
});