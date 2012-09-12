

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
					/*
					element.parent().parent().children().each(function(){
						//$(this).removeClass("selected");
						$(this).css('background-color', 'red');
					});
					
					*/
					element.parent().find().css('background-color', 'red');
					
					if(element.hasClass('selected')){
						element.removeClass("selected");
					}else{
						element.addClass("selected");
					}
					
					var systemLine = attrs

					/*
					var systemLine;
					var statusLine;
					
					scope.systemFormData._id = systemLine._id;
					scope.systemFormData.system = systemLine.system;
					scope.systemFormData.status = statusLine.status;
					scope.systemFormData.start = dbDateToViewDate(statusLine.start);
					scope.systemFormData.end = dbDateToViewDate(statusLine.end);
					scope.systemFormData.comment = "";
					
					scope.selectedElement._id = systemLine._id;
					scope.selectedElement.system = systemLine.system;
					scope.selectedElement.status = statusLine.status;
					scope.selectedElement.start = convertToDate(statusLine.start);
					scope.selectedElement.end = convertToDate(statusLine.end);		
					scope.selectedElement.statusLineRef = statusLine;
					*/
				});
			
			}
		};
	});
	
	
	myModule.directive('monthClick', function(){
		return {
			restrict: 'C',
			
			link: function(scope, element, attrs) {
				element.click(function () {
					console.log("month");
					element.addClass("selected");
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
							
							var sm = start.getMonth();
							var sel = scope.selectedMonth;
							
							if(start.getDate() == day && start.getMonth() == scope.selectedMonth && start.getFullYear() == scope.selectedYear) {
								result = v_line;
								result.index = i;
							}
							
						});
						
						return result;
					}
					
					/*<div class="row-fluid" style="margin-bottom: 15px">
						<div class="span1" ng-repeat="month in [0,1,2,3,4,5,6,7,8,9,10,11]">
							<button style="width:100%" ng-click="gotoMonth(month)" class="btn btn-mini" type="button">{{months[month]}}</button>
						</div>
					</div>*/

					function buildCalendar() {
						var template = 	'<table>'+
					
											'<thead>'+
												'<tr>'+
													//'<th class="month" colspan="{{noOfDaysInMonth['+scope.selectedMonth+'] + 1}}">{{monthName['+scope.selectedMonth+']}}</th>'+
														'<th class="month" colspan="{{noOfDaysInMonth['+scope.selectedMonth+'] + 1}}">'+
															'<div class="span1" ng-repeat="month in [0,1,2,3,4,5,6,7,8,9,10,11]">'+
																'<a class="month-click" style="width:100%" ng-click="gotoMonth(month)">{{months[month]}}</a>'+
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
																					  'system="'+i+'"'+
																					  'emlindex="'+result.index+'"'+
																				'</span>'+	
																				
																			'</td>';
																day = day + colspan - 1;
															}															
														
													}
													
													template += '</tr>';
												}
												
												template += '</tr>'+							
										    '</tbody>'+
									  '</table>';
									  
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
	});					
	
	
	myModule.directive('ngEnterkey', function () {
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