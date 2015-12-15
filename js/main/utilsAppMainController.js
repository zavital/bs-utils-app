define(['./utilsAppMainModule'], function (module) {
	
	module.controller('UtilsAppMainController', [
                  '$scope', '$rootScope', '$state', '$timeout',
                  	'UtilsPathsService', 'CalendarService',
        function ( $scope,  $rootScope,    $state,   $timeout,
        			 UtilsPathsService,   CalendarService){  
        	 var startDate = new Date(2016,12,30,18,30,0,0,0); // beware: month 0 = january, 11 = december
 			 var endDate = new Date(2016,12,30,19,30,0,0,0);
 			 var title = "Bidspirit auction";
 			 var eventLocation = "somewhere";
 			 var notes = "Some notes about this event.";
 			 
 			var distantFuture = new Date(2100,1,1);
 			 
             function initDebug(){        		
          		GlobalConfig.debugInfo = {
          			lastDebugTime : GlobalConfig.pageLoadTime,    			
          			count:0,
          		};    		
          		$rootScope.debugMessage = "";
          		$rootScope.debug = function(msg){    			
          			var now =  new Date();
      	    		$rootScope.debugMessage += "\n<Br> ("+now.getHours()+":"+now.getMinutes()+":"+now.getSeconds()+"["+now.getMilliseconds()+"]) "+msg;
      	    		GlobalConfig.debugInfo.lastDebugTime = now.getTime();
      	    	}
          		$rootScope.debug("debug init");
          	}
             
             function calendarTest(){
        		 try {
        			
        			 var success = function(message) { $rootScope.debug("Success: " + JSON.stringify(message)); };
        			 var error = function(message) { $rootScope.debug("Error: " + message); };
        			 window.plugins.calendar.createEvent(title,eventLocation,notes,startDate,endDate,success,error);
        			 
        		 } catch (e){
        			 $rootScope.debug("failed to set calendar:"+e.message);
        		 }
            	 
             }
             
             
           $scope.listCalendars = function(){
            	 CalendarService.listCalendars();
           }
            
           $scope.createEvent = function(){
           	  CalendarService.createEvent(startDate,endDate,title,eventLocation,notes);
           }
            
           $scope.deleteEvent = function(){
           	  CalendarService.deleteEvent(title,eventLocation,notes);
           }
            
            $scope.listEventsInRange = function(){
           	 	CalendarService.listEventsInRange(new Date(),distantFuture);
           }	
            
           $scope.findAllEventsInCalendar = function(){
           	 CalendarService.findAllEventsInCalendar(null,distantFuture);
           }
             
            function init(){
            	initDebug();
            	$scope.loadState = "loaded";
                document.getElementById("pagePreLoader").remove();
                calendarTest();
                
                UtilsPathsService.templateState('utils', 'utilsMain', {url:'/'});
                $state.go("utils");
            }
            
            init();
             
            
            
    }]);
});
