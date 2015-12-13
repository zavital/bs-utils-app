(function(){
	
	require.config({
		waitSeconds:60,
		paths: {
	        "ngdir": "common/js/lib/angular",
	        "angular": "common/js/lib/angular/angular",
	        "domReady": "common/js/lib/domReady",
	        "fastClick":"common/js/lib/fastClick",
	        "commonModules": "common/js/modules/commonModules",
	        "app":"portal/js/app"
	    },
	    
	    shim: {
	        "angular": {
	            exports: "angular"
	        },
	        "ngdir/angular-ui-router": {
	            deps: ["angular"]
	        },
	        "ngdir/angular-ui-bootstrap": {
	            deps: ["angular"]
	        },
	        "ngdir/angular-animate":{
	        	deps: ["angular"]
	        },
	        "ngdir/angular-upload":{
	        	deps: ["angular"]
	        },
	        
	        "ngdir/angular-google-analytics":{
	        	deps: ["angular"]
	        },
	        
	        
	        "domReady":{
	        	deps: ["angular"]
	        },
	        
	        "fastClick":{
	        	deps: ["angular"]
	        }
	        
	    },
	    
	    deps: [         
	       'portal/js/bootstrap'
	   ]
	});
})();
