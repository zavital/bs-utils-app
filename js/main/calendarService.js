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
			window.plugins.calendar.listCalendars(debugSuccessCallback("listCalendars"),debugErrorCallback("listCalendars"));
		}
		
		function  createEvent(startDate,endDate,title,eventLocation,notes){			
			window.plugins.calendar.createEvent(startDate,endDate,title,eventLocation,notes,debugSuccessCallback("createEvent"),debugErrorCallback("createEvent"));
		}
		
		function  deleteEvent(title,eventLocation,notes,startDate, endDate){
			window.plugins.calendar.deleteEvent(title, eventLocation, notes, startDate, endDate, debugSuccessCallback("deleteEvent"),debugErrorCallback("deleteEvent"));
		}
		
		
		function  listEventsInRange(startDate, endDate){
			window.plugins.calendar.listEventsInRange(startDate, endDate, debugSuccessCallback("listEventsInRange"),debugErrorCallback("listEventsInRange"));
		}
		
		function findAllEventsInCalendar(calendarName){
			window.plugins.calendar.findAllEventsInNamedCalendar(calendarName, debugSuccessCallback("findAllEventsInCalendar"), debugErrorCallback("findAllEventsInCalendar"));
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
