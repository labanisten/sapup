"use strict";

var myModule = angular.module('systemAvailability', ['mongodbModule', 'calendarModule', 'utilsModule', 'directiveModule']);


myModule.controller("TimelineCtrl", function($scope, $http, db, Calendar, Utils) {

	function getSystemData() {
		var promise = db.System.get();
		promise.then(function(data) {
			$scope.systemlines = data;
			fillSystemlinesActive();
		});
		return [];
	}

	function getUserData() {
		var promise = db.Userdata.get();
		promise.then(function(data) {
			$scope.userdata = data;
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
			$scope.systemnames.sort(function(a,b){return a.order - b.order;}); //Sort by prder property
		});
		return [];
	}

	function getSystemgroups(){
		var promise = db.Systemgroup.get();
		promise.then(function(data) {
			$scope.systemgroups = data;
			$scope.systemgroups.sort(function(a,b){return a.order - b.order;}); //Sort by prder property
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

	$scope.systemlines = getSystemData();
	$scope.systemnames = getSystemNames();
	$scope.systemstatuses = getSystemStatuses();
	$scope.systemgroups = getSystemgroups();
	$scope.alertlines = getAlertData();
	$scope.alerttypes = getAlertTypes();
	$scope.userdata = getUserData();

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

	$scope.selectedCompactSystemgroup = {
		_id: "",
		name: "",
		systemGroupIndex: -1,
		hasValue: false
	};

	$scope.selectedCompactSystem = {
		_id: "",
		name: "",
		text:"",
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

	$scope.page = {
		main: "pg1",
		system: "pg2",
		status: "pg3",
		message: "pg4"
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
	$scope.systemgroupCompactViewList = [];
	$scope.displayCompactMessageView = false;
	$scope.systemlinesActive = [];
	$scope.filterTags = [];
	$scope.activeGroupTags = [];
	$scope.activeTags = [];
	$scope.currentCompactpage = $scope.page.main;
	//$scope.systemTableStartColumnSize = 0;

	$scope.messageAreaClass = function() {
		if ($scope.alertlines.length > 0) {
			return "FV";
		} else {
			return "invisible hide";
		}
	};

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
					case "Information":
						statusClass = 'information'; 
						break; 
					case "Ready for test":
						statusClass = 'readyfortest'; 
						break; 
				}
				classString = "element-inner element-click " + statusClass; 
				if (sysIndex === $scope.selectedElement.sysIndex && elmIndex === $scope.selectedElement.elmIndex) {
					classString += " selected";
				}
			}
		}
		
		return classString;
	};
	
	function isAlreadySelected(sysIndex, elmIndex) {
		var result = false;
		if($scope.selectedElement.sysIndex === sysIndex && $scope.selectedElement.elmIndex === elmIndex) {result = true;}
		return result;
	}
	
	//TODO: event parameter not used?
	$scope.selectElement = function(event, sysIndex, elmIndex) {
		if(isAlreadySelected(sysIndex, elmIndex)) {
			$scope.unSelectElement();
		}else{
			$scope.setSelectedElement(sysIndex, elmIndex);
		}
	};

	$scope.getClassForMonth = function(month) {
		if (month === $scope.selectedMonth) {
			return "span1 month selectedmonth";
		} else {
			return "span1 month";
		}
	};

	//TODO: is the element paramater in use?
	$scope.getClassForTableRowSystemGroup = function() {
		var classString = "systemgrouprow";
		if($scope.activeTags.length > 0 || $scope.activeGroupTags.length) {
			classString = 'hidden';
		}
		return classString;
	};

	function partOfActiveGrouptags(systemRow) {
		var result = true;
		var i;
		for(i = 0; i < $scope.activeGroupTags.length; i++){
			if($scope.activeGroupTags[i] === systemRow.systemgroup) {
				result = false;
				break;
			}
		}
		return result;
	}

	//TODO: refactor for readability
	function partOfActiveTagsAndGroup(systemRow) {
		var result = false;

		if(systemRow.tags !== undefined) {
			var tags = systemRow.tags.split(';');

			var j;
			for(j = 0; j < $scope.activeTags.length; j++){
				var index = tags.indexOf($scope.activeTags[j]); 

				//tag for row not selected, hide
				if(index < 0) {
					result = true;
					break;
				}else{ // tag is selected, test for selected group also
					var groupMatch = false; 
					var k;
					for(k = 0; k < $scope.activeGroupTags.length; k++){
						if($scope.activeGroupTags[k] === systemRow.systemgroup) {
							//tag for systemgroup not selected, hide 
							groupMatch = true;
							break;
						}
					}

					// row is not part of selected groups, hide
					if(groupMatch === false) {
						result = true;
					}
				}
			}
		}else{
			result = true;
		}

		return result;
	}

	function partOfActiveTags(tags) {
		var result = false;
		var i;
		for(i = 0; i < $scope.activeTags.length; i++){
			var index = tags.indexOf($scope.activeTags[i]); 

			//tag for row not selected, hide
			if(index < 0) {
				result = true;
				break;
			}
		}
		return result;
	}

	function searchForActiveTagsForStatus(systemnamesIndex) {
		var result = false;
		var systemRow = $scope.systemnames[systemnamesIndex];

		if($scope.activeGroupTags.length > 0) {

			result = partOfActiveGrouptags(systemRow);

			if($scope.activeTags.length > 0) {
				result = partOfActiveTagsAndGroup(systemRow);
			}

		}else{

			if(systemRow.tags !== undefined) {
				var tags = systemRow.tags.split(';');
				result = partOfActiveTags(tags);
			}else{
				result = true;
			}
		}

		return result;
	}

	$scope.getClassForSystemTableRow = function(systemnamesIndex) {
		var classString = 'systemrow ';

		if($scope.activeTags.length > 0 || $scope.activeGroupTags.length > 0) {
			if(searchForActiveTagsForStatus(systemnamesIndex)) {
				classString = 'hidden';
			}
		}
		return classString;
	};

    $scope.getClassForGroupTagButton = function(tag) {
		var classString = "btn btn-small";
		var index = $scope.activeGroupTags.indexOf(tag); 
		if(index > -1) {
			classString += " selected";
		}
		return classString;
	};	

	//TODO: check if in use
	$scope.getClassForGroupTagBadge = function() {
		var classString = "calendar-filtertag";
		return classString;
	};

	//TODO: not in use -> no UnitTest 
	$scope.getClassForGroupTagBadgeInner = function(tag) {
		var classString = "";
		var index = $scope.activeGroupTags.indexOf(tag); 
		if(index > -1) {
			classString += " selected";
		}
		return classString;
	};	

	//TODO: not in use -> no UnitTest 
	$scope.getClassForTagBadge = function() {
		var classString = "calendar-filtertag";
		return classString;
	};

	//TODO: not in use -> no UnitTest 
	$scope.getClassForTagBadgeInner = function(tag) {
		var classString = "";
		var index = $scope.activeTags.indexOf(tag); 
		if(index > -1) {
			classString += " selected";
		}

		return classString;
	};

	//TODO: not in use -> no UnitTest 
	$scope.getClassForCompactMessageContainer = function() {
		var classString = 'message-view-compact row-fluid';
		if($scope.currentCompactpage !== $scope.page.message){classString += ' hidden';}
		return classString;
	};
	
	$scope.getClassForCompactMonthBar = function() {
		var classString = 'months';
		if($scope.currentCompactpage !== $scope.page.status){classString += ' hidden';}
		return classString;
	};

	$scope.getClassForCompactMonthElement = function(month) {
		var classString = '';

		if (month === $scope.selectedMonthCompact) {
			classString += "btn btn-success month selectedmonth";
		} else {
			classString += "btn btn-primary month"; 
		}

		return classString;
	};

	//TODO: month parameter not in use?
	$scope.getClassForCompactYearButton = function() {
		var classString = 'btn btn-primary yearbtn-compact';
		if($scope.currentCompactpage !== $scope.page.status){classString += ' hidden';}
		return classString;
	};

	//TODO: month parameter not in use?
	$scope.getClassForCompactHomeButton = function() {
		var classString;
		if($scope.currentCompactpage === $scope.page.status || $scope.currentCompactpage === $scope.page.message) {
			classString = 'btn btn-primary homebtn-compact';
		}else{
			classString = 'btn btn-primary homebtn-compact hidden';
		}
		return classString;
	};

	//TODO: month parameter not in use?
	$scope.getClassForCompactSystemBackButton = function() {
		var classString = 'btn btn-primary system-backbtn-compact';
		if($scope.currentCompactpage !== $scope.page.system){classString += ' hidden';}
		return classString;
	};

	//TODO: month parameter not in use?
	$scope.getClassForCompactStatusBackButton = function() {
		var classString = 'btn btn-primary status-backbtn-compact';
		if($scope.currentCompactpage !== $scope.page.status){classString += ' hidden';}
		return classString;
	};

	//TODO: month parameter not in use? : no UnitTest
	$scope.getClassForCompactSearchButton = function() {
		/*var classString = 'btn btn-primary searchbtn-compact';
		if($scope.selectedCompactSystem.hasValue == true) {classString += ' hidden';}
		return classString;*/
	};

	//TODO: month parameter not in use?
	$scope.getClassForCompactMessageButton = function() {
		var classString = 'btn btn-primary messagebtn-compact';
		if($scope.currentCompactpage !== $scope.page.main){classString += ' hidden';}
		return classString;
	};

	//TODO: month parameter not in use?
	$scope.getClassForCompactStatusViewLabel = function() {
		var classString = 'systemview-heading-compact';
		if($scope.currentCompactpage !== $scope.page.status){classString += ' hidden';}
		return classString;
	};

	$scope.getClassForSystemgroupCompactView = function() {
		var classString = 'systemgroup-view-compact';
		if($scope.currentCompactpage !== $scope.page.main){classString += ' hidden';}
		return classString;
	};

	$scope.getClassForSystemCompactView = function() {
		var classString = 'status-view-compact';
		if($scope.currentCompactpage !== $scope.page.system){classString += ' hidden';}
		return classString;
	};

	$scope.getClassForActiveSystemIndicator = function(element) {
		var classString = 'system-active-indicator hidden';

		var i;
		for(i = 0; i < $scope.systemlinesActive.length; i++) {
			if($scope.systemlinesActive[i].system === element.name) {
				classString = 'system-active-indicator pull-right show';
			}
		}

		return classString;
	};

	$scope.getClassForActiveStatusIndicator = function(element) {
		var classString = '';//'pull-right';

		if(element.isActive !== "true") {
			classString = 'hidden';
		}

		return classString;
	};

	//TODO: day starts at 0 and needs to be ++'d because of for(i = 0.. in directives
	$scope.getClassForDayNameHeaderCell = function(day) {
		var classString = '';

		var testDate = new Date($scope.selectedYear, $scope.selectedMonth, day + 1);
		if(Utils.dateIsWeekend(testDate)) {
			classString += 'weekend';
		}
		//delete testDate;

		return classString;
	};

	//TODO: if test is reused from getClassForDayNameHeaderCell
	$scope.getClassForDayHeaderCell = function(day) {
		var classString = '';
		var currentDay = Calendar.currentDate.getDate() - 1;
		if(day === currentDay && 
			$scope.selectedMonth === Calendar.currentDate.getMonth() && 
				$scope.selectedYear === Calendar.currentDate.getFullYear()) {
			classString += 'currentday ';
		}

		var testDate = new Date($scope.selectedYear, $scope.selectedMonth, day + 1);
		if(Utils.dateIsWeekend(testDate)) {
			classString += 'weekend';
		}
		//delete testDate;

		return classString;
	};

	$scope.getClassForStatusCompactViewElement = function(element) {
		var classString = 'status';
		if(element.type === 'error'){classString = 'error';}

		//color if covers currentday
		/*
		if(element.isActive === "true") {
			classString += ' active';
		}
		*/

		return classString;
	};

	$scope.getClassForStatusCompactView = function() {
		var classString = 'status-view-compact';
		if($scope.currentCompactpage !== $scope.page.status){classString += ' hidden';}
		return classString;
	};


	$scope.compactHomeButtonClick = function() {
		$scope.currentCompactpage = $scope.page.main;
		$scope.selectedCompactSystem.name = "";
		$scope.selectedCompactSystem.text = "";
		$scope.selectedCompactSystemgroup.name = "";
		$scope.selectedCompactSystem.sysIndex = -1;
		$scope.selectedCompactSystem.hasValue = false;
		$scope.selectedCompactSystemgroup.hasValue = false;
		$scope.displayCompactMessageView = false;
		$scope.selectedYearCompact = Calendar.getCurrentYear();
		$scope.selectedMonthCompact = Calendar.getCurrentMonth();
		$scope.monthListCompact = Utils.buildCompactMonthList($scope.selectedMonthCompact);
		$scope.systemCompactViewList = [];
	};

	//TODO: redefenition of compactHomeButtonClick() ?
	$scope.compactSystemBackButtonClick = function() {
		$scope.currentCompactpage = $scope.page.main;
		$scope.compactHomeButtonClick();
	};

	$scope.compactStatusBackButtonClick = function() {
		$scope.currentCompactpage = $scope.page.system;
		$scope.selectedCompactSystem.name = "";
		$scope.selectedCompactSystem.text = "";
		$scope.selectedCompactSystem.sysIndex = -1;
		$scope.selectedCompactSystem.hasValue = false;

		$scope.selectedYearCompact = Calendar.getCurrentYear();
		$scope.selectedMonthCompact = Calendar.getCurrentMonth();
		$scope.monthListCompact = Utils.buildCompactMonthList($scope.selectedMonthCompact);
		$scope.systemCompactViewList = [];
	};

	$scope.compactMessageViewClick = function() {
		$scope.displayCompactMessageView = true;
		$scope.currentCompactpage = $scope.page.message;
	};

	$scope.compactSystemGroupElementClick = function(index) {
		fillSystemViewList(index);
		$scope.currentCompactpage = $scope.page.system;
	};

	$scope.compactSystemElementClick = function(index) {
		fillStatusCompactViewList(index);
		$scope.currentCompactpage = $scope.page.status;
	};

	//TODO: test for empty systemdata 
	function fillSystemlinesActive() {
		//Calendar.currentDate;
		if($scope.systemlines !== undefined) {
			var i,j;
			for (i = 0; i < $scope.systemlines.length; i++){
				for(j = 0; j < $scope.systemlines[i].statuslines.length; j++) {
					var start = Utils.convertToDate($scope.systemlines[i].statuslines[j].start);
					var end = Utils.convertToDate($scope.systemlines[i].statuslines[j].end);
					if(start <= Calendar.currentDate && end >= Calendar.currentDate) {

						var line = {
							system: "",
							statuslines: []
						};
						
						line.system = $scope.systemlines[i].system;
						line.statuslines.push($scope.systemlines[i].statuslines[j]);
						$scope.systemlinesActive.push(line);
					}
				} 
			}
		}
	}

	//TODO: only fill selectedCompactSystemgroup.name ? 
	function fillSystemViewList(groupIndex) {
		var elm;
		$scope.systemgroupCompactViewList = [];
		$scope.selectedCompactSystemgroup.name = $scope.systemgroups[groupIndex].name;

		var i;
		for (i = 0; i < $scope.systemnames.length; i++){
			if ($scope.systemnames[i].systemgroup === $scope.systemgroups[groupIndex].name) {

				elm = {
					systemnamesIndex: i,
					name: $scope.systemnames[i].name,
					text: $scope.systemnames[i].text,
					systemgroup: $scope.systemnames[i].systemgroup
				};

				$scope.systemgroupCompactViewList.push(elm);
			}
		}

		if($scope.systemgroupCompactViewList <= 0){

			elm = {
				name: '',
				text: '',
				systemgroup: ''
			};

			$scope.systemgroupCompactViewList.push(elm);
		}

		$scope.selectedCompactSystemgroup.hasValue = true;
	}

	function fillStatusCompactViewList(index) {
		//TODO; handle for no data
		$scope.selectedCompactSystem.sysNameIndex = index;
		var systemMatch = Utils.findSystem($scope.systemlines, $scope.systemnames[index].name);
		
		if(systemMatch.result) {
			$scope.selectedCompactSystem.name = $scope.systemnames[index].name;
			$scope.selectedCompactSystem.text = $scope.systemnames[index].text;
			$scope.selectedCompactSystem.sysIndex = systemMatch.index;
			fillExistingCompactData(systemMatch.index);
		}else{
			fillEmptyCompactListElement();
			$scope.selectedCompactSystem.hasValue = true;
		}
	}

	function fillExistingCompactData(syslinesIndex) {
		$scope.systemCompactViewList = []; 

		var i;
		for(i = 0; i < $scope.systemlines[syslinesIndex].statuslines.length; i++){
			var line = $scope.systemlines[syslinesIndex].statuslines[i];
			var start = Utils.convertToDate(line.start);
			var end = Utils.convertToDate(line.end);

			//TODO: test for elements that spans several months
			if((start.getMonth() === $scope.selectedMonthCompact && start.getFullYear() === $scope.selectedYearCompact) || 
				(start.getMonth() === $scope.selectedMonthCompact && end.getFullYear() === $scope.selectedYearCompact)){

				var elm = {
					status: line.status,
					startText: start.getDate() + ' ' + $scope.monthLabels[start.getMonth()],
					endText: end.getDate() + ' ' + $scope.monthLabels[end.getMonth()],
					isActive: 'false',
					//start: line.start,
					//end: line.end,
					comment: line.comment
				};

				//element status today
				var j;
				for(j = 0; j < $scope.systemlinesActive.length; j++) {
					if($scope.systemlinesActive[j].system === $scope.selectedCompactSystem.name) {
						if($scope.systemlinesActive[j].statuslines[0].start === line.start) {
							elm.isActive = 'true';
						}
					}
				}

				//TODO: Sorting
				$scope.systemCompactViewList.push(elm);
			}
		}

		if($scope.systemCompactViewList <= 0){
			fillEmptyCompactListElement();
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
		};

		$scope.systemCompactViewList.push(elm);
	}

	$scope.groupBadgeClick = function(tag) {
		var index = $scope.activeGroupTags.indexOf(tag); 
		if(index < 0) {
			$scope.activeGroupTags.push(tag);
		}else{
			$scope.activeGroupTags.splice(index, 1);
		}
	};

	$scope.tagBadgeClick = function(tag) {
		var index = $scope.activeTags.indexOf(tag); 
		if(index < 0) {
			$scope.activeTags.push(tag);
		}else{
			$scope.activeTags.splice(index, 1);
		}
	};

	$scope.gotoMonthCompact = function(event, month) {
		$scope.selectedMonthCompact = month;
		$scope.monthListCompact = Utils.buildCompactMonthList($scope.selectedMonthCompact);

		if($scope.selectedCompactSystem.hasValue === true) {
			fillStatusCompactViewList($scope.selectedCompactSystem.sysNameIndex);
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
		//elem[0].className += " selectedmonth";
		elem.addClass('selectedmonth');
	};
	
	$scope.gotoPreviousYear = function() {
		$scope.selectedYear = $scope.selectedYear - 1;
		getSystemData();
	};
	
	$scope.gotoNextYear = function() {
		$scope.selectedYear = $scope.selectedYear + 1;
		getSystemData();
	};

	$scope.gotoPreviousMonth = function() {
		var prevMonth = Utils.decMonth($scope.selectedMonth);

		if(prevMonth === 11) {
			$scope.selectedYear = $scope.selectedYear - 1;
		}

		$scope.selectedMonth = prevMonth;
	};
	
	$scope.gotoNextMonth = function() {
		var nextMonth = Utils.incMonth($scope.selectedMonth);

		if(nextMonth === 0) {
			$scope.selectedYear = $scope.selectedYear + 1;
		}

		$scope.selectedMonth = nextMonth;
	};

	function issueElementUpdateMessage(system) {
		$scope.elementUpdateMessage = "Status was updated for system " + system;
		$scope.elementUpdateClass = "display";
	}
	
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
	
	//TODO: broken?
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
			
			if (statusStart.getTime() === item.start.getTime() && statusEnd.getTime() === item.end.getTime() && v_status.status === item.status) {
				
				system.statuslines.splice(j, 1);
				return false;
			}
		});
	}

	//TODO: no need to splice systemarray because of getSystemData()
	$scope.removeStatusElement = function() {
		$.each($scope.systemlines, function(i, v_system) {
			if (v_system.system === $scope.selectedElement.system) {

				var systemElement = {
						"system": v_system.system,
						"statuslines": $scope.systemlines[i].statuslines
					};
					
				spliceCalendarElement(systemElement, $scope.selectedElement);
					
				var system = new db.System(systemElement);
				system.update(v_system._id).then(function() {
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
		for (i = 0; i < $scope.systemlines.length; i++) {
			if ( $scope.systemlines[i].system === $scope.updateFormData.system) {
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
			system.update(existingSystem._id).then(function() {
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
			for (i = 0; i < $scope.systemlines.length; i++) {
				if ( $scope.systemlines[i].system === $scope.addFormData.system) {
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

				system.update(existingSystem._id).then(function() {
					issueElementUpdateMessage(systemElement.system); 
					$scope.unSelectElement();
					getSystemData();
				});

				
				
			} else {
				//Post new system
				var systemText;
				$.each($scope.systemnames, function(i, v_system) {
					if(v_system.name === $scope.addFormData.system) {
						systemText = v_system.text;
						return false;
					}
				});
				
				systemElement = { 
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
				
				system.create().then(function() {
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
	
	$scope.callModal = function() {
		$("#editelementdialog").modal('show');
	};
	
	$scope.clearModalLog = function() {
		$scope.elementUpdateMessage = ""; 
		$scope.elementUpdateClass = "hide";
	};
	
});