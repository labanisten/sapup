
angular.module('utilsModule', []).
	factory('Utils', function() {	
	
	var utils = utils || {};

	(function(ns) {
	
	 ns.convertToDate = function(dateString) {
		var datestring = dateString,
			y = datestring.substr(0, 4),
			m = datestring.substr(4, 2),
			d = datestring.substr(6, 2);

		m = m - 1;
		date = new Date(y, m, d);

		return date;
	};
	
	
	ns.dbDateToViewDate = function(dateString) {
		var datestring = dateString,
			y = datestring.substr(0, 4),
			m = datestring.substr(4, 2),
			d = datestring.substr(6, 2);

		var date = d + '.' + m + '.' + y;

		return date;
	};
	
	
	ns.clearModalLog = function()
	{
		$("#elementModalLog ul").empty();	
	};
	
	ns.addLineToElementModalLog = function(text)
	{
		$("#elementModalLog ul").append("<li>"+text+".</li>");	
	};
	
	
	ns.dateObjectToViewDate = function(date)
	{
		var y = new String(date.getFullYear());
		m = padZeroFront(date.getMonth() + 1);
		d = padZeroFront(date.getDate());
		
		var date = d + '.' + m + '.' + y;
		
		return date;
		
	};


	ns.viewDateToDBDate = function(dateString) {
		var datestring = dateString,
			d = datestring.substr(0, 2),
			m = datestring.substr(3, 2),
			y = datestring.substr(6, 4),
			date = y + m + d;

		return date;
	};
	
	ns.viewDateToDateObject = function(dateString)
	{
		var datestring = dateString,
		d = datestring.substr(0, 2),
		m = datestring.substr(3, 2),
		y = datestring.substr(6, 4);
		
		return new Date(y, m - 1, d);
	};
	
	
	ns.padZeroFront = function(str)
	{
		
		if(str < 10)
			str = "0" + str;
		
		return str;
		
	};
	
	
	ns.getDateString = function(date)
	{
		var dateString = new String(date.getFullYear());
		dateString = dateString.concat(ns.padZeroFront(date.getMonth() + 1));
		dateString = dateString.concat(ns.padZeroFront(date.getDate()));
		return dateString;
		
	};
	
	
	ns.dateFromString = function(dateString) {
		return new Date( dateString.substr(0, 4), dateString.substr(4, 2) - 1, dateString.substr(6,2) );
	};

	
	ns.sameDay = function(date1, date2) {
		return date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate();
	};
	
	
	ns.resetDateTime = function (date)
	{
		
		date.setHours(0);
		date.setMilliseconds(0);
		date.setMinutes(0);
		date.setSeconds(0);
		
		return date;
		
	};
	
	
	ns.resetNewAlertForm = function() {
	
		var validator = $("#alertForm").validate();
        validator.resetForm();
	   
		//$('#alertForm').submit = {};
		//$('#alertForm')[0].reset();
		
		$("#alertTitle").parent('.control-group').removeClass('error');
		$("#alertType").parent('.control-group').removeClass('error');
		$("#alertDialogExpDate").parent('.control-group').removeClass('error');
		$("#alertComment").parent('.control-group').removeClass('error');
		
		$("#alertTitle").parent('.control-group').removeClass('success');
		$("#alertType").parent('.control-group').removeClass('success');
		$("#alertDialogExpDate").parent('.control-group').removeClass('success');
		$("#alertComment").parent('.control-group').removeClass('success');
		
		//$('#alertForm').find('.control-group').removeClass('error');
		//$('#alertForm').find('.control-group').removeClass('success');
		
		$("#expireMessage").text("");
	
	};
	
	
	ns.isNewElementSingleDay = function(date){
		var result = false;
		var startDate = viewDateToDateObject(date.start);
		var endDate = viewDateToDateObject(date.end);
		
		if (startDate.getTime() == endDate.getTime()){
			result = true;
		}
		return result;
	};
	
	
	ns.numberOfDaysBetweenDates = function(fromDate, toDate) {
		var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
		return Math.floor((fromDate.getTime() - toDate.getTime())/(oneDay)) ;
	};
	
	
	ns.custom_sort = function(a, b) {
		//return new Date(a.start).getTime() - new Date(b.start).getTime();
		return a.start.getTime() - b.start.getTime();
	};
	
	
	ns.ascSystemSort = function(a, b){
		var aSystem = a.system;
		var bSystem = b.system;
		return (aSystem < bSystem) ? -1 : (aSystem > bSystem) ? 1 : 0;
	};	

	
	ns.rangeWithinMonthYear = function(fromDate, toDate, month, year) {
		return ( dateFromString(fromDate).getMonth() == month && dateFromString(fromDate).getYear() == year ) || ( dateFromString(toDate).getMonth() == month && dateFromString(toDate).getYear() == year );
	};
	
	})(utils);

	return utils; 

});