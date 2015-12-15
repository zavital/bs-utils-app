(function(){
	
	require.config({
		waitSeconds:60,
		paths: {
	        "angular": "lib/angular",
	        "domReady": "lib/domReady",
	        "utilsApp":"js/utilsApp"
	    },
	    
	    shim: {
	        "angular": {
	            exports: "angular"
	        },
	        "lib/angular-ui-router": {
	            deps: ["angular"]
	        },
	        	        
	        
	        "domReady":{
	        	deps: ["angular"]
	        },
	        
	        
	    },
	    
	    deps: [         
	       'js/utilsAppBootstrap'
	   ]
	});
})();
