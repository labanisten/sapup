
$(document).ready(function()
{
	formValidation();
});


var myModule = angular.module('systemAvailability', ['mongolabModule', 'calendarModule']);
		
myModule.directive('jqDatepicker', function () {
	return {
							link: function postLink(scope, element, attrs) {
								element.datepicker({
									dateFormat: "dd/mm/yy",
									onClose: function (dateText, inst) {
										if(element.context.id == "elementStartDate"){
											scope.systemFormData.start = dateText;
										}
										else if(element.context.id == "elementEndDate"){
											scope.systemFormData.end = dateText;
										}
										else if(element.context.id == "alertDialogExpDate"){
											scope.addAlertLine.expdate = dateText;
											
											var dbdate = convertDateToDatabaseFormat(dateText);
											var currentDate = new Date();
											var daysLeft = dbdate - currentDate;
											
											var dayText;
											if(daysLeft > 1){
												dayText = "days"
											}else{
												dayText = "day"
											}
											
											$("#expireMessage").text("Alertmessage will expire in " + daysLeft + " " + dayText);
										}
										scope.$apply();
									}	
								});
							}
						};
		}).directive('ngEnterkey', function () {
			return {
						link: function postLink(scope, element, attrs) {
							element.keydown(function(event) {
								if(event.which == 13){
								
									searchStr = 'ng-enterkey="'
									var ohtml = element[0].outerHTML;
									
									var matchPos = ohtml.indexOf(searchStr);
									
									if(matchPos > 0){
										matchPos = matchPos + searchStr.length;	
										var matchPosEnd = ohtml.indexOf('(', matchPos);
										
										var incommingFunction = ohtml.substr(matchPos, matchPosEnd - matchPos);	
										incommingFunction = 'scope.' + incommingFunction;
										var incommingFunction = new Function("scope", "return " + incommingFunction + "();");
										incommingFunction(scope);

									}
									
								}
							});
						}
			}
		});


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
		
		//$scope.$digest();
		
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

	$scope.monthDayList = Calendar.getMonthDayList;
	$scope.monthWeekList = Calendar.getMonthWeekList(); 
	$scope.monthName = Calendar.getMonthName(Calendar.getCurrentMonth());
	$scope.selectedMonth = Calendar.getCurrentMonth();
	$scope.selectedYear = Calendar.getCurrentYear;

	$scope.noOfDaysInMonth =  Calendar.getNoOfDaysInMonth;
	$scope.dayNamesInMonth = Calendar.getDayNamesInMonth;

	$scope.months = Calendar.monthLabelsShort;

	
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
		
		for (k = 1; k < Calendar.getNoOfDaysInMonth($scope.selectedMonth) + 1; k++) {
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
			try {
					if (status.start == status.end && rangeWithinMonthYear(status.start, status.end, $scope.selectedMonth, $scope.selectedYear) ) {
						calendartable[i].statuslines[j].status = status.status;
					} else {

						$.each(calendartable[i].statuslines, function(j, statusline) {
							
							if ( sameDay(statusline.start, dateFromString(status.start)) )  {
								for (k = 0; k < (status.end - status.start) + 1; k++) {
									calendartable[i].statuslines.splice(j, 1);
								}
								
								var days = Calendar.numberOfDaysBetweenDates(dateFromString(status.end), dateFromString(status.start));
								calendartable[i].statuslines.sort(custom_sort);
						
								calendartable[i].statuslines.push({
									"start": dateFromString(status.start),
									"end": dateFromString(status.end),
									"status": status.status,
									"colspan": days + 1
								});
								calendartable[i].statuslines.sort(custom_sort);


								return false; //jquery loopbreak
							}
						});
					}
				}
				catch(err)
			{
				//TODO -- Log data error to admin view
			}

		return calendartable;
	}


	function getSystemData() {
		var calendartable = [];
		var syslines = Systems.systems.query(function() {
			$.each(syslines, function(i, system) {
				calendartable = addEmptyElementsForSystem(system, calendartable, i);
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
		var systemNames = Systems.systemnames.query(function() {
		});
		return systemNames;
	}


	function getAlertData() {
		var alerts = [];
		var currentDate = new Date();

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
		}
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

		if($("#elementForm").valid()){		
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
		}
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

		if($("#elementForm").valid()){

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

		}
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

	$scope.gotoMonth = function() {
			$('.carousel').carousel('next');
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


	$scope.resetNewAlertForm = function()
	{
		$scope.addAlertLine.title = "";
		$scope.addAlertLine.alerttype = "";
		$scope.addAlertLine.expdate = "";
		$scope.addAlertLine.comment = "";
		
		var validator = $("#alertForm").validate();
        validator.resetForm();
	   
		//$('#alertForm').submit = {};
		//$('#alertForm')[0].reset();
		
		$("#alertTitle").parent('.control-group').removeClass('error');
		$("#alertType").parent('.control-group').removeClass('error');
		$("#alertDialogExpDate").parent('.control-group').removeClass('error');
		$("#alertComment").parent('.control-group').removeClass('error');
		
		$("#alertTitle").parent('.control-group').removeClass('success');
		$("#alertType").parent('.control-group').removeClass('success');
		$("#alertDialogExpDate").parent('.control-group').removeClass('success');
		$("#alertComment").parent('.control-group').removeClass('success');
		
		//$('#alertForm').find('.control-group').removeClass('error');
		//$('#alertForm').find('.control-group').removeClass('success');
		
		$("#expireMessage").text("");
		
	}

});