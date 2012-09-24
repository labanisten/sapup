
	var directiveModule = angular.module('directiveModule', ['utilsModule']);
	
	directiveModule.directive('clearPopoversAndSelections', function(){
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
	

	directiveModule.directive('bsPopoverhover', function($compile, $http, $timeout){
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				
				var sysIndex = element.attr("sysIndex");
				var elmIndex = element.attr("elmIndex");
				var systeml = scope.systemlines[sysIndex];
				var statusl = scope.systemlines[sysIndex].statuslines[elmIndex];
				
				var editButtonTemplate = '<a class="btn btn-mini btn-inverse pull-right" ng-click="callModal($event);"><i class="icon-pencil icon-white"></i></a>';
				var deleteButtonTemplate = '<a class="btn btn-mini btn-inverse pull-right" ng-click="removeStatusElement();" clear-popovers-and-selections><i class="icon-trash icon-white"></i></a>';
				var titleString = systeml.system + ' - ' + statusl.status + deleteButtonTemplate + editButtonTemplate;
				
				
				var contentString = statusl.comment;
				
				//TODO style popovercontent
				var testcontent = '<div>'+
									  '<p>{{hoverElement.start}} - {{hoverElement.end}}</p>'+
									  '</br>'+
									  '<p>{{hoverElement.comment}}</p>'+
								  '</div>';

				//$http.get(attrs.bsPopover).success(function(data) {
					//var asd = data;
					//scope.dismiss = function(scope) { element.popover('hide'); };
					
				var data = titleString;
					
				element.popover({
					title: function() {
						$timeout(function(){
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
				
				
				element.hover(function(){
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
					

					function findMatchingElement(day, statuslines) {
						var result = "";
						day = day + 1;
						
						$.each(statuslines, function(i, v_line) {
							var start = Utils.convertToDate(v_line.start);
							var end = Utils.convertToDate(v_line.end);
							
							var sm = start.getMonth();
							var sel = scope.selectedMonth;
							
							if(start.getDate() == day && start.getMonth() == scope.selectedMonth && start.getFullYear() == scope.selectedYear) {
								result = v_line;
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
					
						for(var j = 0; j < scope.systemlines.length; j++){
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
						for(var day = 0; day < scope.noOfDaysInMonth[scope.selectedMonth]; day++){
							
							var elementIndex = findMatchingElement(day, scope.systemlines[systemIndex].statuslines);
							if(elementIndex == "") {
								template += '<td clear-popovers-and-selections></td>';
							}else{
								var colspan = elementIndex.end - elementIndex.start + 1;
								template += '<td class="filledcell" colspan="'+colspan+'">'+
								
												'<span ng:class="getClassForElement('+systemIndex+','+elementIndex.index+')"'+ 
													  'ng-click="selectElement($event, '+systemIndex+','+elementIndex.index+')"'+ 
													  'bs-popoverhover '+ 
													  'sysIndex="'+systemIndex+'"'+
													  'elmIndex="'+elementIndex.index+'"'+ 
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
						for(var day = 0; day < scope.noOfDaysInMonth[scope.selectedMonth]; day++){
							template += '<td clear-popovers-and-selections></td>';
						}
							
						template += '</tr>';
						return template;
					}
					

					function buildCalendar() {
						var template = 	'<table id="maintable">'+
											'<thead>'+
												'<tr>'+
													'<th class="months" colspan="{{noOfDaysInMonth[' + scope.selectedMonth + '] + 1}}">'+
														'<div clear-popovers-and-selections ng:class="getClassForMonth(month)" ng-click="gotoMonth($event, month)" ng-repeat="month in [0,1,2,3,4,5,6,7,8,9,10,11]">'+
															'{{months[month]}}' +
														'</div>'+
													'</th>'+
												'</tr>'+
												'<tr>'+
													'<th class="firstcol week" rowspan="4"></th>'+
													'<th class="week" ng-repeat="week in monthWeekList['+scope.selectedMonth+']" colspan="{{week.colSpan}}">{{week.week}}</th>'+
												'</tr>'+
												
												'<tr class="dayNames">'+
													'<th ng-repeat="dayName in dayNamesInMonth('+scope.selectedMonth+')">{{dayName}}</th>'+
												'</tr>'+
												
												'<tr class="shortDayNames">'+
													'<th ng-repeat="shortDayName in shortDayNamesInMonth('+scope.selectedMonth+')">{{shortDayName}}</th>'+
												'</tr>'+
												
												'<tr>'+
													'<th ng-repeat="day in monthDayList['+scope.selectedMonth+']">{{day}}</th>'+
												'</tr>'+
												
											'</thead>'+
											'<tbody>';

												for(var i = 0; i < scope.systemnames.length; i++){

													var systemMatch = systemExist(scope.systemnames[i].name);
													if(systemMatch.result) {
														template += buildTemplateForExistingSystem(systemMatch.index)
													}else {
														template += buildTemplateForNoneExistingSystem(scope.systemnames[i].name);
													}
												}
												
								template += '</tbody>'+
									    '</table>';
									  
						element.html(template);				
						$compile(element.contents())(scope);
						
					}
				}		
		}
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
							
							var dbdate = Utils.viewDateToDBdate(dateText);
							var currentDate = Utils.getDateString(new Date());
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
	});					
	
	
	directiveModule.directive('ngEnterkey', function () {
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
		
	