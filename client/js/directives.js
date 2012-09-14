
	myModule.directive('clearSelect', function(){
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
			
					element.click(function() {
					
						element.parent().parent().children().each(function(){
							$(this).children(".filledcell").each(function(){
								//$(this).find("span").css("background-color","#5FFFFF");
								$(this).find("span").popover('hide');
							});
						});
						
						scope.unSelectElement();
						scope.$apply();
					});
					
					
			}
		};
	});
	

	myModule.directive('bsPopoverhover', function($compile, $http, $timeout){
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				
				var sysIndex = element.attr("sysIndex");
				var elmIndex = element.attr("elmIndex");
				var systeml = scope.systemlines[sysIndex];
				var statusl = scope.systemlines[sysIndex].statuslines[elmIndex];
				
				//var editButtonTemplate = '<a class="btn btn-mini btn-inverse pull-right" data-toggle="modal" href="#editelementdialog"><i class="icon-pencil icon-white"></i></a>';
				var editButtonTemplate = '<a class="btn btn-mini btn-inverse pull-right" ng-click="callModal($event);"><i class="icon-pencil icon-white"></i></a>';
				var deleteButtonTemplate = '<a class="btn btn-mini btn-inverse pull-right"><i class="icon-trash icon-white"></i></a>'
				//var titleString = '<div><p>' + systeml.system + ' - ' + statusl.status + '</p>' + '<div class="btn-group">' + deleteButtonTemplate + editButtonTemplate + '</div></div>';
				var titleString = systeml.system + ' - ' + statusl.status + deleteButtonTemplate + editButtonTemplate;
				var contentString = statusl.comment;

				
				/*var ad = element.data('popover');
				element.popover({title: titleString, content: contentString, trigger: 'manual', placement:"bottom"}).click(function(){ console.log("sads")});	*/
				
				
				//$compile(asd.contents())(scope);
				
				
				
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
						placement:'bottom',
						html: true
					});
					
				//});
				
				
				
				element.hover(function(){
					if(scope.selectedElement.elmIndex == -1 && scope.selectedElement.sysIndex == -1) {
						element.popover('show');
					}
				},
				function() {
					if(scope.selectedElement.elmIndex == -1 && scope.selectedElement.sysIndex == -1) {
						element.popover('hide');
					}
				});	
				
			}
		};
	});
	
	
	myModule.directive('monthClick', function(){
		return {
			restrict: 'C',
			link: function(scope, element, attrs) {
				element.click(function () {
					element.addClass("selectedmonth");
				});
			}
		};
	});
	

	myModule.directive('systemTable', function($compile, Utils){
		return {
				restrict: 'E',
				//replace: true,
				//transclude: true,	
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
					

					function buildCalendar() {
						var template = 	'<table>'+
											'<thead>'+
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
															
																template += '<td clear-select>'+ 
																				//'<span class="element-inner available"'+
																				//'</span>'+	
																			'</td>';
															}else{
																var colspan = result.end - result.start + 1;
																//template += '<td colspan="'+colspan+'" ng-click="setSelectetElement(systemlines['+i+'], systemlines['+i+'].statuslines['+result.index+'])">'+
																template += '<td class="filledcell" colspan="'+colspan+'">'+
																
																				'<span ng:class="getClassForElement('+i+','+result.index+')" ng-click="selectElement($event, '+i+','+result.index+')" bs-popoverhover sysIndex="'+i+'" elmIndex="'+result.index+'"'+ 
																					  //'status="{{systemlines['+i+'].statuslines['+result.index+'].status}}"'+
																					  'bs-popover="popover.html"'+
																					  'rel="popover">'+ 
																					  //'data-content="Status: {{systemlines['+i+'].statuslines['+result.index+'].status}} </br>'+ 
																					  //'Comment: {{systemlines['+i+'].statuslines['+result.index+'].comment}}">'+ 
																					  //'data-original-title="{{systemlines['+i+'].system}}"'+
																					  //'data-placement="bottom"'+ 
																					  //'data-trigger="manual"'+ 
																					  //'system="'+i+'"'+
																					  //'emlindex="'+result.index+'"'+
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