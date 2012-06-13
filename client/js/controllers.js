function TimelineCtrl($scope) {
	$scope.timelines = [{
		system: 'P03',
		start: '20120516',
		end: '20120523',
		status: 'available'
	}, {
		system: 'P07',
		start: '20120512',
		end: '20120520',
		status: 'freeze'
	}];

	$scope.addTimeline = function() {
		$scope.timelines.push({
			system: $scope.system,
			start: $scope.start,
			end: $scope.end,
			status: $scope.status
		});
	};


}