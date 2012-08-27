function isNewElementSingleDay(){
		var result = false;
		
		if (convertDateToDatabaseFormat($scope.systemFormData.start) == convertDateToDatabaseFormat($scope.systemFormData.end)){
			result = true;
		}
		
		return result;
	}
	
	
	function addNewElement(index){
		$scope.systemlines[index].statuslines.push({
			"start": convertDateToDatabaseFormat($scope.systemFormData.start),
			"end": convertDateToDatabaseFormat($scope.systemFormData.end),
			"status": $scope.systemFormData.status,
			"comment": $scope.systemFormData.comment
		});
	}
	
	
	function clearSpaceForNewElement(elementStartDate, i, j){
	
		for (k = 0; k < (convertDateToDatabaseFormat($scope.systemFormData.end) - elementStartDate) + 1; k++) {
			$scope.systemlines[i].statuslines.splice(j, 1);
		}
		
	}
	

	function checkNewElementStartDay(element){
	
		var result = false;
		
		if (element.start == convertDateToDatabaseFormat($scope.systemFormData.start) && element.end == convertDateToDatabaseFormat($scope.systemFormData.start)){
			result = true;
		}
		
		return result;
	}
	
	
	function isNewElementOverlapping(element, i, j)
	{
		for (k = 0; k < (convertDateToDatabaseFormat($scope.systemFormData.end) - element.start) + 1; k++) {
			if ($scope.systemlines[i].statuslines[j + k].status != 'available') {
				return true; //jquery break
			}
		}
	}
	
	
	function convertDateToViewableFormat(dateString) {
		var datestring = dateString,
			y = datestring.substr(0, 4),
			m = datestring.substr(4, 2),
			d = datestring.substr(6, 2);

		var date = d + '/' + m + '/' + y;

		return date;
	}


	function convertDateToDatabaseFormat(dateString) {
		var datestring = dateString,
			d = datestring.substr(0, 2),
			m = datestring.substr(3, 2),
			y = datestring.substr(6, 4),
			date = y + m + d;

		return date;
	}
	
	
	function initPopover()
	{
		$("span[rel=popover]").popover({trigger: 'manual'}).click(function() {
			$("span[rel=popover]").popover('hide');
			$(this).popover('show', {placement: 'bottom'});
		});
      //$(".collapse").collapse();
	}
	
	
	function padZeroFront(str)
	{
		
		if(str < 10)
			str = "0" + str;
		
		return str;
		
	}
	
	function getDateString(date)
	{
		var dateString = new String(date.getFullYear());
		dateString = dateString.concat(padZeroFront(date.getMonth() + 1));
		dateString = dateString.concat(padZeroFront(date.getDate()));
		return dateString;
		
	}