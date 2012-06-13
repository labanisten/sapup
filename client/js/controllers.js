function TimelineCtrl($scope) {
  $scope.statuslines = [
    {system:'P03', start:'20120516', end:'20120523', status:'available'}, 
    {system:'P10', start:'20120512', end:'20120520', status:'freeze', colsp:'20'},
    {system:'P10', start:'20120512', end:'20120520', status:'freeze'},
	{system:'P11', start:'20120512', end:'20120520', status:'freeze'},
	{system:'P11', start:'20120512', end:'20120520', status:'freeze'}];
 
  $scope.addTimeline = function() {
    $scope.statuslines.push({system:$scope.system, start:$scope.start, end:$scope.end, status:$scope.status});
  };
  
  $scope.getStatusLines = function() {
	//var list = [];	
	//list.push({'system':'P20', 'status':'available'});
	//$scope.statuslines = $.merge($scope.statuslines, list);
	//$scope.statuslines.push({system:'P30', start:'20120512', end:'20120520', status:'freeze'});
	//$scope.statuslines = $.unique($scope.statuslines);

	return $scope.statuslines;

  };
 
}