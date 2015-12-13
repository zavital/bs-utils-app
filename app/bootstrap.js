
if (window.location.hash && window.location.hash.indexOf("%21")!=-1){
	window.location.hash = window.location.hash.replace("%21","!");
}

define(['require', 'angular', 'app','commonModules','domReady','fastClick'], function(require, ng) {
    'use strict';   
    require(['domReady!','fastClick'], function(document,fastClick) {
    	if (!window.BIDSPIRIT_SNAPSHOT) {
    		ng.bootstrap(document, ['app']);
    		fastClick.attach(document.body)
    	}
    });
});





