

var myModule = angular.module('systemAvailability', ['mongolab']);


function TimelineCtrl($scope, Systems) {



	$scope.selectedStatusLine = {
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
	
    $scope.systemlines = Systems.query();
	
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
							
								console.log("t1");	
								//delete $scope.systemlines[i].statuslines[j];
								$scope.systemlines[i].statuslines.splice(j,1);
								console.log("t2");
								//return;
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