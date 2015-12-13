
define([
    'angular',
    'lib/angular-ui-router',
    'app/utilsAppModules'
    
], function (angular) {
    'use strict';
    
    
    return angular.module('utilsApp', [
        'ui.router',                               
        'utilsApp.modules',
    ]).config(function($locationProvider){
    	$locationProvider.hashPrefix('!');
    });
});
