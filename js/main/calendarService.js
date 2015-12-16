define(['./utilsAppMainModule'], function (module) {
	module.factory('CalendarService', function(
			$q, $rootScope, $timeout){
		var future = new Date(2100,1,1);
		var BIDSPIRIT_CALENDAR_NAME = "Bidspirit";
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
		
		function  createEvent(title,eventLocation,notes, startDate,endDate, callback){
			$rootScope.debug("adding event "+title+", "+eventLocation+", "+notes+", "+startDate+", "+endDate);
			window.plugins.calendar.createEvent(title,eventLocation,notes,startDate,endDate, callback, debugErrorCallback("createEvent "+notes));
		}
		
		function  deleteEvent(title,eventLocation,notes,startDate, endDate, callback){
			$rootScope.debug("deleting event "+title+", "+eventLocation+", "+notes+", "+startDate+", "+endDate);
			window.plugins.calendar.deleteEvent(title, eventLocation, notes, startDate, endDate, callback, debugErrorCallback("deleteEvent"));
		}
				
		function findAllEventsInCalendar(calendarName, callback){
			if (!callback) callback = debugSuccessCallback("findAllEventsInCalendar");
			window.plugins.calendar.findAllEventsInNamedCalendar(calendarName, callback, debugErrorCallback("findAllEventsInCalendar"));
		}
		
		
		
		function getFutureAuctionsEvents(){
			var deferred = $q.defer();
			var getListFn;
			
			window.plugins.calendar.findEvent(null,null,null,new Date(),future, function(result){
				$rootScope.debug("found "+result.length+" results."); 
				deferred.resolve(result);
			}, debugErrorCallback("findAllEventsInCalendar"));
			
			return deferred.promise;
		}
		
		
		
		function getAuctionEventKey(auction){
			return auction.houseCode+"_"+auction.date+"_"+auction.time;
		}
		
		function parseEventDate(eventDateStr,diff){
			var dateParts = eventDateStr.split(" ")[0].split("-");
			var timeParts = eventDateStr.split(" ")[1].split(":");
			return new Date(dateParts[0],dateParts[1]-1,dateParts[2],timeParts[0],timeParts[1],timeParts[2]);
		}
		
		function clearEvents(eventsList, callback){
			function clearRecursivly(){
				var event = eventsList.pop();
				if (event){
					$rootScope.debug("deleting "+JSON.stringify(event));
					deleteEvent(null, null, event.message, parseEventDate(event.startDate), parseEventDate(event.endDate), clearRecursivly);
					
				} else {
					callback();
				}
			}
			clearRecursivly();
		}
		function clearBidspiritEvents(){
			/*getFutureAuctionsEvents().then(function(auctionsEvents){
				clearEvents(auctionsEvents,function(){
					console.log("cleared "+auctionsEvents.length+" events.");
				});
			});*/
			
			window.plugins.calendar.deleteEventFromNamedCalendar(null, null, null, new Date(), future, BIDSPIRIT_CALENDAR_NAME,
					debugSuccessCallback("clearBidspiritEvents"), debugErrorCallback("deleteEvent"));
		}
		
		function syncAuctionEvents(auctions){
			
			getFutureAuctionsEvents().then(function(auctionsEvents){
				$rootScope.debug("got "+auctionsEvents.length+" future events.");
				var eventsToDelete = {};
				for (var i=0;i<auctionsEvents.length;i++){
					var event = auctionsEvents[i];
					var eventKey = event.message.split("Key:")[1];
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
						createEvent(auction.eventName, auction.eventAddress,"Key:"+eventKey,auction.eventStart,auction.eventEnd);
						addedEvents++;
					}
				}
				$rootScope.debug(addedEvents+" events added");
				
				var removedEvents = 0;
				var eventsToDeleteList = [];
				for (eventKey in eventsToDelete){
					var event = eventsToDelete[eventKey];
					eventsToDeleteList.push(event);						
					removedEvents++;
				}
				clearEvents(eventsToDeleteList,function(){
					$rootScope.debug(removedEvents+" events removed. ");
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
