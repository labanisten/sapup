

var myModule = angular.module('systemAvailability', ['mongolabModule', 'calendarModule', 'calendarDataModule']);


myModule.directive('bsPopoverhover', function(){
    return {
		restrict: 'C',
		link: function (scope, element, attrs) {
				
				element.hover(function(){
						element.popover('show');
				},
				function() {
						element.popover('hide');
				});		
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
														
											for(var day = 0; day < scope.noOfDaysInMonth[scope.selectedMonth]; day++){
												
													var result = findMatchingElement(day, scope.systemlines[i].statuslines);
													
													if(result == "") {
													
														template += '<td>'+
																		 
																		'<span class="element-inner available"'+
																		'</span>'+	
																		
																	'</td>';
													}else{
														var colspan = result.end - result.start + 1;
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
	
	
	$scope.gotoMonth = function(month) {
		//$scope.selectedYear = Calendar.getCurrentYear();
		$scope.selectedMonth = month;
	};

	function getSystemData() {
		var calendartable = [];
		var syslines = Systems.systems.query(function() {
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
	
	
	$scope.updateStatusElement = function(id) {

		if($("#elementForm").valid()){	
			
			$.each($scope.systemlines, function(i, v_system) {
					
				if (v_system.system == $scope.systemFormData.system) {
				
					systemElement = { 
						"system": v_system.system,
						"statuslines": $scope.systemlines[i].statuslines
					};
					
					CalendarData.removeCalendarElement(systemElement, $scope.selectedElement);
					
					var start = viewDateToDBdate($scope.systemFormData.start);
					var end = viewDateToDBdate($scope.systemFormData.end);
					
					statusElement = {
						"start": start,
						"end": end,
						"status": $scope.systemFormData.status
					}
					
					systemElement.statuslines.push(statusElement);
		
					Systems.systems.update({id:$scope.systemlines[i]._id.$oid}, systemElement, function(item){
						addLineToElementModalLog("Element updated in " + $scope.systemlines[i].system);
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
					
						systemElement = { 
							"system": v_system.system,
							"statuslines": $scope.systemlines[i].statuslines
						};
						
						var start = viewDateToDBdate($scope.systemFormData.start);
						var end = viewDateToDBdate($scope.systemFormData.end);
						
						statusElement = {
							"start": start,
							"end": end,
							"status": $scope.systemFormData.status
						}
						
						systemElement.statuslines.push(statusElement);
			
						Systems.systems.update({id:$scope.systemlines[i]._id.$oid}, systemElement, function(item){
							addLineToElementModalLog("Element added to " + $scope.systemlines[i].system);
							$scope.systemlines = getSystemData();
						});
						
						return false;
						
					}else{
						//addLineToElementModalLog("Error!!!!!");
					}
					
			});
		
		}
	};
	
	
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
			$scope.selectedElement.start = convertToDate(statusLine.start);
			$scope.selectedElement.end = convertToDate(statusLine.end);
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

		}	
	};
	
	
});