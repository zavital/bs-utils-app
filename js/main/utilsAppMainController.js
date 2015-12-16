define(['./utilsAppMainModule'], function (module) {
	
	module.controller('UtilsAppMainController', [
                  '$q', '$window', '$scope', '$rootScope', '$state', '$timeout','$interval','$http',
                  	'UtilsPathsService', 'CalendarService',
        function  ($q, $window,   $scope,  $rootScope,    $state,   $timeout,  $interval,  $http,
        		     UtilsPathsService,   CalendarService){  
        	
 			 
 			var timeZonesMap ={};
 			 
             function initDebug(){        		
          		GlobalConfig.debugInfo = {
          			lastDebugTime : GlobalConfig.pageLoadTime,    			
          			count:0,
          		};    		
          		$rootScope.debugMessage = "";
          		$rootScope.debug = function(msg){
          			$timeout(function(){
	          			var now =  new Date();
	      	    		$rootScope.debugMessage += "\n<Br> ("+now.getHours()+":"+now.getMinutes()+":"+now.getSeconds()+"["+now.getMilliseconds()+"]) "+msg;
	      	    		GlobalConfig.debugInfo.lastDebugTime = now.getTime();
          			},50);	
      	    	}
          		$rootScope.debug("debug init");
          	}
             
            function initTimeZonesMap(){
            	var deferred = $q.defer();
            	$rootScope.debug("init time zones map...");
            	$http.get("http://api.timezonedb.com/?zone=Asia/Jerusalem&key=NKJH8T83ZVJJ&format=json").then(function(response){
            		timeZonesMap.il =  response.data.gmtOffset;
            		$http.get("http://api.timezonedb.com/?zone=Europe/Moscow&key=NKJH8T83ZVJJ&format=json").then(function(response){
            			timeZonesMap.ru =  response.data.gmtOffset;
            			$rootScope.debug("got timezones map..."+JSON.stringify(timeZonesMap));
            			deferred.resolve();
            		});
            	});
            	return deferred.promise;
            }
             
           
           $scope.clearLog = function(){
        	   initDebug();
        	   try {
        		   $rootScope.debug("backgourn enabled: "+cordova.plugins.backgroundMode.isEnabled());
        	   } catch (e){
        	   }
           }
           
           
           
           function initPlugins(){
        	   cordova.plugins.backgroundMode.enable();
        	   cordova.plugins.backgroundMode.onactivate = function() {
        		   $rootScope.debug("background mode active");
        	   };
           }
           
           function getLangField(field){
        	   if (!field) return "";
        	   return field['he'] || field['en'] || field['ru'] || 'unknown';
           }
           
           $scope.updateCalendar = function(){
        	   $rootScope.debug("updating calendar...");
        	   $http.get("https://bidspirit.com/services/portal/getPortalInfo?includeOldAuctions=false").then(function(response){
        		   var data = response.data;
        		   var auctionsToUpdate = [];
        		   var houseNames = {};
        		   for (var i=0;i<data.housesDetails.length;i++){
        			   var houseDetails = data.housesDetails[i];
        			   houseNames[houseDetails.auctionHouseId] = getLangField(houseDetails.name) 
        		   }
        		   var ruToIlDiff = (timeZonesMap["IL"]-timeZonesMap["RU"])/3600
        		   for (var i=0;i<data.auctions.length;i++){
        			   var auction = data.auctions[i];
        			   if (new Date(auction.date).getTime()-new Date().getTime() > 0){
        				   var dateParts = auction.date.split("-");
        				   var timeParts = auction.time ? auction.time.split(":") : [];
        				   if (timeParts.length<2){
        					   timeParts=[23,59];
        				   } else {
        					   if (auction.region=="RU"){
        						   timeParts[0] = timeParts[0]*1 + ruToIlDiff ;
        					   }
        				   }
        				   auction.eventStart = new Date(dateParts[0]*1,dateParts[1]*1-1,dateParts[2]*1,timeParts[0]*1,timeParts[1]*1);
        				   auction.eventEnd = new Date(auction.eventStart.getTime()+1000*60*60*4);
        				   auction.eventName = houseNames[auction.houseId];
        				   if (auction.number){
        					   auction.eventName+=" מכירה "+auction.number;
        					   if (auction.part){
        						   auction.eventName+=" חלק "+auction.part;
        					   }
        				   } else {
        					   auction.eventName="מכירה "+auction.eventName;
        				   }
        				   auction.eventAddress = getLangField(auction.address);
        				   auctionsToUpdate.push(auction);
        				   
        			   }
        		   }
        		   $rootScope.debug(auctionsToUpdate.length+" relevant auctions");
        		   
        		   console.log(auctionsToUpdate);
        		   
        		   CalendarService.syncAuctionEvents(auctionsToUpdate);
        		   
        	   });
           };
           
           $scope.clearBidspiritEvents=function(){
        	   CalendarService.clearBidspiritEvents();
           }
           
           $scope.testAdd=function(){           
        	   var startDate = new Date(2015,11,30,18,30,0,0,0); // beware: month 0 = january, 11 = december
        	   var endDate = new Date(2015,11,30,19,30,0,0,0);
        	   var title = "Bidspirit auction";
        	   var eventLocation = "somewhere";
        	   var notes = "Some notes about this event.";
          	   CalendarService.createEvent(title,eventLocation,notes,startDate,endDate,function(){
          		 $rootScope.debug("created eng event");
          		 var hebStartDate = new Date(2015,11,30,10,30,0,0,0); // beware: month 0 = january, 11 = december
          		 var hebEndDate = new Date(2015,11,30,11,30,0,0,0);
          		 var hebTitle = "מכירה";
          		 var hebEventLocation = "שם";
          		 var hebNotes = "מידע";
            	 CalendarService.createEvent(hebTitle,hebEventLocation,hebNotes,hebStartDate,hebEndDate,function(){
            		 $rootScope.debug("created heb event");
            	 });
          	   });
          }
           
           
           $scope.testRemove=function(){           
        	   var startDate = new Date(2016,0,30,8,30,0,0,0); // beware: month 0 = january, 11 = december
        	   var endDate = new Date(2016,3,29,19,40,0,0,0);
        	   var title = "Bidspirit auction";
        	   var eventLocation = "somewhere";
        	   var notes = "Some notes about this event.";
          	   CalendarService.deleteEvent(null,null,null,startDate,endDate,function(){
          		 $rootScope.debug("deleted eng event");
          		 var hebStartDate = new Date(2015,11,30,10,30,0,0,0); // beware: month 0 = january, 11 = december
          		 var hebEndDate = new Date(2015,11,30,11,30,0,0,0);
          		 var hebTitle = "מכירה";
          		 var hebEventLocation = "שם";
          		 var hebNotes = "מידע";
            	 CalendarService.deleteEvent(hebTitle,hebEventLocation,hebNotes,hebStartDate,hebEndDate,function(){
            		 $rootScope.debug("deleted heb event");
            	 });
          	   });
          }
           
          
          
           
           
             
           function init(){
            	initDebug();
            	$scope.loadState = "loaded";
                document.getElementById("pagePreLoader").remove();
                UtilsPathsService.templateState('utils', 'utilsMain', {url:'/'});
                $state.go("utils");
                
                
                document.addEventListener('deviceready', function () {
                	initPlugins();
            	}, false);
                $interval($scope.updateCalendar, 1000*60*60);
                
                initTimeZonesMap().then(function(){
                	//$scope.updateCalendar();
                });
            }
            
            init();
             
            
            
    }]);
});
