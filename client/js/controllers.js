

var myModule = angular.module('systemAvailability', ['mongolab']);

function TimelineCtrl($scope, Systems) {


	$scope.systemlines = getDBdata();
	

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
		daysLabels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		monthsLabels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		daysInMonth: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
		current_date: new Date(),
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


	function getDBdata(){

		// TODO: sorting 
		
		var startDate = 20120501;
		var endDate = 20120530;

		var syslines = Systems.query(function(){
	

			$.each(syslines, function(i, v_system) {
			
				$.each(v_system.statuslines, function(j, v_status) {
				
					if(j == 0 && v_status.start > startDate){
						
						for(k = 0; k < v_status.start - startDate; k++){
							syslines[i].statuslines.unshift({"start":startDate + k, "end":startDate + k, "status":"available"});
							syslines[i].statuslines.sort(custom_sort);	
						}
						
					}else if( j > 0 && v_status.start - 1 != (v_system.statuslines[j - 1].end)){
					
						var prev_end_date = parseInt(v_system.statuslines[j - 1].end) + 1;						

						for(k = 0; k < v_status.start - prev_end_date; k++){
							syslines[i].statuslines.push({"start":prev_end_date + k, "end":prev_end_date + k, "status":"available"});
							syslines[i].statuslines.sort(custom_sort);		
						}
					}
				})

				var lastElementDate = parseInt(v_system.statuslines[v_system.statuslines.length - 1].end);
				
				if( lastElementDate < endDate){
				
					console.log("t1: " + (endDate - lastElementDate));
					
					lastElementDate += 1;
					for(k = 0; k <= endDate - lastElementDate; k++){				
							syslines[i].statuslines.push({"start":lastElementDate + k, "end":lastElementDate + k, "status":"available"});							
					}
				}
			});
		});
					
					

		
		return syslines;
	
	}
	
	

	
	
	function getSystemLines(){
		var systemLines = Systems.query();	
		
	}
	
	
	$scope.addTimeline = function() {
		$scope.statuslines.push({system:$scope.system, start:$scope.start, end:$scope.end, status:$scope.status});
	};
	
	
	$scope.removeStatusElement = function() {
	
		$.each($scope.systemlines, function(i, v_system) {	
		
			if (v_system.system == $scope.selectedStatusLine.system) {
			
				$.each(v_system.statuslines, function(j, v_status) {
					
					if(v_status.start == $scope.selectedStatusLine.start && 
						v_status.end == $scope.selectedStatusLine.end && 
							v_status.status == $scope.selectedStatusLine.status){
								
								//TODO: split line
								$scope.systemlines[i].statuslines[j].status = "available";

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
  
  
    $scope.showDetails = function(system, statusline) {
		$scope.selectedStatusLine.system = system;
		$scope.selectedStatusLine.status = statusline.status;
		$scope.selectedStatusLine.start = statusline.start;
		$scope.selectedStatusLine.end = statusline.end;
	}
  
  
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
 
}