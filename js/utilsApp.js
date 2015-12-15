
define([
    'angular',
    'lib/angular-ui-router',
    'js/utilsAppModules'
    
], function (angular) {
    'use strict';
    
    
    return angular.module('utilsApp', [
        'ui.router',                               
        'utilsApp.modules',
    ]).config(function($locationProvider,$sceProvider,$stateProvider){    	
    	$locationProvider.hashPrefix('!');
    	$sceProvider.enabled(false);
    	window.$stateProvider = $stateProvider;
    });
});
