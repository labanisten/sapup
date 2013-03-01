var directiveModule = angular.module('directiveModule', ['utilsModule']);


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

					scope.filterTags.sort(function(a,b){return (a.text < b.text) ? -1 : 1;});

					/*template = '<div class="accordion span12" id="accordionContainer2">'+
								'<div class="alert-accordion-group">'+
								'<div  class="accordion-toggle alert-container-header alert-accordion-heading" data-toggle="collapse" data-parent="#accordionContainer2" href="#collapseTwo">Filters</div>'+
								'<div id="collapseTwo" class="accordion-body collapse">'+
									'<div class="accordion-inner">';
					*/
						template = '<ul class="tags">'+
										// '<li style="margin-right:5px;width:45px"><sup>Systemlines</sup></li>' + 
										'<li ng-repeat="grouptag in systemgroups" class="calendar-filtertag" ng:click="groupBadgeClick(grouptag.name)"> <a ng:class="getClassForGroupTagBadgeInner(grouptag.name)" href="#">{{grouptag.name}}</a></li>'+
									'</ul>';

						template += '<ul class="tags">'+
										// '<li style="margin-right:5px;width:45px"><sup>Systemtypes</sup></li>' + 
										'<li ng-repeat="tag in filterTags" class="calendar-filtertag" ng:click="tagBadgeClick(tag.text)"> <a ng:class="getClassForTagBadgeInner(tag.text)" href="#">{{tag.text}}</a></li>'+
									'</ul>';


					//template += '</div></div></div></div></div>';

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

				scope.$watch('systemgroups', function() {
					buildList();
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
							   	  	 		//TODO: exclamation mark for current day not correctly aligned
							   	  	 		//'<div ng:class="getClassForActiveSystemIndicator(line)"><i class="icon-exclamation-sign"></i></div>'
							   	  	 		'<div ng:class="getClassForActiveSystemIndicator(line)"></div>'
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
											//TODO: exclamation mark for current day not correctly aligned
											//'<div ng:class="getClassForActiveStatusIndicator(line)"><i class="icon-exclamation-sign"></i></div>'+
											'<div ng:class="getClassForActiveStatusIndicator(line)"></div>'+
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
				editButtonTemplate = '<a ng-show="userdata.isAdmin" class="pull-right" ng-click="callModal($event);"><i class="icon-pencil"></i></a>',
				deleteButtonTemplate = '<a ng-show="userdata.isAdmin" style="padding-left:8px" class="pull-right" ng-click="removeStatusElement();" clear-popovers-and-selections><i class="icon-trash"></i> </a>' ,
				closeButtonTemplate = '<a style="padding-left:8px" class="pull-right" clear-popovers-and-selections><i class="icon-remove"></i></a>',
				titleString = systeml.system + ' - ' + statusl.status + closeButtonTemplate + deleteButtonTemplate + editButtonTemplate,
				contentString = statusl.comment;
				
			//ng-show="hoverElement.hasValue"
			//var testcontent = '<div class="popovertext hidden">' +
			var testcontent = '<div class="popovertext">' +
								  '<h5 ng-show="hoverElement.hasValue">{{hoverElement.start}} - {{hoverElement.end}}</h5>' +
								  //'</br>' +
								  '<p ng-show="hoverElement.hasValue">{{hoverElement.comment}}</p>' +
							  '</div>';
				
			var data = titleString;

			function getPopoverPlacement(elm) {
				var placement = 'top';
		        var offset = $(elm).offset();
		        //var elmWidth = $(elm).outerWidth()
		        //height = $(document).outerHeight();
		        //var height = $(document).height();
		        //width = $(document).outerWidth();
		        var width = $(document).width();

		        var diff = width - offset.left;

		        if(diff < 250) {
		        	placement = 'left';
		        }
		        /*
		        vert = 0.5 * height - offset.top;
		        vertPlacement = vert > 0 ? 'bottom' : 'top';
		        horiz = 0.5 * width - offset.left;
		        horizPlacement = horiz > 0 ? 'right' : 'left';
		        placement = Math.abs(horiz) > Math.abs(vert) ?  horizPlacement : vertPlacement;*/
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
				//placement: 'top',//getPopoverPlacement(element),
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
					//$('.popovertext').removeClass('hidden');
				}
			},
			function() {
				if(scope.selectedElement.elmIndex == -1 && scope.selectedElement.sysIndex == -1) {
					scope.clearHoverElement();
					element.popover('hide');
					//$('.popovertext').addClass('hidden');
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


directiveModule.directive('systemTable', function($compile, Utils){
	return {
			restrict: 'A',
			link: function(scope, element, attrs) {
			
				//TODO: move to Utils?
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

				/*
				var buildEmptyTableCell = function(day) {
					var template = '';

					var testDate = new Date(scope.selectedYear, scope.selectedMonth, day + 1);
					if(Utils.dateIsWeekend(testDate))
						template += '<td class="weekend" clear-popovers-and-selections></td>';
					else {
						template += '<td clear-popovers-and-selections></td>';
					}
					delete testDate;

					return template;
				}

				var buildEmptyTableGroupCell = function(day) {
					var template = '';

					var testDate = new Date(scope.selectedYear, scope.selectedMonth, day + 1);
					if(Utils.dateIsWeekend(testDate))
						template += '<td class="weekend" clear-popovers-and-selections></td>';
					else {
						template += '<td class="systemrowgroupcell" clear-popovers-and-selections></td>';
					}
					delete testDate;

					return template;
				}*/


				var buildEmptyTableCell = function(day) {
					var template = '';

					var testDate = new Date(scope.selectedYear, scope.selectedMonth, day + 1);
					if(Utils.dateIsWeekend(testDate))
						template += '<td class="weekend"></td>';
					else {
						template += '<td></td>';
					}
					delete testDate;

					return template;
				}

				var buildEmptyTableGroupCell = function(day) {
					var template = '';

					var testDate = new Date(scope.selectedYear, scope.selectedMonth, day + 1);
					if(Utils.dateIsWeekend(testDate))
						template += '<td class="weekend"></td>';
					else {
						template += '<td class="systemrowgroupcell"></td>';
					}
					delete testDate;

					return template;
				}


				function buildTemplateForExistingSystem(systemIndex) {
					
					var template = "",
						day;

					for(day = 0; day < scope.noOfDaysInMonth[scope.selectedMonth]; day++){

						var element = findMatchingElement(day, jQuery.extend(true, {}, scope.systemlines[systemIndex]));
						
						if(element == "") {
							template += buildEmptyTableCell(day);
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
												  'ng-click="selectElement($event,'+systemIndex+','+element.index+')"'+
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
				
				
				function buildTemplateForNoneExistingSystem(cellfunc) {
					var day,
						template = "";

					for(day = 0; day < scope.noOfDaysInMonth[scope.selectedMonth]; day++){
						template += cellfunc(day);
					}
						
					template += '</tr>';
					return template;
				}
				

				function buildCalendar() {
					var months = [0,1,2,3,4,5,6,7,8,9,10,11],
						colSpan = 0,
						template = 	'<table class="system-table" id="maintable">' +
										'<thead>'+
											'<tr>';
												colSpan = scope.noOfDaysInMonth[scope.selectedMonth] + 1;
					template +=					'<th class="year" colspan="' + colSpan + '">'+
													'<i class="yeararrow" ng-click="gotoPreviousYear()" clear-popovers-and-selections><</i>'+
													'<span class="yeartext">' + scope.selectedYear + '</span>'+
													'<i class="yeararrow"  ng-click="gotoNextYear()" clear-popovers-and-selections>></i>'+
												'</th>'+
											'</tr>'+
											'<tr>'+
												'<th class="months" colspan="' + colSpan + '">'+

														'<div class="row-fluid">'+

														'<div class="span1 montharrowcell">'+
																'<i class="montharrow" ng-click="gotoPreviousMonth()" clear-popovers-and-selections><</i>'+
														'</div>'+
														'<div class="span10 row-fluid">';
														/*'<div class="slides">';*/
														for (var i = 0; i < months.length; i++) {
					template += 							'<div ng:class="getClassForMonth(' + i + ')" ng-click="gotoMonth($event,' + i + ')">'+
																scope.months[i] +
															'</div>';
														};
														
					template += 						'</div>'+

														'<div class="span1 montharrowcell">'+
																'<i class="montharrow"  ng-click="gotoNextMonth()" clear-popovers-and-selections>></i>'+
														'</div>'+
														'</div>'+
												'</th>'+
											'</tr>'+
											'<tr>'+
												'<th id="tablespacer" rowspan="4" ng:class="getClassForSystemTableSpacer()"></th>';
												for (i=0; i < scope.monthWeekList[scope.selectedMonth].length; i++) {
					template +=						'<th colspan="' + scope.monthWeekList[scope.selectedMonth][i].colSpan + '">' + scope.monthWeekList[scope.selectedMonth][i].week + '</th>';
												};
					template +=				'</tr>' +
											'<tr class="daynames">';
											for (i=0; i<scope.dayNamesInMonth(scope.selectedMonth).length; i++ ) {
					template +=					'<th ng:class="getClassForDayNameHeaderCell(' + i + ')">' + scope.dayNamesInMonth(scope.selectedMonth)[i] + '</th>';
											}
					template +=   			'</tr>'+
											'<tr class="shortdaynames">';
											for (i=0; i<scope.shortDayNamesInMonth(scope.selectedMonth).length; i++ ) {
					template +=					'<th ng:class="getClassForDayNameHeaderCell(' + i + ')">' + scope.shortDayNamesInMonth(scope.selectedMonth)[i] + '</th>';
											};
					template +=				'</tr>'+
											'<tr>';
											for (i=0; i<scope.monthDayList[scope.selectedMonth].length; i++) {
					template +=					'<th ng:class="getClassForDayHeaderCell(' + i + ')">' + scope.monthDayList[scope.selectedMonth][i] + '</th>';
											};
					template +=				'</tr>'+
										'</thead>'+
										'<tbody>';
											var i, j;
											for (j = 0; j < scope.systemgroups.length; j++){

												template += '<tr ng:class="getClassForTableRowSystemGroup()">'+
																'<td class="systemrowgroupheading"><span>' + scope.systemgroups[j].text + ' </span></td>';
																template += buildTemplateForNoneExistingSystem(buildEmptyTableGroupCell);
																//'<td colspan="' + scope.noOfDaysInMonth[scope.selectedMonth] + '"></td>' +
															//'</tr>';

												for (i = 0; i < scope.systemnames.length; i++){
													if (scope.systemnames[i].systemgroup == scope.systemgroups[j].name) {
														template += '<tr ng:class="getClassForSystemTableRow('+i+')">' +
																		'<td class="systemrowheading"><span>' + scope.systemnames[i].name + ' ' + scope.systemnames[i].text + '</span></td>';
														var systemMatch = Utils.findSystem(scope.systemlines, scope.systemnames[i].name);
														if (systemMatch.result) {
															template += buildTemplateForExistingSystem(systemMatch.index);
														} else {
															//template += buildTemplateForNoneExistingSystem();
															template += buildTemplateForNoneExistingSystem(buildEmptyTableCell);
														};
													};
												};
											};
											
					template += 		'</tbody>'+
									'</table>';

					element.html(template);
					$compile(element.contents())(scope);
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


directiveModule.directive('alerDatePicker', function (Utils) {
	return {
		link: function postLink(scope, element, attrs) {

			element.datepicker({
				dateFormat: "dd.mm.yy",
				minDate: (new Date()),
				onClose: function (dateText, inst) {
					scope.addAlertLine.expdate = dateText;
					var dbdate = Utils.viewDateToDBDate(dateText);
					var currentDate = Utils.getDateString(new Date());
					var daysLeft = dbdate - currentDate;
					var dayText = "in " + daysLeft + " " + "days";
					$("#expireMessage").text("Message will expire " + dayText);
					scope.$apply();
				}
			});
		}
	};
});

		
directiveModule.directive('startDatePicker', function (Utils) {
	return {
		link: function postLink(scope, element, attrs) {

			function processMaxDate() {
				var result;
				if(element.context.id == "updateFormStartDate"){
					if(scope.updateFormData.end !== undefined){
						result = {maxDate:  Utils.viewDateToDateObject(scope.updateFormData.end)};
					}
				}else if(element.context.id == "newFormStartDate") {
					if(scope.addFormData.end !== undefined){
						result = {maxDate: Utils.viewDateToDateObject(scope.addFormData.end)};
					}
				}
				return result;
			}

			element.datepicker({
				dateFormat: "dd.mm.yy",
				beforeShow: processMaxDate,
				onClose: function (dateText, inst) {
					if(element.context.id == "updateFormStartDate"){
						scope.updateFormData.start = dateText;
					}else if(element.context.id == "newFormStartDate"){
						scope.addFormData.start = dateText;
					}
					scope.$apply();
				}	
			});
		}
	};
});	

directiveModule.directive('endDatePicker', function (Utils) {
	return {
		link: function postLink(scope, element, attrs) {

			function processMinDate() {
				var result;
				if(element.context.id == "updateFormEndDate"){
					if(scope.updateFormData.start !== undefined){
						result = {minDate:  Utils.viewDateToDateObject(scope.updateFormData.start)};
					}
				}else if(element.context.id == "newFormEndDate") {
					if(scope.addFormData.start !== undefined){
						result = {minDate: Utils.viewDateToDateObject(scope.addFormData.start)};
					}
				}
				return result;
			}

			element.datepicker({
				dateFormat: "dd.mm.yy",
				beforeShow: processMinDate,
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