
define([
    'angular',
    'ngdir/angular-ui-router',
    'utilsApp/utilsAppModules'
    
], function (angular) {
    'use strict';
    
    
    return angular.module('app', [
        'utilsApp.portalModules',
    ]).config(function($locationProvider){
    	$locationProvider.hashPrefix('!');
    });
});
