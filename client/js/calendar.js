
angular.module('calendarModule', []).
	factory('Calendar', function() {

	var calendar = calendar || {};

	(function(ns) {
		
		ns.getFirstDayInCurrentMonth = function() {
			var d = new Date();
			d.setDate(1);
			return d;
		};

		ns.getLastDayInCurrentMonth = function() {
			var d = new Date();
			return new Date(d.getFullYear(), d.getMonth() + 1, 0);
		};

		ns.firstDayInCurrentMonth = ns.getFirstDayInCurrentMonth();

		ns.lastDayInCurrentMonth = ns.getLastDayInCurrentMonth();

		ns.currentDate = new Date();

		ns.dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		ns.dayLabelsShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
		ns.monthLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		ns.daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	
		ns.currentMonth = ns.currentDate.getMonth();
		ns.currentYear = ns.currentDate.getFullYear();
		
		ns.currentMonthName = function() {
			return ns.monthLabels[ns.currentDate.getMonth()];
		};

		ns.noOfDaysInCurrentMonth = ns.daysInMonth[ns.currentDate.getMonth()];

		ns.currentMonthDayList = function() {
			var days = ns.daysInMonth[ns.currentDate.getMonth()];

			var dayArray = [];

			for (i = 0; i < days; i++) {
				dayArray.push(i + 1);
			}

			return dayArray;
		};

		ns.getWeek = function getWeek(date) {
			var onejan = new Date(date.getFullYear(), 0, 1);
			return Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7);
		};


		ns.currentMonthWeekList = function() {
			var dayArray = ns.currentMonthDayList(),
			weekArray = [],
			m = ns.currentDate,
			weekAndDays = [],
			colSpan = 0;

			$.each(dayArray, function(i, v_day) {
				weekArray.push(ns.getWeek(new Date(m.getFullYear(), m.getMonth(), i)));
			});

			for (var i = 0; i < weekArray.length; i++) {
				colSpan++;
				if (weekArray[i] !== weekArray[i + 1]) {
					weekAndDays.push({
						"week": weekArray[i],
						"colSpan": colSpan
					});
					colSpan = 0;
				}
			}

			return weekAndDays;
		};

		ns.dayNamesInCurrentMonth = function() {
			var dayCount = ns.daysInMonth[ns.currentDate.getMonth()];

			var dayArray = [];

			var date = ns.currentDate;
			var firstDayInMonth = new Date(date.getFullYear(), date.getMonth(), 1);

			var day_it = firstDayInMonth.getDay();
			for (i = 0; i < dayCount; i++) {

				dayArray.push(ns.dayLabels[day_it]);
				day_it++;

				if (day_it > 6) {
					day_it = 0;
				}
			}

			return dayArray;
		};


	})(calendar);

	return calendar; 
});
