var myModule = angular.module('systemAvailability', ['mongolab']).
		directive('jqDatepicker', function () {
			return {
						link: function postLink(scope, element, attrs) {
							element.datepicker({
								dateFormat: "dd/mm/yy",
								onClose: function (dateText, inst) {
									if(element.context.id == "sidebarStartDate"){
										scope.selectedStatusLine.start = dateText;
									}
									else if(element.context.id == "sidebarEndDate"){
										scope.selectedStatusLine.end = dateText;
									}
									else if(element.context.id == "alertDialogExpDate"){
										scope.addAlertLine.expdate = dateText;
									}
									scope.$apply();
								}
							});
						}
					};
		});

myModule.controller("TimelineCtrl", function($scope, Systems) {


	$scope.systemlines = getSystemData();
	$scope.systemnames = getSystemNames();
	$scope.systemstatuses = getSystemStatuses();
	$scope.alertlines = getAlertData();
	$scope.alerttypes = getAlertTypes();


	var startDate = 20120501,
		endDate = 20120531;

	$scope.selectedStatusLine = {
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


	$scope.calendar = {

		daysLabel: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		daysLabelShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
		monthLabels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
		currentDate: new Date()
	};

	function getWeek(date) {
		var onejan = new Date(date.getFullYear(), 0, 1);
		return Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7);
	}

	$scope.currentMonthDayList = function() {
		var days = $scope.calendar.daysInMonth[$scope.calendar.currentDate.getMonth()];

		var dayArray = [];

		for (i = 0; i < days; i++) {
			dayArray.push(i + 1);
		}

		return dayArray;
	};

	$scope.currentMonthWeekList = (function () {

		var dayArray = $scope.currentMonthDayList(),
		weekArray = [],
		m = $scope.calendar.currentDate,
		weekAndDays = [],
		colSpan = 0;

		$.each(dayArray, function(i, v_day) {
			weekArray.push(getWeek(new Date(m.getFullYear(), m.getMonth(), i)));
		});

		for (var i = 0; i < weekArray.length; i++) {
			colSpan++;
			if (weekArray[i] !== weekArray[i + 1]) {
				weekAndDays.push({
					"week": weekArray[i],
					"colSpan": colSpan
				});
				colSpan = 0;
			}
		}

		return weekAndDays;
	})();


	$scope.currentMonthName = function() {
		return $scope.calendar.monthLabels[$scope.calendar.currentDate.getMonth()];
	};


	$scope.daysInCurrentMonth = function() {
		return $scope.calendar.daysInMonth[$scope.calendar.currentDate.getMonth()];
	};

	$scope.dayNamesInCurrentMonth = function() {

		var dayCount = $scope.calendar.daysInMonth[$scope.calendar.currentDate.getMonth()];

		var dayArray = [];

		var date = $scope.calendar.currentDate;
		var firstDayInMonth = new Date(date.getFullYear(), date.getMonth(), 1);

		var day_it = firstDayInMonth.getDay();
		for (i = 0; i < dayCount; i++) {

			dayArray.push($scope.calendar.daysLabel[day_it]);
			day_it++;

			if (day_it >
	6) {
				day_it = 0;
			}
		}

		return dayArray;
	};

	function numberOfDaysBwtweenDates(fromDate, toDate) {
		var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
		return Math.abs((fromDate.getTime() - toDate.getTime())/(oneDay)) ;
	}

	function daysInMonth(month,year) {
		var dd = new Date(year, month, 0);
		return dd.getDate();
	}
	
	function custom_sort(a, b) {
		//return new Date(a.start).getTime() - new Date(b.start).getTime();
		return a.start - b.start;
	}


	function convertToDate(dateString) {

		var datestring = dateString,
			y = datestring.substr(0, 4),
			m = datestring.substr(4, 2),
			d = datestring.substr(6, 2);

		m = m - 1;
		date = new Date(y, m, d);

		return date;

	}


	function addEmptyElementsForSystem(system, calendartable, index) {

		calendartable.push({
			"system": system,
			"statuslines": []
		});
		
		for (k = 0; k < (endDate - startDate) + 1; k++) {
			calendartable[index].statuslines.push({
				"start": startDate + k,
				"end": startDate + k,
				"status": "available"
			});
		}

		return calendartable;
	}


	function insertCalendarElement(calendartable, v_status, i, j) {

		if (v_status.start == v_status.end) {
			calendartable[i].statuslines[j].status = v_status.status;
		} else {

			$.each(calendartable[i].statuslines, function(j, c_status) {

				if (c_status.start == v_status.start) {

					for (k = 0; k < (v_status.end - v_status.start) + 1; k++) {
						calendartable[i].statuslines.splice(j, 1);
					}

					return false; //jquery loopbreak
				}

			});

			calendartable[i].statuslines.push({
				"start": v_status.start,
				"end": v_status.end,
				"status": v_status.status
			});
			calendartable[i].statuslines.sort(custom_sort);
		}

		return calendartable;
	}


	function getSystemData() {

		var calendartable = [];

		var syslines = Systems.systems.query(function() {

			$.each(syslines, function(i, v_system) {
				calendartable = addEmptyElementsForSystem(v_system.system, calendartable, i);
				
				$.each(v_system.statuslines, function(j, v_status) {
					calendartable = insertCalendarElement(calendartable, v_status, i, j);
				});
			});
		});

		return calendartable;
	}
	
	
	function getSystemStatuses(){
		var systemStatuses = Systems.systemstatuses.query(function(){});
		return systemStatuses;
	}
	
	
	function getSystemNames(){
	
		var systemNames = Systems.systemnames.query(function() {});
		return systemNames;
	}


	function getAlertData() {
		var alertLines = Systems.alerts.query(function() {});
		return alertLines;
	}
	
	
	function getAlertTypes(){
		var alertTypes = Systems.alerttypes.query(function(){});
		return alertTypes;
	}
	
	
	$scope.addAlert = function() {
		
		Systems.alerts.save($scope.addAlertLine, function(item){
			$scope.alertlines.push(item);
		});
	
	};
	
	
	$scope.removeAlert = function(id) {
		Systems.alerts.delete({id: id.$oid}, function(){});
	};


	$scope.removeStatusElement = function(id) {
	
		//Systems.systems.delete({id: id.$oid}, function(){});
		
		$.each($scope.systemlines, function(i, v_system) {

			if (v_system.system == $scope.selectedStatusLine.system) {

				$.each(v_system.statuslines, function(j, v_status) {

					if (v_status.start == convertDateToDatabaseFormat($scope.selectedStatusLine.start) && v_status.end == convertDateToDatabaseFormat($scope.selectedStatusLine.end) && v_status.status == $scope.selectedStatusLine.status) {

						$scope.systemlines[i].statuslines.splice(j, 1);

						for (k = 0; k < (v_status.end - v_status.start) + 1; k++) {
							$scope.systemlines[i].statuslines.push({
								"start": (parseInt(v_status.start) + k),
								"end": (parseInt(v_status.start) + k),
								"status": "available"
							});
						}

						$scope.systemlines[i].statuslines.sort(custom_sort);
					}
				});
			}
		});
		
		
		
	};


$scope.addStatusElement = function() {

		$.each($scope.systemlines, function(i, v_system) {

			if (v_system.system == $scope.selectedStatusLine.system) {

				$.each(v_system.statuslines, function(j, v_status) {
					
					if (checkNewElementStartDay(v_status)) {
						
						if (isNewElementSingleDay()) {
						
							$scope.systemlines[i].statuslines[j].status = $scope.selectedStatusLine.status;
							
						}
						else {
						
							if(isNewElementOverlapping(v_status, i, j)){
								alert("Overlap!");
								return false;
							}
							
							clearSpaceForNewElement(v_status, i, j);
							addNewElement(i);

							$scope.systemlines[i].statuslines.sort(custom_sort);
							return false; //jquery break
						}
					}
				});
			}
		});
		
		Systems.systems.save($scope.selectedStatusLine, function(item){
			//$scope.alertlines.push(item);
		});
	};
	
	
	function isNewElementSingleDay(){
		var result = false;
		
		if (convertDateToDatabaseFormat($scope.selectedStatusLine.start) == convertDateToDatabaseFormat($scope.selectedStatusLine.end)){
			result = true;
		}
		
		return result;
	}
	
	
	function addNewElement(index){
		$scope.systemlines[index].statuslines.push({
			"start": convertDateToDatabaseFormat($scope.selectedStatusLine.start),
			"end": convertDateToDatabaseFormat($scope.selectedStatusLine.end),
			"status": $scope.selectedStatusLine.status
		});
	}
	
	
	function clearSpaceForNewElement(element, i, j){
	
		for (k = 0; k < (convertDateToDatabaseFormat($scope.selectedStatusLine.end) - element.start) + 1; k++) {
			$scope.systemlines[i].statuslines.splice(j, 1);
		}
		
	}
	

	function checkNewElementStartDay(element){
	
		var result = false;
		
		if (element.start == convertDateToDatabaseFormat($scope.selectedStatusLine.start) && element.end == convertDateToDatabaseFormat($scope.selectedStatusLine.start)){
			result = true;
		}
		
		return result;
	}
	
	
	function isNewElementOverlapping(element, i, j)
	{
		for (k = 0; k < (convertDateToDatabaseFormat($scope.selectedStatusLine.end) - element.start) + 1; k++) {
			if ($scope.systemlines[i].statuslines[j + k].status != 'available') {
				return true; //jquery break
			}
		}
	}


	$scope.showDetails = function(system, statusline) {

		if(statusline.status != "available")
		{
			$scope.selectedStatusLine.system = system;
			$scope.selectedStatusLine.status = statusline.status;
			$scope.selectedStatusLine.start = convertDateToViewableFormat(statusline.start);
			$scope.selectedStatusLine.end = convertDateToViewableFormat(statusline.end);
		}
		else
		{
			$scope.selectedStatusLine.system = "";
			$scope.selectedStatusLine.status = "";
			$scope.selectedStatusLine.start = "";
			$scope.selectedStatusLine.end = "";
		}
		
	};


	function convertDateToViewableFormat(dateString) {
		var datestring = dateString,
			y = datestring.substr(0, 4),
			m = datestring.substr(4, 2),
			d = datestring.substr(6, 2);

		var date = d + '.' + m + '.' + y;

		return date;
	}


	function convertDateToDatabaseFormat(dateString) {
		var datestring = dateString,
			d = datestring.substr(0, 2),
			m = datestring.substr(3, 2),
			y = datestring.substr(6, 4),
			date = y + m + d;

		return date;
	}


});