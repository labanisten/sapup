var directiveModule = angular.module('directiveModule', ['utilsModule']);

//TODO: Kan me fjerna denna?
function build(scope) {
	console.log("build!; " + scope.systemlines.length);
}

directiveModule.directive('toolbar', function($compile, Utils){
	return {
			restrict: 'A',
			link: function(scope, element, attrs) {

				scope.$watch('systemnames', function() {
					buildTemplate();
				});

				function updateTagStorage(tags) {
					var i;
					for(i = 0; i < tags.length; i++) {
						var match = Utils.existInTagArray(tags[i], scope.filterTags);
						if(match.result === false) {
							var elm = {
								text: tags[i],
								isActive: false
							}
							scope.filterTags.push(elm);
						}
					}
				}

				function buildTemplate() {
					var template;

					var i;
					for(i = 0; i < scope.systemnames.length; i++) {
						if(scope.systemnames[i].tags !== undefined) {
							var tags = scope.systemnames[i].tags.split(';');
							updateTagStorage(tags);
						}
					}

					template = '<div ng:class="getClassForToolbar()">'+
									'<div class="span12">'+
										'<div class="span1" ng-repeat="tag in filterTags">'+
											'<span ng:class="getClassForTagBadge(tag)" ng:click="tagBadgeClick(tag)">{{tag.text}}</span>'+
										'</div>'+
									'</div>'+
								'</div>';

					element.html(template);				
					$compile(element.contents())(scope);

				}
		    }
	};
});

directiveModule.directive('messageViewCompact', function($compile, Utils){
	return {
			restrict: 'A',
			link: function(scope, element, attrs) {

				scope.$watch('alertlines', function() {
					buildCompactMessageContainer();
				});

				function buildCompactMessageContainer() {
					var template;
					template = '<div class="row-fluid">'+			
									'<div ng-repeat="alertline in alertlines">'+
										'<div class="alert alert-{{alertline.alerttype}}">'+
											'<h5>{{alertline.title}}</h5>'+
											'<p>{{alertline.comment}}</p>'+
										'</div>'+
									'</div>'+
							   '</div>';

					element.html(template);				
					$compile(element.contents())(scope);

				}
		    }
	};
});



directiveModule.directive('monthSelectionbarCompact', function($compile, Utils){
	return {
			restrict: 'A',
			link: function(scope, element, attrs) {

				scope.$watch('selectedMonthCompact', function() {
						buildCompactMonthHeader();
				});

				function buildCompactMonthHeader() {
					var template;

					template = '<div ng:class="getClassForCompactMonthBar()" colspan="{{noOfDaysInMonth[' + scope.selectedMonth + '] + 1}}">'+
									'<div class="btn-group-wrap">'+
										'<div class="btn-group">'+
											'<button ng:class="getClassForCompactMonthElement(month)" ng-click="gotoMonthCompact($event, month)" ng-repeat="month in monthListCompact">'+
												'{{months[month]}}' +
											'</button>'+
										'</div>'+
									'</div>'+
								'</div>';

					element.html(template);				
					$compile(element.contents())(scope);
				}
		    }
	};
});


directiveModule.directive('systemgroupsViewCompact', function($compile, Utils){
	return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var template = '';

				var dataStatus = {
					systemlines: false,
					systemnames: false,
					systemgroups: false
				}

				function dataIsReady() {
					var result = false;
					if(dataStatus.systemgroups == true) {
						result = true;
					}
					return result;
				}

				//TODO: no need for dataready func. if only one datagroup
				scope.$watch('systemgroups', function() {
					dataStatus.systemgroups = true;
					if(dataIsReady) {
						buildList();
					}
				});
				

				function buildList() {
					template = '<ul class="nav elementlist-compact listelement-button nav-list">';

					var i;
					for(i = 0; i < scope.systemgroups.length; i++){
						template += '<li><a ng:click="compactSystemGroupElementClick('+i+')">'+
								    '<i class="icon-chevron-right"></i><h4>{{systemgroups['+i+'].name}}</h4>';
						template += '</a></li>';
					}

					template += '</ul>';

					element.html(template);
					$compile(element.contents())(scope);
					dataStatus.systemgroups = false;
				}
			}
	};
});


directiveModule.directive('systemViewCompact', function($compile, Utils){
	return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var template;

					template = '<ul class="nav elementlist-compact listelement-button nav-list">'+
							   	  '<li ng:repeat="line in systemgroupCompactViewList">'+
							   	  	 '<a ng:click="compactSystemElementClick(line.systemnamesIndex)">'+
							   	  	 	'<i class="icon-chevron-right"></i>'+ 
							   	  	 	'<div>'+
							   	  	 		'<h4>{{line.name}} - {{line.text}}</h4>'+
							   	  	 		'<div ng:class="getClassForActiveSystemIndicator(line)"><i class="icon-exclamation-sign"></i></div>'
							   	  	 	'</div>'+
							   	  	 '</a>'+
							   	  '</li>'+
							   '</ul>';

					element.html(template);
					$compile(element.contents())(scope);
				}	
	};
});


