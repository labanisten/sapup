var myModule = angular.module('systemAvailability', ['mongolabModule', 'calendarModule']);
		
myModule.directive('jqDatepicker', function () {
	return {
				link: function postLink(scope, element, attrs) {
					element.datepicker({
						dateFormat: "dd.mm.yy",
						onClose: function (dateText, inst) {
							if(element.context.id == "sidebarStartDate"){
										scope.systemFormData.start = dateText;
							}
							else if(element.context.id == "sidebarEndDate"){
										scope.systemFormData.end = dateText;
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

myModule.controller("TimelineCtrl", function($scope, Systems, Calendar) {

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
		comment: ""
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

	$scope.currentMonthDayList = Calendar.currentMonthDayList();
	$scope.currentMonthWeekList = Calendar.currentMonthWeekList();
	$scope.currentMonthName = Calendar.currentMonthName();
	$scope.selectedMonthName = Calendar.currentMonthName();
	$scope.selectedMonth = Calendar.currentMonth;
	$scope.selectedYear = Calendar.currentYear;

	$scope.daysInCurrentMonth =  Calendar.noOfDaysInCurrentMonth;
	$scope.dayNamesInCurrentMonth = Calendar.dayNamesInCurrentMonth();


	function numberOfDaysBetweenDates(fromDate, toDate) {
		var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
		return Math.floor((fromDate.getTime() - toDate.getTime())/(oneDay)) ;
	}
	
	function custom_sort(a, b) {
		//return new Date(a.start).getTime() - new Date(b.start).getTime();
		return a.start - b.start;
	}
	
	function ascSystemSort(a, b){
		var aSystem = a.system;
		var bSystem = b.system;
		return (aSystem < bSystem) ? -1 : (aSystem > bSystem) ? 1 : 0;
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

	function rangeWithinMonthYear(fromDate, toDate, month, year) {
		return ( dateFromString(fromDate).getMonth() == month && dateFromString(fromDate).getYear() == year ) || ( dateFromString(toDate).getMonth() == month && dateFromString(toDate).getYear() == year );
	}

	function addEmptyElementsForSystem(systemItem, calendartable, index) {
		calendartable.push({
			"_id": systemItem._id,
			"system": systemItem.system,
			"statuslines": []
		});
		
		for (k = 1; k < Calendar.noOfDaysInCurrentMonth + 1; k++) {
			var calDate = new Date();
			calDate.setDate(k);
			calendartable[index].statuslines.push({
				"start": calDate,
				"end": calDate,
				"status": "available",
				"colspan": 1
			});
		}
		return calendartable;
	}


	function insertCalendarElement(calendartable, status, i, j) {
		// If this is a one day status line 
		if (status.start == status.end && rangeWithinMonthYear(status.start, status.end, $scope.selectedMonth, $scope.selectedYear) ) {
			calendartable[i].statuslines[j].status = status.status;
		} else {

			$.each(calendartable[i].statuslines, function(j, statusline) {
				
				if ( sameDay(statusline.start, dateFromString(status.start)) )  {
					for (k = 0; k < (status.end - status.start) + 1; k++) {
						calendartable[i].statuslines.splice(j, 1);
					}
					
					var days = numberOfDaysBetweenDates(dateFromString(status.end), dateFromString(status.start));
			calendartable[i].statuslines.sort(custom_sort);
			
					calendartable[i].statuslines.push({
						"start": dateFromString(status.start),
						"end": dateFromString(status.end),
						"status": status.status,
						"colspan": numberOfDaysBetweenDates(dateFromString(status.end), dateFromString(status.start)) + 1
					});
					calendartable[i].statuslines.sort(custom_sort);


					return false; //jquery loopbreak
				}
			});
		}

		return calendartable;
	}


	function getSystemData() {
		var calendartable = [];
		var syslines = Systems.systems.query(function() {
			$.each(syslines, function(i, system) {
				calendartable = addEmptyElementsForSystem(system.system, calendartable, i);
				$.each(system.statuslines, function(j, status) {
					calendartable = insertCalendarElement(calendartable, status, i, j);
				});
			});
			
			calendartable.sort(ascSystemSort);
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
		var deletedStatusIndex;
		$.each($scope.systemlines, function(i, v_system) {
			if (v_system.system == $scope.systemFormData.system) {
				$.each(v_system.statuslines, function(j, v_status) {
					if (v_status.start == convertDateToDatabaseFormat($scope.systemFormData.start) && v_status.end == convertDateToDatabaseFormat($scope.systemFormData.end) && v_status.status == $scope.systemFormData.status) {
						$scope.systemlines[i].statuslines.splice(j, 1);
						fillSpaceWithEmptyElements(v_status, i);

						$scope.systemlines[i].statuslines.sort(custom_sort);
						savedStatusIndex = i;
					}
				});
			}
		});	
		
		updateStatuslineToDB(savedStatusIndex);
	};
	
	
	function fillSpaceWithEmptyElements(v_status, i){
		for (k = 0; k < (v_status.end - v_status.start) + 1; k++) {
			$scope.systemlines[i].statuslines.push({
				"start": (parseInt(v_status.start) + k),
				"end": (parseInt(v_status.start) + k),
				"status": "available"
			});
		}
	}
	
	
	function findSelectedElement(callbackFunction){
		var systemIndex;
		$.each($scope.systemlines, function(i, v_system) {
			if (v_system.system == $scope.systemFormData.system) {
				systemIndex = i;
				
				$.each(v_system.statuslines, function(j, v_status) {
					callbackFunction();
				});
			}
		});
		
		updateStatuslineToDB(updateStatusIndex);
	}

	
	$scope.updateStatusElement = function(id) {
		
		var updateStatusIndex;
		
		$.each($scope.systemlines, function(i, v_system) {

			if (v_system.system == $scope.systemFormData.system) {

				$.each(v_system.statuslines, function(j, v_status) {

					if (v_status.start == $scope.selectedElement.start && v_status.end == $scope.selectedElement.end && v_status.status == $scope.selectedElement.status) {
						
						$scope.systemlines[i].statuslines.splice(j, 1);
						fillSpaceWithEmptyElements(v_status, i);
						$scope.systemlines[i].statuslines.sort(custom_sort);
					}
				});
				
				$.each(v_system.statuslines, function(j, v_status) {
				
					if (checkNewElementStartDay(v_status)) {
						if (isNewElementSingleDay()) {
						
							$scope.systemlines[i].statuslines[j].status = $scope.systemFormData.status;
							
						} 
						else {
							if(isNewElementOverlapping(v_status, i, j)){
								alert("Overlap!");
								return false;
							}
							
							clearSpaceForNewElement(convertDateToDatabaseFormat($scope.systemFormData.start), i, j);
							addNewElement(i);
							$scope.systemlines[i].statuslines.sort(custom_sort);
							return false; //jquery break
						}
					}
				});
				
				updateStatusIndex = i;
			}
		});	
		
		//TODO if undefined
		updateStatuslineToDB(updateStatusIndex);
	};
	
	
	function updateStatuslineToDB(index){
	
		var systemElement;
	    var statusItems = [];
		
		systemElement = { 
						  "system": $scope.systemlines[index].system,
						  "statuslines": ""
						};
		
		//funka ikkje me $.each
		for(var j = 0; j < $scope.systemlines[index].statuslines.length; j++)
		{				
			if($scope.systemlines[index].statuslines[j].status != 'available'){
				statusItems.push($scope.systemlines[index].statuslines[j]);
			}			
		}

		systemElement.statuslines = statusItems;
		Systems.systems.update({id:$scope.systemlines[index]._id.$oid}, systemElement, function(item){});		
		//Systems.systems.delete({id:$scope.systemlines[savedStatusIndex]._id.$oid}, function(){});
	}

	$scope.addStatusElement = function() {

		var savedStatusIndex;

		$.each($scope.systemlines, function(i, v_system) {
			if (v_system.system == $scope.systemFormData.system) {
				$.each(v_system.statuslines, function(j, v_status) {
					if (checkNewElementStartDay(v_status)) {
						if (isNewElementSingleDay()) {
							$scope.systemlines[i].statuslines[j].status = $scope.systemFormData.status;
						}
						else {
							if(isNewElementOverlapping(v_status, i, j)){
								alert("Overlap!");
								return false;
							}
							clearSpaceForNewElement(v_status.start, i, j);
							addNewElement(i);
							$scope.systemlines[i].statuslines.sort(custom_sort);
							
							savedStatusIndex = i;
							return false; //jquery break
						}
					}
				});
			}
		});
		
		updateStatuslineToDB(savedStatusIndex);
	};
	
	
	function isNewElementSingleDay(){
		var result = false;
		if (convertDateToDatabaseFormat($scope.systemFormData.start) == convertDateToDatabaseFormat($scope.systemFormData.end)){
			result = true;
		}
		return result;
	}
	
	
	function addNewElement(index){
		$scope.systemlines[index].statuslines.push({
			"start": convertDateToDatabaseFormat($scope.systemFormData.start),
			"end": convertDateToDatabaseFormat($scope.systemFormData.end),
			"status": $scope.systemFormData.status,
			"comment": $scope.systemFormData.comment
		});
	}
	
	
	function clearSpaceForNewElement(elementStartDate, i, j){
		for (k = 0; k < (convertDateToDatabaseFormat($scope.systemFormData.end) - elementStartDate) + 1; k++) {
			$scope.systemlines[i].statuslines.splice(j, 1);
		}
	}
	

	function checkNewElementStartDay(element){
	
		var result = false;
		if (element.start == convertDateToDatabaseFormat($scope.systemFormData.start) && element.end == convertDateToDatabaseFormat($scope.systemFormData.start)){
			result = true;
		}
		return result;
	}
	
	
	function isNewElementOverlapping(element, i, j)
	{
		for (k = 0; k < (convertDateToDatabaseFormat($scope.systemFormData.end) - element.start) + 1; k++) {
			if ($scope.systemlines[i].statuslines[j + k].status != 'available') {
				return true; //jquery break
			}
		}
	}


	$scope.showDetails = function(systemLine, statusLine) {

		if(statusLine.status != "available")
		{
			$scope.systemFormData._id = systemLine._id;
			$scope.systemFormData.system = systemLine.system;
			$scope.systemFormData.status = statusLine.status;
			$scope.systemFormData.start = convertDateToViewableFormat(statusLine.start);
			$scope.systemFormData.end = convertDateToViewableFormat(statusLine.end);
			$scope.systemFormData.comment = "";
			
			$scope.selectedElement._id = systemLine._id;
			$scope.selectedElement.system = systemLine.system;
			$scope.selectedElement.status = statusLine.status;
			$scope.selectedElement.start = statusLine.start;
			$scope.selectedElement.end = statusLine.end;
			$scope.systemFormData.comment = statusLine.comment;
			
		}
		else
		{
			$scope.systemFormData.system = "";
			$scope.systemFormData.status = "";
			$scope.systemFormData.start = "";
			$scope.systemFormData.end = "";
			$scope.systemFormData.comment = "";
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

	function dateFromString(dateString) {
		return new Date( dateString.substr(0, 4), dateString.substr(4, 2) - 1, dateString.substr(6,2) );
	}

	function sameDay(date1, date2) {
		return date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate();
	}
});