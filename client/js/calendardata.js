
angular.module('calendarDataModule', []).
	factory('CalendarData', function() {
	
		var data = data || {};

		(function(ns) {
	
	
			ns.addEmptyElementsForSystem = function(systemItem, calendartable, daysInMonth, index) {
			
				calendartable.push({
					"_id": systemItem._id,
					"system": systemItem.system,
					"statuslines": []
				});
				
				for (k = 1; k < daysInMonth + 1; k++) {
				
					var calDate = new Date();
					calDate = resetDateTime(calDate);
					calDate.setDate(k);
					
					calendartable[index].statuslines.push({
						"start": calDate,
						"end": calDate,
						"status": "available",
						"viewcolor": "available",
						"colspan": 1
					});
				}
				return calendartable;
			}
			
			
			ns.fillSpaceWithEmptyElements = function(v_status, table){
				var startDate = new Date(v_status.start.getTime());
				var daysBetween = numberOfDaysBetweenDates(v_status.end, v_status.start);
				
				for (k = 0; k < daysBetween + 1; k++) {
				
					table.push({
						"start": startDate, 
						"end": startDate,
						"status": "available",
						"viewcolor": "available"
					});
					
					startDate = new Date(startDate);					
					startDate.setDate(startDate.getDate()+1);
				}	
			}
			
			
			ns.isNewElementOverlapping = function(element, formEndDate, systemlines, j) {
				var formEndDate = viewDateToDateObject(formEndDate);
				var daysBetween = numberOfDaysBetweenDates(formEndDate, element.start);
				
				for (k = 0; k < daysBetween + 1; k++) {
					if (systemlines.statuslines[j + k].status != 'available') {
						return true; //jquery break
					}
				}
			}
			
			
			ns.checkNewElementStartDay = function(element, formStartDate) {
				var result = false;
				var formStartDate = viewDateToDateObject(formStartDate);
				
				if (element.start.getTime() == formStartDate.getTime() && element.end.getTime() == formStartDate.getTime()){
					result = true;
				}
				return result;
			}
			
			
			ns.clearSpaceForNewElement = function(elementStartDate, formEndDate, systemlines, j) {
				formEndDate = viewDateToDateObject(formEndDate);
				var daysBetween = numberOfDaysBetweenDates(formEndDate, elementStartDate);
				
				for (k = 0; k < daysBetween + 1; k++) {
					systemlines.statuslines.splice(j, 1);
				}
			}
			
			
			ns.addNewElement = function(systemFormData, statuslines) {
				var formStartDate = viewDateToDateObject(systemFormData.start);
				var formEndDate = viewDateToDateObject(systemFormData.end);

				statuslines.push({
					"start": formStartDate,
					"end": formEndDate,
					"status": systemFormData.status,
					"viewcolor": systemFormData.status,
					"comment": systemFormData.comment,
					"colspan": numberOfDaysBetweenDates(formEndDate, formStartDate) + 1
				});
			}
			
			
			ns.removeCalendarElement = function(system, item) {
				$.each(system.statuslines, function(j, v_status) {

					if (v_status.start.getTime() == item.start.getTime() && v_status.end.getTime() == item.end.getTime() && v_status.status == item.status) {
						
						system.statuslines.splice(j, 1);
						ns.fillSpaceWithEmptyElements(v_status, system.statuslines);
						system.statuslines.sort(custom_sort);
					}
				});
			}
			
			
			ns.findAndAddNewElement = function(system, formData) {
	
				$.each(system.statuslines, function(j, v_status) {
							
					if (ns.checkNewElementStartDay(v_status, formData.start)) {
					
						if (isNewElementSingleDay(formData)) {
						
							system.statuslines[j].status = formData.status;
						} 
						else {
							if(ns.isNewElementOverlapping(v_status, formData.end, system, j)){
								return false; //jquery break
							}
							
							ns.clearSpaceForNewElement(viewDateToDateObject(formData.start), 
																 formData.end, 
																 system, 
																 j);
																 
							ns.addNewElement(formData, system.statuslines);
							system.statuslines.sort(custom_sort);

							return false; //jquery break
						}
					}
				});
			}
			
		/*	
			ns.updateStatuslineToDB = function(systemlines) {
	
				var systemElement;
				var statusItems = [];
				
				systemElement = { 
				  "system": systemlines.system,
				  "statuslines": ""
				};
				
				//funka ikkje me $.each
				// legg over alle element frå statuslines som ikkje har available status
				for(var j = 0; j < systemlines.statuslines.length; j++)
				{				
					if(systemlines.statuslines[j].status != 'available'){
						var tmpObject = jQuery.extend(true, {}, systemlines.statuslines[j]);
						tmpObject.start = getDateString(tmpObject.start);
						tmpObject.end = getDateString(tmpObject.end);
						delete tmpObject['viewcolor'];
						statusItems.push(tmpObject);			
					}			
				}	

				systemElement.statuslines = statusItems;	
				Systems.systems.update({id:systemlines._id.$oid}, systemElement, function(item){});		

			}*/
			
		})(data);
		
		return data; 	
	});