directiveModule.directive('statusViewCompact', function($compile, Utils){
	return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var template;

					var systemIndex = scope.selectedCompactSystem.sysIndex;				
					template = '<ul class="nav elementlist-compact listelement-datacontainer nav-list">';
					
					template += '<li ng:repeat="line in systemCompactViewList">'+
									'<a ng:class="getClassForStatusCompactViewElement(line)">'+
										
										'<div>'+
											'<h5 class="statusheader-compact">{{line.startText}} - {{line.endText}}</h5>'+
											'<div ng:class="getClassForActiveStatusIndicator(line)"><i class="icon-exclamation-sign"></i></div>'+
										'</div>'+
										
										'<p class="statustext-compact">Status: {{line.status}}</p>' +
										'<p class="statuscomment-compact">{{line.comment}}</p>' +
										'<h4 class="statuserror-compact">{{line.error}}</h4>' +
									'</a>'+
								'</li>';

					template += '</ul>';
					
					element.html(template);
					$compile(element.contents())(scope);
			}
	};
});


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
				deleteButtonTemplate = '<a style="padding-left:8px" class="pull-right" ng-click="removeStatusElement();" clear-popovers-and-selections><i class="icon-trash"></i> </a>' ,
				closeButtonTemplate = '<a style="padding-left:8px" class="pull-right" clear-popovers-and-selections><i class="icon-remove"></i></a>',
				titleString = systeml.system + ' - ' + statusl.status + closeButtonTemplate + deleteButtonTemplate + editButtonTemplate,
				contentString = statusl.comment;
				
			var testcontent = '<div>' +
								  '<p>{{hoverElement.start}} - {{hoverElement.end}}</p>' +
								  '</br>' +
								  '<p>{{hoverElement.comment}}</p>' +
							  '</div>';
				
			var data = titleString;

			function getPopoverPlacement(elm) {
		        var offset = $(elm).offset();
		        //height = $(document).outerHeight();
		        height = $(document).height();
		        //width = $(document).outerWidth();
		        width = $(document).width();
		        vert = 0.5 * height - offset.top;
		        vertPlacement = vert > 0 ? 'bottom' : 'top';
		        horiz = 0.5 * width - offset.left;
		        horizPlacement = horiz > 0 ? 'right' : 'left';
		        placement = Math.abs(horiz) > Math.abs(vert) ?  horizPlacement : vertPlacement;
		        return placement;
		    }
			
			

			element.popover({



				title: function() {
					$timeout(function() {
						$compile(element.data('popover').tip())(scope);
					});
					return data;
				},
				trigger: 'manual',
				placement: getPopoverPlacement(element),
				content: testcontent,
				html: true
			});
				
			
			element.click(function() {
				//var pl = place(element);

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


directiveModule.directive('CompressedListElementView', function($compile, Utils){
	return {
			restrict: 'A',
			link: function(scope, element, attrs) {

			}
	};
});

/*
directiveModule.directive('fixedMonthHeader', function($compile, Utils){
	return {
			restrict: 'A',
			link: function(scope, element, attrs) {

				var template = 	'<table ng:class="getClassFixedMonthHeader()">' +

									'<thead>'+


											'<tr class="daynames">'+
												'<th rowspan="3" style="width:{{systemTableStartColumnSize}}px"></th>'+
												'<th ng-repeat="dayName in dayNamesInMonth('+scope.selectedMonth+')">{{dayName}}</th>'+
											'</tr>'+
											
											'<tr class="shortdaynames">'+
												'<th rowspan="3" style="width:{{systemTableStartColumnSize}}px"></th>'+
												'<th class="fixedheader" ng-repeat="shortDayName in shortDayNamesInMonth('+scope.selectedMonth+')">{{shortDayName}}</th>'+
											'</tr>'+
											
											'<tr>'+
												'<th ng:class="getClassForDayColumn(day)" ng-repeat="day in monthDayList['+scope.selectedMonth+']">{{day}}</th>'+
											'</tr>'+
											


									'</thead>'+

								'</table>';

					element.html(template);
					$compile(element.contents())(scope);

		   }		
	};
});
*/

directiveModule.directive('systemTable', function($compile, Utils){
	return {
			restrict: 'A',
			link: function(scope, element, attrs) {
			
				//TODO: Utils?
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

				function buildTemplateForExistingSystem(systemIndex) {
					
					var template = "",
						day;

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
				
				
				function buildTemplateForNoneExistingSystem(system) {
					var bagdeText;
					
					if(system.text) {
						badgeText = system.name + ' ' + system.text;
					}else {
						badgeText = system.name;
					}
					
					var day,
						template = "";
					for(day = 0; day < scope.noOfDaysInMonth[scope.selectedMonth]; day++){
						template += '<td clear-popovers-and-selections></td>';
					}
						
					template += '</tr>';
					return template;
				}
				

				function buildCalendar() {
					var template = 	'<table class="system-table" id="maintable">' +
										'<thead>'+
										
											'<tr>'+
												'<th class="year" colspan="{{noOfDaysInMonth[' + scope.selectedMonth + '] + 1}}">'+
													'<i class="yeararrow" ng-click="gotoPreviousYear()" clear-popovers-and-selections><</i>'+
													'<span class="yeartext">{{selectedYear}}</span>'+
													'<i class="yeararrow"  ng-click="gotoNextYear()" clear-popovers-and-selections>></i>'+
												'</th>'+
											'</tr>'+
											
											'<tr>'+
												'<th class="months" colspan="{{noOfDaysInMonth[' + scope.selectedMonth + '] + 1}}">'+

														'<div class="row-fluid">'+

														'<div class="span1 montharrowcell">'+
																'<i class="montharrow" ng-click="gotoPreviousMonth()" clear-popovers-and-selections><</i>'+
														'</div>'+

														'<div class="span10 row-fluid">'+

															'<div ng:class="getClassForMonth(month)" ng-click="gotoMonth($event, month)" ng-repeat="month in [0,1,2,3,4,5,6,7,8,9,10,11]">'+
																'{{months[month]}}' +
															'</div>'+

														'</div>'+

														'<div class="span1 montharrowcell">'+
																'<i class="montharrow"  ng-click="gotoNextMonth()" clear-popovers-and-selections>></i>'+
														'</div>'+

														'</div>'+

												'</th>'+
											'</tr>'+

											'<tr>'+
												'<th id="tablespacer" rowspan="4" ng:class="getClassForSystemTableSpacer()"></th>'+
												'<th class="week" ng-repeat="week in monthWeekList['+scope.selectedMonth+']" colspan="{{week.colSpan}}">{{week.week}}</th>'+
											'</tr>'+
											
											'<tr class="daynames">'+
												'<th ng-repeat="dayName in dayNamesInMonth('+scope.selectedMonth+')">{{dayName}}</th>'+
											'</tr>'+
											
											'<tr class="shortdaynames">'+
												'<th ng-repeat="shortDayName in shortDayNamesInMonth('+scope.selectedMonth+')">{{shortDayName}}</th>'+
											'</tr>'+
											
											'<tr>'+
												'<th ng:class="getClassForDayColumn(day)" ng-repeat="day in monthDayList['+scope.selectedMonth+']">{{day}}</th>'+
											'</tr>'+
											
										'</thead>'+
										'<tbody>';
											var i, j;
											for (j = 0; j < scope.systemgroups.length; j++){
												template += '<tr ng:class="getClassForTableRowSystemGroup()"><td class="systemgroup"><span>{{systemgroups['+j+'].text}}</span></td><td colspan="{{noOfDaysInMonth[selectedMonth]}}"></td>';
												for (i = 0; i < scope.systemnames.length; i++){
													if (scope.systemnames[i].systemgroup == scope.systemgroups[j].name) {
														template += '<tr class="systemrow" ng:class="getClassForSystemTableRow('+i+')"><td class="system"><span>{{systemnames['+i+'].name}} {{systemnames['+i+'].text}}</span></td>';
														var systemMatch = Utils.findSystem(scope.systemlines, scope.systemnames[i].name);
														if (systemMatch.result) {
															template += buildTemplateForExistingSystem(systemMatch.index);
														} else {
															template += buildTemplateForNoneExistingSystem(scope.systemnames[i]);
														};
													};
												};
											};
											
							template += '</tbody>'+
									'</table>';
								  
					

					element.html(template);
					$compile(element.contents())(scope);
					
					//var wid = $('.systemtablespacer');
					//console.log("w: " + $('.systemtablespacer').css('width'));
					
					//scope.systemTableStartColumnSize = 200;
				}


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
				
				//TODO: change to method in compactlayout
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

				scope.$watch('systemgroups', function() {

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
				minDate: new Date(2011, 10 - 1, 25),
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
						
						$("#expireMessage").text("Message will expire in " + daysLeft + " " + dayText);
					}
					scope.$apply();
				}
			});
		}
	};
});	


directiveModule.directive('jqDatepickerEnd', function (Utils) {
	return {
		link: function postLink(scope, element, attrs) {
			element.datepicker({
				dateFormat: "dd.mm.yy",
				minDate: scope.addFormData.start,
				onClose: function (dateText, inst) {
					if(element.context.id == "updateFormEndDate"){
						scope.updateFormData.end = dateText;
					}else if(element.context.id == "newFormEndDate"){
						scope.addFormData.end = dateText;
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
	};
});
	
