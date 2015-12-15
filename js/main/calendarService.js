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
		
		function  listCalendars(callback){
			window.plugins.calendar.listCalendars(callback ,debugErrorCallback("listCalendars"));
		}
		
		function  createEvent(title,eventLocation,notes, startDate,endDate){
			$rootScope.debug("adding event "+title+", "+eventLocation+", "+notes+", "+startDate+", "+endDate);
			window.plugins.calendar.createEventInNamedCalendar(title,eventLocation,notes,startDate,endDate, "Bidspirit", debugSuccessCallback("createEvent "+notes),debugErrorCallback("createEvent "+notes));
		}
		
		function  deleteEvent(title,eventLocation,notes,startDate, endDate){
			$rootScope.debug("deleting event "+title+", "+eventLocation+", "+notes+", "+startDate+", "+endDate);
			window.plugins.calendar.deleteEvent(title, eventLocation, notes, startDate, endDate, debugSuccessCallback("deleteEvent "+notes),debugErrorCallback("deleteEvent"));
		}
				
		function findAllEventsInCalendar(calendarName, callback){
			if (!callback) callback = debugSuccessCallback("findAllEventsInCalendar");
			window.plugins.calendar.findAllEventsInNamedCalendar(calendarName, callback, debugErrorCallback("findAllEventsInCalendar"));
		}
		
		function validateBidspiritCalendarExists(callback){
			listCalendars(function(calendars){
				for (var i=0;i<calendars.length;i++){
					if (calendars[i].name=="Bidspirit") {
						$rootScope.debug("Found Bidspirit's calendar");
						callback();
						return;
					}
				}
				window.plugins.calendar.createCalendar("Bidspirit",callback,debugErrorCallback("Failed to create calendar"));
			});
		}
		
		function getFutureAuctionsEvents(){
			var deferred = $q.defer();
			var getListFn;
			
			findAllEventsInCalendar("Bidspirit", function(result){
				deferred.resolve(result);
			});
			return deferred.promise;
		}
		
		
		
		function getAuctionEventKey(auction){
			return auction.houseCode+"_"+auction.date+"_"+auction.time;
		}
		
		function clearBidspiritEvents(){
			getFutureAuctionsEvents().then(function(auctionsEvents){
				for (var i=0;i<auctionsEvents.length;i++){
					var event = auctionsEvents[i];
					$rootScope.debug("deleting "+JSON.stringify(event));
					deleteEvent(event.title, event.location, event.notes, new Date(event.date), new Date(event.endDate));
				}
			});
		}
		
		function syncAuctionEvents(auctions){
			validateBidspiritCalendarExists(function(){
				getFutureAuctionsEvents().then(function(auctionsEvents){
					$rootScope.debug("got "+auctionsEvents.length+" future events.");
					var eventsToDelete = {};
					for (var i=0;i<auctionsEvents.length;i++){
						var event = auctionsEvents[i];
						var eventKey = event.notes.split("Key:")[1];
						if (eventKey){
							eventsToDelete[eventKey]=event;
						}
					}	
					var addedEvents = 0;
					for (var i=0;i<auctions.length;i++){
						var auction = auctions[i];
						var eventKey = getAuctionEventKey(auction);
						if (eventsToDelete[eventKey]){
							delete eventsToDelete[eventKey];
						} else {							
							//createEvent(auction.eventName, auction.eventAddress,"Key:"+eventKey,auction.eventStart,auction.eventEnd);
							addedEvents++;
						}
					}
					var removedEvents = 0;
					for (eventKey in eventsToDelete){
						var event = eventsToDelete[eventKey];						
						deleteEvent(event.title, event.location, event.notes, new Date(event.startDate), new Date(event.endDate));
						removedEvents++;
					}
					$rootScope.debug(addedEvents+" events added, "+removedEvents+" removed"); 
				});
			});
				
		}
		
		
		
		 
		return {
			listCalendars:listCalendars,
			createEvent:createEvent,
			deleteEvent:deleteEvent,
			findAllEventsInCalendar:findAllEventsInCalendar,
			
			syncAuctionEvents:syncAuctionEvents,
			clearBidspiritEvents:clearBidspiritEvents
			
		}
		
		
	});
     
});
