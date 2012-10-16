var directiveModule = angular.module('directiveModule', ['utilsModule']);

directiveModule.directive('clearPopoversAndSelections', function() {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			element.click(function() {
				if(scope.selectedElement.elmIndex > -1 && scope.selectedElement.sysIndex > -1 && scope.hoverElement.hasValue) {
					scope.hoverElement.element.popover('hide');
					scope.clearHoverElement();
					scope.unSelectElement();
					scope.$apply();
				}
			});
		}
	};
});


directiveModule.directive('bsPopoverhover', function($compile, $http, $timeout) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			var sysIndex = element.attr("sysIndex"),
				elmIndex = element.attr("elmIndex"),
				systeml = scope.systemlines[sysIndex],
				statusl = scope.systemlines[sysIndex].statuslines[elmIndex],
				editButtonTemplate = '<a class="pull-right" ng-click="callModal($event);"><i class="icon-pencil"></i></a>',
				deleteButtonTemplate = '<a class="pull-right" ng-click="removeStatusElement();" clear-popovers-and-selections><i class="icon-trash"></i></a>',
				closeButtonTemplate = '<a class="pull-right" clear-popovers-and-selections><i class="icon-remove"></i></a>',
				titleString = systeml.system + ' - ' + statusl.status + closeButtonTemplate + deleteButtonTemplate + editButtonTemplate,
				contentString = statusl.comment;
				
				var closeButtonTemplate = '<a class="pull-right" clear-popovers-and-selections><i class="icon-remove"></i></a>';		
			var testcontent = '<div>' +
								  '<p>{{hoverElement.start}} - {{hoverElement.end}}</p>' +
								  '</br>' +
								  '<p>{{hoverElement.comment}}</p>' +
							  '</div>';
				
			var data = titleString;
				
			element.popover({
				title: function() {
					$timeout(function() {
						$compile(element.data('popover').tip())(scope);
					});
					return data;
				},
				trigger: 'manual',
				placement: 'bottom',
				content: testcontent,
				html: true
			});
				
			
			element.click(function() {

				if(element != scope.hoverElement.element) {
					scope.hoverElement.element.popover('hide');
					scope.setHoverElement(element.attr('sysIndex'), element.attr('elmIndex'), element);
					element.popover('show');
				}
				
			});
			
			
			element.hover(function() {
				if(scope.selectedElement.elmIndex == -1 && scope.selectedElement.sysIndex == -1) {
					scope.setHoverElement(element.attr('sysIndex'), element.attr('elmIndex'), element);
					element.popover('show');
				}
			},
			function() {
				if(scope.selectedElement.elmIndex == -1 && scope.selectedElement.sysIndex == -1) {
					scope.clearHoverElement();
					element.popover('hide');
				}
			});				
		}
	};
});


