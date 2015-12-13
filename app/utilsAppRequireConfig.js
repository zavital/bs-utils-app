(function(){
	
	require.config({
		waitSeconds:60,
		paths: {
	        "angular": "lib/angular",
	        "domReady": "lib/domReady",
	        "utilsApp":"app/utilsApp"
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
	       'app/utilsAppBootstrap'
	   ]
	});
})();
