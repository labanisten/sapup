function TimelineCtrl($scope) {

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
	
    $scope.systemlines = [
		{system:'P03', statuslines:[
									{start:'20120501', end:'20120502', status:'freeze'},
									{start:'20120503', end:'20120510', status:'available'},
									{start:'20120511', end:'20120520', status:'freeze'},
									{start:'20120521', end:'20120530', status:'available'},
								   ]
		},
		
		{system:'P10', statuslines:[
									{start:'20120501', end:'20120525', status:'available'},
									{start:'20120526', end:'20120530', status:'freeze'}
								   ]
		},
		
		{system:'P11', statuslines:[
									{start:'20120501', end:'20120510', status:'freeze'},
									{start:'20120511', end:'20120525', status:'available'},
									{start:'20120526', end:'20120530', status:'freeze'}
								   ]
		}
	];
	
 
	$scope.addTimeline = function() {
		$scope.statuslines.push({system:$scope.system, start:$scope.start, end:$scope.end, status:$scope.status});
	};
  
    $scope.showDetails = function(statusline) {
		$scope.selectedStatusLine.system = statusline.system;
		$scope.selectedStatusLine.status = statusline.status;
		$scope.selectedStatusLine.start = statusline.start;
		$scope.selectedStatusLine.end = statusline.end;
	}
  
	$scope.getStatusLines = function() {
	var list = $scope.systemlines;

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