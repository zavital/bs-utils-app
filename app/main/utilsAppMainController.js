define(['./utilsAppMainModule'], function (module) {
	
	module.controller('UtilsAppMainController', [
                  '$scope', '$rootScope', '$state', '$timeout',
        function ( $scope,  $rootScope,    $state,   $timeout){  
        			 
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
        			 var startDate = new Date(2016,0,5,18,30,0,0,0); // beware: month 0 = january, 11 = december
        			 var endDate = new Date(2016,0,5,19,30,0,0,0);
        			 var title = "My nice event";
        			 var eventLocation = "Home";
        			 var notes = "Some notes about this event.";
        			 var success = function(message) { $rootScope.debug("Success: " + JSON.stringify(message)); };
        			 var error = function(message) { $rootScope.debug("Error: " + message); };
        			 window.plugins.calendar.createEvent(title,eventLocation,notes,startDate,endDate,success,error);
        			 
        		 } catch (e){
        			 $rootScope.debug("failed to set calendar:"+e.message);
        		 }
            	 
             }
             
            function init(){
            	initDebug();
            	$scope.loadState = "loaded";
                document.getElementById("pagePreLoader").remove();
                calendarTest();
            }
            
            init();
             
            
            
    }]);
});
