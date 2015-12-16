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
            	var lastTimeZoneUpdate = localStorage.lastTimeZoneUpdate;
            	var lastTimeZoneMap = localStorage.lastTimeZoneMap
            	if (lastTimeZoneUpdate && lastTimeZoneMap && new Date(lastTimeZoneUpdate*1) > new Date()-1000*60*60*12){
            		timeZonesMap = JSON.parse(lastTimeZoneMap);
            		$rootScope.debug("loaded cached time zones"+JSON.stringify(timeZonesMap));
            		deferred.resolve();
            	} else {
	            	$http.get("http://api.timezonedb.com/?zone=Asia/Jerusalem&key=NKJH8T83ZVJJ&format=json").then(function(response){
	            		timeZonesMap.il =  response.data.gmtOffset*1;
	            		$http.get("http://api.timezonedb.com/?zone=Europe/Moscow&key=NKJH8T83ZVJJ&format=json").then(function(response){
	            			timeZonesMap.ru =  response.data.gmtOffset*1;
	            			localStorage.lastTimeZoneMap =  JSON.stringify(timeZonesMap);
	            			localStorage.lastTimeZoneUpdate =  new Date().getTime();
	            			$rootScope.debug("updated timezones map..."+JSON.stringify(timeZonesMap));
	            			deferred.resolve();
	            		});
	            	});
            	}
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
        	   $http.get("https://bidspirit.com/services/portal/getPortalInfo?includeOldAuctions=false&region=ALL").then(function(response){
        		   var data = response.data;
        		   var auctionsToUpdate = [];        		   
        		   var sites = {};
        		   var houses = {};
        		   for (var i=0;i<data.sites.length;i++){
        			   var site = data.sites[i]; 
        			   sites[site.id]=site;
        		   }
        		   
        		   for (var i=0;i<data.houses.length;i++){
        			   var house = data.houses[i];
        			   house.site = sites[house.bidspiritSiteId] || {};
        			   houses[house.id]=house;
        		   }
        		   for (var i=0;i<data.housesDetails.length;i++){
        			   var houseDetails = data.housesDetails[i];
        			   houses[houseDetails.auctionHouseId].details = houseDetails;
        		   }
        		   var ruToIlDiff = (timeZonesMap["il"]-timeZonesMap["ru"])/3600
        		   for (var i=0;i<data.auctions.length;i++){
        			   var auction = data.auctions[i];
        			   auction.house = houses[auction.houseId];
        			   var isFutureAuction = new Date(auction.date).getTime()-new Date().getTime() > -1000*60*60*24;
        			   if (!auction.hidden && !auction.catalogOnly && isFutureAuction && auction.house && auction.house.site.code!="demo"){
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
        				   auction.eventName = getLangField(auction.house.details.name);
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
        		   
        		   
        		   
        		   CalendarService.syncAuctionEvents(auctionsToUpdate);
        		   
        	   });
           };
           
           $scope.clearBidspiritEvents=function(){
        	   CalendarService.clearBidspiritEvents();
           }
           
           $scope.removeAllFutureEvents=function(){           
        	   var startDate = new Date();
        	   var endDate = new Date(2016,3,29,19,40,0,0,0);        	  
          	   CalendarService.deleteEvent(null,null,null,startDate,endDate,function(){
          		   $rootScope.debug("deleted future events");
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
                	$scope.updateCalendar();
                });
            }
            
            init();
             
            
            
    }]);
});