directiveModule.directive('systemTable', function($compile, Utils){
	return {
			restrict: 'E',
			//replace: true,
			//transclude: true,	
			link: function(scope, element, attrs) {
			
				var stopRecursive;
				var dataComplete = false; 
				
				function isDataReady(dataTab) {
					var result = false;
					if (dataTab.length > 0 && dataComplete) {
						result = true;
					} else if (dataTab.length > 0) {
						dataComplete = true; 
					}
					return result;
				}
				
								function firstOfMonthStr(start) {
					var tmpDate = new String();
					var selectedMonth = scope.selectedMonth + 1;
					selectedMonth = Utils.padZeroFront(selectedMonth);
					tmpDate = tmpDate.concat(start.getFullYear(), selectedMonth, '01');
					return tmpDate;
				}
				
				function lastOfMonthStr(start) {
					var tmpDate = new String();
					var selectedMonth = scope.selectedMonth + 1;
					selectedMonth = Utils.padZeroFront(selectedMonth);
					tmpDate = tmpDate.concat(start.getFullYear(), selectedMonth, scope.noOfDaysInMonth[scope.selectedMonth]);
					return tmpDate;
				}
				
				function isStartDateMaching(start, day) {
					var result = false;
					if(start.getDate() == day && start.getMonth() == scope.selectedMonth && start.getFullYear() == scope.selectedYear) {result = true;}
					return result;
				}
				
				function isElementIntoPrevMonth(start, end, day) {
					var result = false;
					if(start.getMonth() < scope.selectedMonth && end.getMonth() == scope.selectedMonth && day == 1 && start.getFullYear() == scope.selectedYear) {result = true;}
					return result;
				}
				
				function isElementSpanningMonth(start, end, day) {
					var result = false;
					if(start.getMonth() < scope.selectedMonth && end.getMonth() > scope.selectedMonth && day == 1 && start.getFullYear() == scope.selectedYear) {result = true;}
					return result;
				}
				
				function isElementIntoPrevYear(start, end, day) {
					var result = false;
					if(start.getMonth() > scope.selectedMonth && end.getMonth() == scope.selectedMonth && day == 1 && start.getFullYear() == scope.selectedYear - 1) {result = true;}
					return result;
				}
				
				function findMatchingElement(day, system) {
					var result = "";
					day = day + 1;
					
					var statuslines = system.statuslines;
					
					$.each(statuslines, function(i, v_line) {
						var start = Utils.convertToDate(v_line.start);
						var end = Utils.convertToDate(v_line.end);
						
						if(isStartDateMaching(start, day)) {
						
							result = v_line;
							
							if(end.getMonth() > scope.selectedMonth || end.getFullYear() > start.getFullYear()) {
								result.isEndDateInNextMonth = true;
								result.tempEndDate = lastOfMonthStr(start);
							}
							
							result.index = i;
							
						}else if(isElementIntoPrevMonth(start, end, day)) {
							result = v_line;
							result.isStartDateInPrevMonth = true;
							result.tempStartDate = firstOfMonthStr(start);
							result.index = i;
							
						}else if(isElementSpanningMonth(start, end, day)) {
							result = v_line;
							result.isInsideSelectedMonth = true;
							result.tempStartDate = firstOfMonthStr(start);
							result.tempEndDate = lastOfMonthStr(start);
							result.index = i;						
							
						}else if(isElementIntoPrevYear(start, end, day)) {
							result = v_line;
							result.isStartDateInPrevYear = true;
							
							var tmpStartDate = new Date(start),
							yearDiff = end.getFullYear() - start.getFullYear();
							tmpStartDate.setFullYear(start.getFullYear() + yearDiff);
							
							result.tempStartDate = firstOfMonthStr(tmpStartDate);
							result.index = i;
						}
					
						
					});
					
					return result;
				}
								
				function systemExist(systemName) {
					var match = {
						result: false,
						index: -1
					};
				
					var j;
					for(j = 0; j < scope.systemlines.length; j++){
						if (systemName == scope.systemlines[j].system) {
							match.result = true;
							match.index = j;
							break;
						}	
					}
					
					return match;
				}

				function buildTemplateForExistingSystem(systemIndex) {
					
					var template = '<tr><td class="system"><span class="badge badge-info">{{systemlines['+systemIndex+'].system}}</span></td>';
					var day;
					for(day = 0; day < scope.noOfDaysInMonth[scope.selectedMonth]; day++){

						var element = findMatchingElement(day, jQuery.extend(true, {}, scope.systemlines[systemIndex]));
						
						if(element == "") {
							template += '<td clear-popovers-and-selections></td>';
						}else{
						
							var colspan;
							
							if(element.isEndDateInNextMonth) {
								colspan = element.tempEndDate - element.start + 1;
							}else if(element.isStartDateInPrevMonth) {
								colspan = element.end - element.tempStartDate + 1;
							}else if(element.isInsideSelectedMonth) {
								colspan = element.tempEndDate - element.tempStartDate + 1;
							}else if(element.isStartDateInPrevYear) {
								colspan = element.end - element.tempStartDate + 1;
							}else{
								colspan = element.end - element.start + 1;
							}
							
							template += '<td class="filledcell" colspan="'+colspan+'">'+
							
											'<span ng:class="getClassForElement('+systemIndex+','+element.index+')"'+ 
												  'ng-click="selectElement($event, '+systemIndex+','+element.index+')"'+ 
												  'bs-popoverhover '+ 
												  'sysIndex="'+systemIndex+'"'+
												  'elmIndex="'+element.index+'"'+ 
												  'rel="popover">'+ 
											'</span>'+	
											
										'</td>';
							day = day + colspan - 1;
						}
					}
						
					template += '</tr>';
					return template;
				}
				
				
				function buildTemplateForNoneExistingSystem(systemName) {
				
					var template = '<tr><td class="system"><span class="badge badge-info">'+systemName+'</span></td>';
					var day;
					for(day = 0; day < scope.noOfDaysInMonth[scope.selectedMonth]; day++){
						template += '<td clear-popovers-and-selections></td>';
					}
						
					template += '</tr>';
					return template;
				}
				

				function buildCalendar() {
					var template = 	'<table id="maintable">' +
										'<thead>'+
										
											'<tr>'+
												'<th class="year" colspan="{{noOfDaysInMonth[' + scope.selectedMonth + '] + 1}}">'+
													'<i class="yeararrow icon-chevron-left" ng-click="gotoPreviousYear()" clear-popovers-and-selections></i>'+
													'<span class="yeartext">{{selectedYear}}</span>'+
													'<i class="yeararrow icon-chevron-right"  ng-click="gotoNextYear()" clear-popovers-and-selections></i>'+
												'</th>'+
											'</tr>'+
											
											'<tr>'+
												'<th class="months" colspan="{{noOfDaysInMonth[' + scope.selectedMonth + '] + 1}}">'+
													'<div ng:class="getClassForMonth(month)" ng-click="gotoMonth($event, month)" ng-repeat="month in [0,1,2,3,4,5,6,7,8,9,10,11]">'+
														'{{months[month]}}' +
													'</div>'+
												'</th>'+
											'</tr>'+
											'<tr>'+
												'<th class="firstcol week" rowspan="4"></th>'+
												'<th class="week" ng-repeat="week in monthWeekList['+scope.selectedMonth+']" colspan="{{week.colSpan}}">{{week.week}}</th>'+
											'</tr>'+
											
											'<tr class="daynames">'+
												'<th ng-repeat="dayName in dayNamesInMonth('+scope.selectedMonth+')">{{dayName}}</th>'+
											'</tr>'+
											
											'<tr class="shortdaynames">'+
												'<th ng-repeat="shortDayName in shortDayNamesInMonth('+scope.selectedMonth+')">{{shortDayName}}</th>'+
											'</tr>'+
											
											'<tr>'+
												'<th ng-repeat="day in monthDayList['+scope.selectedMonth+']">{{day}}</th>'+
											'</tr>'+
											
										'</thead>'+
										'<tbody>';
											var i;
											for(i = 0; i < scope.systemnames.length; i++){

												var systemMatch = systemExist(scope.systemnames[i].name);
												if(systemMatch.result) {
													template += buildTemplateForExistingSystem(systemMatch.index);
												}else {
													template += buildTemplateForNoneExistingSystem(scope.systemnames[i].name);
												}
											}
											
							template += '</tbody>'+
									'</table>';
								  
					element.html(template);				
					$compile(element.contents())(scope);
					
				}
				
				scope.$watch('systemlines', function(newVal, oldVal) {
				
				    if (stopRecursive === newVal) {return;}

					if(isDataReady(scope.systemlines)){
						buildCalendar();
					}

					stopRecursive = angular.copy(newVal);
				});
				
				
				scope.$watch('selectedMonth', function() {
					buildCalendar();
				});

				
				scope.$watch('systemnames', function() {

					if(isDataReady(scope.systemnames)){
						buildCalendar();
					}
				
				});
			}		
	};
});

		
directiveModule.directive('jqDatepicker', function (Utils) {
	return {
		link: function postLink(scope, element, attrs) {
			element.datepicker({
				dateFormat: "dd.mm.yy",
				onClose: function (dateText, inst) {
					if(element.context.id == "updateFormStartDate"){
						scope.updateFormData.start = dateText;
					}
					else if(element.context.id == "updateFormEndDate"){
						scope.updateFormData.end = dateText;
					}else if(element.context.id == "newFormStartDate"){
						scope.addFormData.start = dateText;
					}else if(element.context.id == "newFormEndDate"){
						scope.addFormData.end = dateText;
					}
					else if(element.context.id == "alertDialogExpDate"){
						scope.addAlertLine.expdate = dateText;
						
						var dbdate = Utils.viewDateToDBDate(dateText);
						var currentDate = Utils.getDateString(new Date());
						var daysLeft = dbdate - currentDate;
						
						var dayText;
						if(daysLeft > 1){
							dayText = "days";
						}else{
							dayText = "day";
						}
						
						$("#expireMessage").text("Alertmessage will expire in " + daysLeft + " " + dayText);
					}
					scope.$apply();
				}	
			});
		}
	};
});					


directiveModule.directive('ngEnterkey', function () {
	return {
				link: function postLink(scope, element, attrs) {
					element.keydown(function(event) {
						if(event.which == 13){
						
							var searchStr = 'ng-enterkey="';
							var ohtml = element[0].outerHTML;
							
							var matchPos = ohtml.indexOf(searchStr);
							
							if(matchPos > 0){
								matchPos = matchPos + searchStr.length;	
								var matchPosEnd = ohtml.indexOf('(', matchPos);
								
								var incommingFunction = ohtml.substr(matchPos, matchPosEnd - matchPos);	
								incommingFunction = 'scope.' + incommingFunction;
								incommingFunction = new Function("scope", "return " + incommingFunction + "();");
								
								//Run
								incommingFunction(scope);

							}
							
						}
					});
				}
	}
});
	
