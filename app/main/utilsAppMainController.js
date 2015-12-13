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
             
            function init(){
            	initDebug();
            	$scope.loadState = "loaded";
                document.getElementById("pagePreLoader").remove();
            }
            
            init();
             
            
            
    }]);
});
