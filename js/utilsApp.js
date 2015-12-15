
define([
    'angular',
    'lib/angular-ui-router',
    'js/utilsAppModules'
    
], function (angular) {
    'use strict';
    
    
    return angular.module('utilsApp', [
        'ui.router',                               
        'utilsApp.modules',
    ]).config(function($locationProvider,$sceProvider,$stateProvider,$provide){    	
    	$locationProvider.hashPrefix('!');
    	$sceProvider.enabled(false);
    	window.$stateProvider = $stateProvider;
    	$provide.decorator("$exceptionHandler", function($delegate, $injector){
	        return function(exception, cause){
	            var $rootScope = $injector.get("$rootScope");
	            if ($rootScope.debug){
	            	$rootScope.debug(exception.stack);
	            } else {
	            	console.log(exception.stack);
	            }
	            
	            $delegate(exception, cause);
	        };
	    });
    });
});
