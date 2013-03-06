"use strict";

angular.module('calendarModule', []).
	factory('Calendar', function() {

	var calendar = calendar || {};

	(function(ns) {
		
		ns.getCurrentMonth = function() {
			return ns.currentMonth;
		};
		
		ns.getCurrentYear = function() {
			return ns.currentYear;
		};

		ns.currentDate = new Date();
		
		ns.currentMonth = ns.currentDate.getMonth();
		ns.currentYear = ns.currentDate.getFullYear();

		ns.dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		ns.dayLabelsShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
		ns.monthLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		ns.monthLabelsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		ns.daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	
		ns.getMonthName = function() {
			return ns.monthLabels;
		};
	
		ns.getNoOfDaysInMonth = function() {
			return ns.daysInMonth;
		};

		ns.getMonthDayList = function() {
			
			var daysInMonths = [];
			
			for(var j = 0; j < 12; j++) {
				var dayArray = [];
				var i;
				for (i = 0; i < ns.daysInMonth[j]; i++) {
					dayArray.push(i + 1);
				}
				daysInMonths.push(dayArray);
			}

			return daysInMonths;
		};
		

		ns.getWeek = function(date) {
			var onejan = new Date(date.getFullYear(), 0, 1);
			return Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7);
		};


		ns.getMonthWeekList = function() {
			
			var weeks = [];

			for (var month = 0; month < 12; month++) {
				//var mList = ns.getMonthDayList();
				var dayArray = ns.getMonthDayList()[month],
				weekArray = [],
				m = ns.currentDate,
				weekAndDays = [],
				colSpan = 0;

				var j;
				for(j = 0; j < dayArray.length; j++) {
				//$.each(dayArray, function(i, v_day) {
					weekArray.push(ns.getWeek(new Date(m.getFullYear(), month, j)));
				}
				var i;
				for (i = 0; i < weekArray.length; i++) {
					colSpan++;
					if (weekArray[i] !== weekArray[i + 1]) {
						weekAndDays.push({
							"week": weekArray[i],
							"colSpan": colSpan
						});
						colSpan = 0;
					}
				}
				weeks.push(weekAndDays);
			}
			return weeks;
		};

		
		ns.getDayNamesInMonth = function(month) {
			var dayArray = ns.buildDayNameTable(ns.dayLabels, month);
			return dayArray;
		};
		
		
		ns.getShortDayNamesInMonth = function(month) {
			var dayArray = ns.buildDayNameTable(ns.dayLabelsShort, month);
			return dayArray;
		};
		
		
		ns.buildDayNameTable = function(lableTable, month) {
			var dayCount = ns.daysInMonth[month];

			var dayArray = [];

			var date = ns.currentDate;
			var firstDayInMonth = new Date(date.getFullYear(), month, 1);

			var day_it = firstDayInMonth.getDay();
			var i;
			for (i = 0; i < dayCount; i++) {

				dayArray.push(lableTable[day_it]);
				day_it++;

				if (day_it > 6) {
					day_it = 0;
				}
			}

			return dayArray;
		};
		
		
		//TODO: Not in use?
		ns.numberOfDaysBetweenDates = function(fromDate, toDate) {
			var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
			return Math.floor((toDate.getTime() - fromDate.getTime())/(oneDay)) ;
		};
		

	})(calendar);

	return calendar;
});
