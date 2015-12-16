define(['./utilsAppMainModule'], function (module) {
	module.factory('CalendarService', function(
			$q, $rootScope, $timeout){
		var nextYear = new Date(new Date().getTime()+1000*60*60*24*365);
		var EVENT_KEY_PREFIX = "Key:";
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
			window.plugins.calendar.findEvent(null,null,null,new Date(),nextYear, function(results){
				$rootScope.debug("found "+results.length+" results.");
				var bidspiritEvents = [];
				for (var i=0;i<results.length;i++){
					var event = results[i];
					if (event.message && event.message.indexOf(EVENT_KEY_PREFIX)==0){
						bidspiritEvents.push(event);
					}
				};
				deferred.resolve(bidspiritEvents);
			}, debugErrorCallback("findAllEventsInCalendar"));
			
			return deferred.promise;
		}
		
		
		
		function getAuctionEventKey(auction){
			return auction.houseCode+"_"+auction.date+"_"+auction.time;
		}
		
		function parseEventDate(eventDateStr,diff){
			var dateParts = eventDateStr.split(" ")[0].split("-");
			var timeParts = eventDateStr.split(" ")[1].split(":");
			var date =  new Date(dateParts[0],dateParts[1]-1,dateParts[2],timeParts[0],timeParts[1],timeParts[2]);
			if (diff){
				return new Date(date.getTime()+diff);
			} else {
				return date; 
			}
		}
		
		function clearEvents(eventsList, callback){
			function clearRecursivly(){
				var event = eventsList.pop();
				if (event){
					$rootScope.debug("deleting "+JSON.stringify(event));
					deleteEvent(null, null, event.message, parseEventDate(event.startDate,-1000*60*60*1), parseEventDate(event.endDate+1000*60*60*1), clearRecursivly);
				} else {
					callback();
				}
			}
			clearRecursivly();
		}
		
		function addAuctionEvents(auctionsList, callback){
			function addRecursivly(){
				var auction = auctionsList.pop();
				if (auction){
					var eventKey = getAuctionEventKey(auction);
					$rootScope.debug("creating "+eventKey);
					createEvent(auction.eventName, auction.eventAddress,EVENT_KEY_PREFIX+eventKey, auction.eventStart, auction.eventEnd, addRecursivly);
				} else {
					callback();
				}
			}
			addRecursivly();
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
					var eventKey = event.message.split(EVENT_KEY_PREFIX)[1];
					if (eventKey){
						eventsToDelete[eventKey]=event;
					}
				}	
				var addedEvents = 0;
				var auctionEventsList = [];
				for (var i=0;i<auctions.length;i++){
					var auction = auctions[i];
					var eventKey = getAuctionEventKey(auction);
					if (eventsToDelete[eventKey]){
						delete eventsToDelete[eventKey];
					} else {		
						auctionEventsList.push(auction);
						addedEvents++;
					}
				}
				addAuctionEvents(auctionEventsList,function(){
					$rootScope.debug(addedEvents+" events added");
				});
				
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
