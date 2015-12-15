define(['./utilsAppMainModule'], function (module) {
	module.factory('CalendarService', function(
			$q, $rootScope, $timeout){
		
		function debugCallback(msg){
			return function(result){
				$rootScope.debug(msg+":"+JSON.stringify(result));
			}
		}
		
		function debugSuccessCallback(msg){
			return debugCallback(msg +" success ");
		}
		
		function debugErrorCallback(msg){
			return debugCallback(msg +" error ");
		}
		
		function  listCalendars(){
			window.plugins.calendar.listCalendars(debugSuccessCallback,debugErrorCallback);
		}
		
		function  createEvent(startDate,endDate,title,eventLocation,notes){
			window.plugins.calendar.createEvent(title,eventLocation,notes,startDate,endDate,debugSuccessCallback,debugErrorCallback);
		}
		
		function  deleteEvent(title,eventLocation,notes){
			window.plugins.calendar.deleteEvent(title, eventLocation, notes,debugSuccessCallback,debugErrorCallback);
		}
		
		
		function  listEventsInRange(startDate, endDate){
			window.plugins.calendar.createEvent(startDate, endDate, debugSuccessCallback,debugErrorCallback);
		}
		
		function findAllEventsInCalendar(calendarName){
			window.plugins.calendar.findAllEventsInNamedCalendar(calendarName, debugSuccessCallback, debugErrorCallback);
		}
		 
		return {
			listCalendars:listCalendars,
			createEvent:createEvent,
			deleteEvent:deleteEvent,
			listEventsInRange:listEventsInRange,
			findAllEventsInCalendar:findAllEventsInCalendar
		}
		
		
	});
     
});
