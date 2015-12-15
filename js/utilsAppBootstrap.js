
define(['require', 'angular', 'utilsApp', 'domReady'], function(require, ng) {
    'use strict';   
    require(['domReady!'], function(document) {
    	ng.bootstrap(document, ['utilsApp']);
    });
});





