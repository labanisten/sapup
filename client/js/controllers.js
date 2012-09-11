



var myModule = angular.module('systemAvailability', ['mongolabModule', 'calendarModule', 'calendarDataModule']);


myModule.directive('bsPopoverhover', function(){
    return {
		restrict: 'C',
		link: function (scope, element, attrs) {
				
				element.hover(function(){
					//if(scope.selectedElement._id == "") {
						element.popover('show');
					//}
					
				},
				function() {
				
					//if(scope.selectedElement._id == "") {
						element.popover('hide');
					//}
				});		
			
			
			/*element.click(function() {
				
				$("#systemtab").find(".element-inner-selected").popover("hide");
				
				//if(scope.selectedElement._id == "") {
					element.popover('show');
				//}else{
				//	element.popover('hide');
				//}
				
				
				//$(this).parent().parent().children().children().each(function(){
				
					//console.log("asdas");
					//$(this).popover('hide');
				//});
				
			});*/
		}
    };
});


myModule.directive('elementClick', function(){
	return {
		restrict: 'C',
		
		link: function(scope, element, attrs) {
			element.click(function () {
				console.log("asdas");
				element.addClass("selected");
				//element.removeClass("element-inner-freeze");
			});
		}
	};
});


myModule.directive('systemTable', function($compile){
	return {
			restrict: 'E',
			
			//replace: true,
			//transclude: true,	
			//scope: true,
			
			link: function(scope, element, attrs) {
			
				scope.$watch('systemlines', function() {
					buildCalendar();			
				});
				
				scope.$watch('selectedMonth', function() {
					buildCalendar();
				});
				
				function findMatchingElement(day, statuslines) {
					var result = "";
					day = day + 1;
					
					$.each(statuslines, function(i, v_line) {
						var start = convertToDate(v_line.start);
						var end = convertToDate(v_line.end);
						
						if(start.getDate() == day && start.getMonth() == scope.selectedMonth && start.getFullYear() == scope.selectedYear) {
							//console.log("match: " + start.getDate());
							result = v_line;
							result.index = i;
						}
						
					});
					
					return result;
				}

				function buildCalendar() {
					var template = 	'<table>'+
				
									'<thead>'+
										'<tr>'+
											'<th class="month" colspan="{{noOfDaysInMonth['+scope.selectedMonth+'] + 1}}">{{monthName['+scope.selectedMonth+']}}</th>'+
										'</tr>'+
										'<tr>'+
											'<th class="firstcol week" rowspan="3"></th>'+
											'<th class="week" ng-repeat="week in monthWeekList['+scope.selectedMonth+']" colspan="{{week.colSpan}}">{{week.week}}</th>'+
										'</tr>'+
										'<tr>'+
											'<th ng-repeat="dayName in dayNamesInMonth('+scope.selectedMonth+')">{{dayName}}</th>'+
										'</tr>'+
										'<tr>'+
											'<th ng-repeat="day in monthDayList['+scope.selectedMonth+']">{{day}}</th>'+
										'</tr>'+
									'</thead>'+

								  '<tbody>';

										console.log("systemlines: " + scope.systemlines.length);
										
										for(var i = 0; i < scope.systemlines.length; i++){

											template += '<tr>'+ 
															'<td class="system">'+
																'<span class="badge badge-info">{{systemlines['+i+'].system}}</span>'+
															'</td>';
														
											//var statuslines = scope.systemlines[i].statuslines;
																					
											//var elementIt = 0;
											for(var day = 0; day < scope.noOfDaysInMonth[scope.selectedMonth]; day++){
												
													var result = findMatchingElement(day, scope.systemlines[i].statuslines);
													
													if(result == "") {
													
														template += '<td>'+
																		 
																		'<span class="element-inner available"'+
																		'</span>'+	
																		
																	'</td>';
													}else{
														var colspan = result.end - result.start;
														template += '<td colspan="'+colspan+'" ng-click="setSelectetElement(systemlines['+i+'], systemlines['+i+'].statuslines['+result.index+'])">'+
																		 
																		'<span class="element-inner {{systemlines['+i+'].statuslines['+result.index+'].status}} bs-popoverhover element-click"'+
																			  'status="{{systemlines['+i+'].statuslines['+result.index+'].status}}"'+
																			  'rel="popover"'+ 
																			  'data-content="Status: {{systemlines['+i+'].statuslines['+result.index+'].status}} </br> Comment: {{systemlines['+i+'].statuslines['+result.index+'].comment}}"'+ 
																			  'data-original-title="{{systemlines['+i+'].system}}"'+
																			  'data-placement="bottom"'+ 
																			  'data-trigger="manual"'+ 
																			  'data:delay="300">'+
																		'</span>'+	
																		
																	'</td>';
														day = day + colspan - 1;
													}															
												
											}
											
											template += '</tr>';
										}
										
									template += '</tr>'+							
								  '</tbody>';
								  
					element.html(template);				
					$compile(element.contents())(scope);
				}
				
			}
			
			
	}
});

		
myModule.directive('jqDatepicker', function () {
	return {
						link: function postLink(scope, element, attrs) {
							element.datepicker({
								dateFormat: "dd.mm.yy",
								onClose: function (dateText, inst) {
									if(element.context.id == "elementStartDate"){
										scope.systemFormData.start = dateText;
									}
									else if(element.context.id == "elementEndDate"){
										scope.systemFormData.end = dateText;
									}
									else if(element.context.id == "alertDialogExpDate"){
										scope.addAlertLine.expdate = dateText;
										
										var dbdate = viewDateToDBdate(dateText);
										var currentDate = getDateString(new Date());
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
										
										//Run
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
	
	function buildCal() {
		return "testcal";
	}	
	
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


myModule.controller("TimelineCtrl", function($scope, Systems, Calendar, CalendarData) {

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
	
	$scope.selectedYear = Calendar.getCurrentYear;
	$scope.selectedMonth = Calendar.getCurrentMonth();
	$scope.selectedMonthLabel = Calendar.getMonthName($scope.selectedMonth);

	$scope.setSelectedMonth = function(month) {
		$scope.selectedMonth = month;
	};

	$scope.gotoMonth = function(month) {
		//$scope.selectedYear = Calendar.getCurrentYear();
		$scope.selectedMonth = month;
	};

	function getSystemData() {
		var calendartable = [];
		var syslines = Systems.systems.query(function() {
			/*
			$.each(syslines, function(i, system) {
				//calendartable = addEmptyElementsForSystem(system, calendartable, i);
				calendartable = CalendarData.addEmptyElementsForSystem(system, calendartable, Calendar.getNoOfDaysInMonth($scope.selectedMonth), i);
				$.each(system.statuslines, function(j, status) {
					calendartable = insertCalendarElement(calendartable, status, i, j);
				});
			});
			calendartable.sort(ascSystemSort);
			*/
			
			calendartable = CalendarData.setElementOffset(syslines);
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
		//var currentDate = new Date();
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
			//CalendarData.updateStatuslineToDB($scope.systemlines[savedStatusIndex]);
		}
	};
	
	
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
								
								//var days = Calendar.numberOfDaysBetweenDates(dateFromString(status.end), dateFromString(status.start));
								//calendartable[i].statuslines.sort(custom_sort);
						
								calendartable[i].statuslines.push({
									"start": dateFromString(status.start),
									"end": dateFromString(status.end),
									"status": status.status,
									"viewcolor":status.status,
									"colspan": numberOfDaysBetweenDates(dateFromString(status.end), dateFromString(status.start)) + 1
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
	
	
	$scope.updateStatusElement = function(id) {

		if($("#elementForm").valid()){	
		
			var systemWasFound = false;		
			var updateStatusIndex = -1;
		
			$.each($scope.systemlines, function(i, v_system) {

				if (v_system.system == $scope.systemFormData.system) {
				
					systemWasFound = true;
					CalendarData.removeCalendarElement(v_system, $scope.selectedElement);
					CalendarData.findAndAddNewElement(v_system, $scope.systemFormData);
					
					//set updated element as selected
					$scope.selectedElement.start = viewDateToDateObject($scope.systemFormData.start);
					$scope.selectedElement.end = viewDateToDateObject($scope.systemFormData.end);
					
					updateStatusIndex = i;
				}
			});	
			
			if(systemWasFound){
				if(updateStatusIndex >= 0){
					addLineToElementModalLog("Element in " + $scope.systemlines[updateStatusIndex].system + " was updated");
					updateStatuslineToDB(updateStatusIndex);
					//CalendarData.updateStatuslineToDB($scope.systemlines[updateStatusIndex]);
				}else
					addLineToElementModalLog("Element not added, no room for updated element in " + $scope.systemFormData.system + " on these dates");
			}else{
				addLineToElementModalLog("System " + $scope.systemFormData.system + " was not found in database");
			}
		}
	};
	
		
	$scope.addStatusElement = function() {

		if($("#elementForm").valid()){
			
			var systemWasFound = false;		
			var savedStatusIndex = -1;

			$.each($scope.systemlines, function(i, v_system) {
			
				if (v_system.system == $scope.systemFormData.system) {
				
					systemWasFound = true;
					
					$.each(v_system.statuslines, function(j, v_status) {
					
						if (CalendarData.checkNewElementStartDay(v_status, $scope.systemFormData.start)) {
							if (isNewElementSingleDay($scope.systemFormData)) {
								$scope.systemlines[i].statuslines[j].status = $scope.systemFormData.status;
							}
							else {
								if(CalendarData.isNewElementOverlapping(v_status, $scope.systemFormData.end, $scope.systemlines[i], j)){
									return false;
								}
								
								CalendarData.clearSpaceForNewElement(v_status.start, $scope.systemFormData.end, $scope.systemlines[i], j);
								CalendarData.addNewElement($scope.systemFormData, $scope.systemlines[i].statuslines);
								
								$scope.systemlines[i].statuslines.sort(custom_sort);
								
								savedStatusIndex = i;
								return false; //jquery break
							}
						}
						
					});	
		
				}
			});
			
			
			if(systemWasFound){
				if(savedStatusIndex >= 0){
					addLineToElementModalLog("Element added to " + $scope.systemlines[savedStatusIndex].system);
					updateStatuslineToDB(savedStatusIndex);
					//CalendarData.updateStatuslineToDB($scope.systemlines[savedStatusIndex]);
				}else
					addLineToElementModalLog("Element not added, no room for new element in " + $scope.systemFormData.system + " on these dates");
			}else{
				addLineToElementModalLog("System " + $scope.systemFormData.system + " was not found in database");
			}

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
		// legg over alle element frå statuslines som ikkje har available status
		for(var j = 0; j < $scope.systemlines[index].statuslines.length; j++)
		{				
			if($scope.systemlines[index].statuslines[j].status != 'available'){
				var tmpObject = jQuery.extend(true, {}, $scope.systemlines[index].statuslines[j]);
				tmpObject.start = getDateString(tmpObject.start);
			    tmpObject.end = getDateString(tmpObject.end);
				delete tmpObject['viewcolor'];
				statusItems.push(tmpObject);			
			}			
		}	

		systemElement.statuslines = statusItems;	
		Systems.systems.update({id:$scope.systemlines[index]._id.$oid}, systemElement, function(item){});		

	}

	
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
			$scope.selectedElement.start = statusLine.start;
			$scope.selectedElement.end = statusLine.end;
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
			
			//$("#systemtab").find(".element-inner-selected").popover("hide");
		}	
	};
	
	
});