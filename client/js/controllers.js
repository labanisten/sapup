

var myModule = angular.module('systemAvailability', ['mongolab']);

function TimelineCtrl($scope, Systems) {


	$scope.systemlines = getDBdata();
	
	
	var startDate = 20120501;
	var endDate = 20120530;
		

	$scope.selectedStatusLine = {
		system:"", 
		status:"", 
		start:undefined, 
		end:undefined,
	}
	
	
	$scope.addLine = {
		system:"", 
		status:"", 
		start:undefined, 
		end:undefined,
	}

	
	$scope.calendar = {
	
		daysLabel: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		daysLabelShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
		monthLabels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
		currentDate: new Date(),
	}
	
	function getWeek(date) {
			var onejan = new Date(date.getFullYear(),0,1);
			return Math.ceil((((date - onejan) / 86400000) + onejan.getDay()+1)/7);
	} 
		
	
	$scope.currentMonthWeekList = function(){
	
		var dayArray = $scope.currentMonthDayList();
		
		var weekArray = [];
		
		var m = $scope.calendar.currentDate;
		
		$.each(dayArray, function(i, v_day){
			weekArray.push(getWeek(new Date(m.getFullYear(), m.getMonth(), i)));		
		});
		
		return weekArray;
		
	}
	
	
	$scope.currentMonthName = function(){
		return $scope.calendar.monthLabels[$scope.calendar.currentDate.getMonth()];
	}
	
	
	$scope.daysInCurrentMonth = function(){
		return $scope.calendar.daysInMonth[$scope.calendar.currentDate.getMonth()];;
	}
	
	
	$scope.currentMonthDayList = function(){
		var days = $scope.calendar.daysInMonth[$scope.calendar.currentDate.getMonth()];
		
		var dayArray = [];
		
		for(i = 1; i <= days; i++){
			dayArray.push(i);
		}
	
		return dayArray;
	}
	
	
	$scope.dayNamesInCurrentMonth = function(){
	
		var dayCount = $scope.calendar.daysInMonth[$scope.calendar.currentDate.getMonth()];
		
		var dayArray = [];
			
		var date = $scope.calendar.currentDate;
		var firstDayInMonth = new Date(date.getFullYear(), date.getMonth(), 1);

		var day_it = firstDayInMonth.getDay();		
		for(i = 0; i < dayCount; i++){
		
			dayArray.push($scope.calendar.daysLabel[day_it]);
			day_it++;
			
			if(day_it > 6){
				day_it = 0;
			}
		}
	
		return dayArray;
	}
	
	
	function custom_sort(a, b) {
		//return new Date(a.start).getTime() - new Date(b.start).getTime();
		return a.start - b.start;
	}
	
	
    function convertToDate(dateString)
	{

		var datestring = dateString;
		var y = datestring.substr(0,4);
		var m = datestring.substr(4,2);
		var d = datestring.substr(6,2);
		m = m - 1;
		date = new Date(y, m, d); 
		
		return date;
		
	}

	
	function addEmptyElementsForSystem(system, calendartable, index){
	
		calendartable.push({ "system":system, "statuslines":[] });
				
		for(k = 0; k < (endDate - startDate) + 1; k++){
			calendartable[index].statuslines.push({"start":startDate + k, "end":startDate + k, "status":"available"});						
	    }
		
		return calendartable;
	}
	
	
	function insertCalendarElement(calendartable, v_status, i, j){
	
		if(v_status.start == v_status.end){
			calendartable[i].statuslines[j].status = v_status.status;
		}
		else{
	
			$.each(calendartable[i].statuslines, function(j, c_status) {

				if(c_status.start == v_status.start){
				
					for(k = 0; k < (v_status.end - v_status.start) + 1; k++){	
						calendartable[i].statuslines.splice(j, 1);
					}

					return false; //jquery loopbreak
				}
				
			});

			calendartable[i].statuslines.push({"start":v_status.start, "end":v_status.end, "status":v_status.status});
			calendartable[i].statuslines.sort(custom_sort);
		}
		
		return calendartable;
	}
	

	function getDBdata(){


		var calendartable = [];
	
		var syslines = Systems.query(function(){
	
			$.each(syslines, function(i, v_system) {		
				calendartable = addEmptyElementsForSystem(v_system.system, calendartable, i);

				$.each(v_system.statuslines, function(j, v_status) {		
					calendartable = insertCalendarElement(calendartable, v_status, i, j);							
				});
			});
		});

		return calendartable;
	
	}
	
	
	$scope.removeStatusElement = function() {
	
		$.each($scope.systemlines, function(i, v_system) {	
		
			if (v_system.system == $scope.selectedStatusLine.system) {
			
				$.each(v_system.statuslines, function(j, v_status) {
					
					if(v_status.start == $scope.selectedStatusLine.start && 
						v_status.end == $scope.selectedStatusLine.end && 
							v_status.status == $scope.selectedStatusLine.status){
								
								//TODO: split line
								console.log("s_start: " + $scope.systemlines[i].statuslines[j].start);
								console.log("s_end: " + $scope.systemlines[i].statuslines[j].end);
								$scope.systemlines[i].statuslines.splice(j, 1);
								
								for(k = 0; k < (v_status.end - v_status.start) + 1; k++){
									$scope.systemlines[i].statuslines.push({
										"start":parseInt(v_status.start) + k, "end":parseInt(v_status.start) + k, "status":"available"
									});						
								}
		
								$scope.systemlines[i].statuslines.sort(custom_sort);
					}					
				})				
			}		
		});
	};
	
			
	$scope.addStatusElement = function() {
	
		//console.log("start: " + $scope.addLine.start);
		//console.log("end: " + $scope.addLine.end);
	
		$.each($scope.systemlines, function(i, v_system) {	
		
			if (v_system.system == $scope.addLine.system) {
			
				//console.log("t1");
				$.each(v_system.statuslines, function(j, v_status) {
					
					
					//TODO: add overlap if startdate is inside existing schedule
					if(v_status.start == $scope.addLine.start && 
						v_status.end == $scope.addLine.start){
								
								//console.log("t2");
								//$scope.systemlines[i].statuslines.splice(j,1);
								//$scope.systemlines[i].statuslines[j].start = "";							
								//$scope.systemlines[i].statuslines[j].end = "";
								
								//$scope.systemlines[i].statuslines[j].status = "available";
								
								if($scope.addLine.start == $scope.addLine.end){
									$scope.systemlines[i].statuslines[j].status = $scope.addLine.status;
								}
								else{
								
									//$scope.systemlines[i].statuslines.splice(j,1);
									//console.log("tstart: " + $scope.addLine.start);
									//console.log("tend: " + $scope.addLine.end);
									//console.log("addl len: " + ($scope.addLine.end - v_status.start));
									
									for(k = 0; k < ($scope.addLine.end - v_status.start) + 1; k++){	
										if($scope.systemlines[i].statuslines[j + k].status != 'available'){
											alert("Overlap!!");
											return false; //jquery break
										}
									}
									

									for(k = 0; k < ($scope.addLine.end - v_status.start) + 1; k++){	
										//console.log("start: " + $scope.systemlines[i].statuslines[j].start);
										//console.log("end: " + $scope.systemlines[i].statuslines[j].end);
										//console.log("j: " + j + " k: " + k);
										$scope.systemlines[i].statuslines.splice(j, 1);
									}
									
									//syslines[i].statuslines.push({"start":prev_end_date + k, "end":prev_end_date + k, "status":"available"});
									//syslines[i].statuslines.sort(custom_sort);		
								
									$scope.systemlines[i].statuslines.push({"start":$scope.addLine.start, "end":$scope.addLine.end, "status":$scope.addLine.status});
									$scope.systemlines[i].statuslines.sort(custom_sort);
									return false; //jquery break
								}
								
								/*
								//console.log("pr.status: " + $scope.systemlines[i].statuslines[j - 1].status);
								if (j > 0 && $scope.systemlines[i].statuslines[j - 1].status == "available")
								{
									//console.log("v_status.start: " + v_status.end);
									//console.log("$scope.systemlines[i].statuslines[j - 1].end: " + $scope.systemlines[i].statuslines[j - 1].end);
									$scope.systemlines[i].statuslines[j - 1].end = (v_status.end);
								}*/
					}					
				})				
			}		
		});
	};
  
 /* 
	function getSystemLines(){
		var systemLines = Systems.query();	
		
	}
	
	
	$scope.addTimeline = function() {
		$scope.statuslines.push({system:$scope.system, start:$scope.start, end:$scope.end, status:$scope.status});
	};
	*/
  
    $scope.showDetails = function(system, statusline) {
		$scope.selectedStatusLine.system = system;
		$scope.selectedStatusLine.status = statusline.status;
		$scope.selectedStatusLine.start = statusline.start;
		$scope.selectedStatusLine.end = statusline.end;
	}
  
  /*
	$scope.getSystemLines = function() {
	
		var list = $scope.systemlines;

						list.push({system:'P88', statuslines:[
									{start:'20120501', end:'20120505', status:'freeze'},
									{start:'20120526', end:'20120530', status:'freeze'}
								   ]
						  });
						  
		$.each(
			list, 
			function(item, val){
				console.log(item + ' ' + val.system + ' ' + val.statuslines[0].start);

			}
		);	

		console.log(list.length);
		return list;

	};
 */
}