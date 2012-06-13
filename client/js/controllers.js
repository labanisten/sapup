function TimelineCtrl($scope) {
/*
  $scope.statuslines = [
    //{system:'P03', start:'20120516', end:'20120523', status:'available'}, 
    {system:'P10', start:'20120503', end:'20120510', status:'freeze', colsp:'20'},
    {system:'P10', start:'20120512', end:'20120520', status:'freeze'},
	{system:'P11', start:'20120510', end:'20120512', status:'freeze'},
	{system:'P11', start:'20120515', end:'20120530', status:'freeze'}];
*/	

	//$scope.statusdetail = [{system:'D10', start:'20120503', end:'20120510', status:'freeze'}];
	
	$scope.detail_system;
	$scope.detail_status;
	$scope.detail_start;
	$scope.detail_end;
	
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
		$scope.detail_status = statusline.status;
		$scope.detail_start = statusline.start;
		$scope.detail_end = statusline.end;
	}
  
  $scope.getStatusLines = function() {
	//var list = [];
	//list.push({'system':'P20', 'status':'available'});
	//$scope.statuslines = $.merge($scope.statuslines, list);
	
	//var unique_values = {};
	//var list_of_values = [];
	
    //var list = $scope.statuslines.concat({system:'P30', start:'20120512', end:'20120520', status:'freeze'});
	//var list = $.merge($scope.statuslines, {'system':'P30', 'start':'20120512', 'end':'20120520', 'status':'freeze'});
	
	//list = $.unique(list);
	/*
	$.each(
		list, 
		function(item){

		}
	);
	*/
	
	var list = $scope.systemlines;
	//list = list.concat({system:'P30', start:'20120512', end:'20120520', status:'freeze'});
	//list = $.unique(list);
	
    $.each(
		list, 
		function(item, val){
			console.log(item + ' ' + val.system + ' ' + val.statuslines[0].start);
		}
	);
	
	console.log(list.length);
	
	

	//list = $.merge(list, {'system':'P30', 'start':'20120512', 'end':'20120520', 'status':'freeze'});
	
	return list;
	
  };
 
}