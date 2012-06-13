		
		
		
		
		cal_days_labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		
		cal_months_labels = ['January', 'February', 'March', 'April',
		                     'May', 'June', 'July', 'August', 'September',
		                     'October', 'November', 'December'];
		
		cal_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		
		
		cal_current_date = new Date(); 
		
		function Calendar(day, month, year) 
		{
					
			  this.day = (isNaN(month) || day == null) ? cal_current_date.getDay() : day;
			  this.month = (isNaN(month) || month == null) ? cal_current_date.getMonth() : month;
			  this.year  = (isNaN(year) || year == null) ? cal_current_date.getFullYear() : year;
			  this.html = '';
			  
		}
				
		
		Calendar.prototype.generateHTML = function()
		{
		
			  // get first day of month
			  var firstDay = new Date(this.year, this.month, 1);
			  var startingDay = firstDay.getDay();
			  
			  // find number of days in month
			  var monthLength = cal_days_in_month[this.month];
			  
			  // compensate for leap year
			  if (this.month == 1) { // February only!
			    if((this.year % 4 == 0 && this.year % 100 != 0) || this.year % 400 == 0){
			      monthLength = 29;
			    }
			  }

			  var monthName = cal_months_labels[this.month]
			  var html = '<table id="systemtab">';
					
				
					html += '<thead>';
						html += '<tr><th colspan=' + monthLength + '>' + monthName + '</th></tr>';
						html += '<tr>';
							html += '<th>System</th>';
							for (var i = 1; i <= monthLength; i++) 
							{
								html += '<th>' + i + '</th>';
							}
						html += '</tr>';
					html += '<thead>';
					
					html += '<tbody>';
					
						html += '<tr ng-repeat="systemline in systemlines">'
							html +=	'<td class="system"> {{systemline.system}} </td>'
							html +=	'<td ng-repeat="statusline in systemline.statuslines" colspan="{{statusline.end - statusline.start + 1}}" class="{{statusline.status}}" ng-click="showDetails(statusline)"></td>'
						html += '</tr>';
					
					html += '</tbody>';			
				html += '</table>';
		
			  this.html = html;
		}
		
		
		Calendar.prototype.getHTML = function() 
		{			
			return this.html;
		}
		
		