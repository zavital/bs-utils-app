
define([ './utilsAppMainModule'], function (module) {
	
	
	module.factory('UtilsPathsService', function($rootScope, $state, $timeout) {
		
		
		mStatesProvider = window.$stateProvider; //a kind of a hack which allows us to add states at run time.
		
		mReloadTimer = null;
		
		function templatePath(templateName){			 
			return "templates/"+templateName+".html";
		}
		
		
		function state(name, options){
			mStatesProvider =  mStatesProvider.state(name, options);
			return mStatesProvider;
		}
		
		function childSubviewTemplateState(parentName, childName,template, options){
			var _options = angular.copy(options);
			_options.views = {};			
			_options.views['@'+parentName] = {templateUrl: templatePath(template)};
			templateState(parentName+'.'+childName, null, _options);
			
		}
		
		function templateState(name,template, options){
			var _options = angular.copy(options);
			_options.templateUrl = templatePath(template);
			
			state(name, _options);
		}
		
		
		
		function currentStateSuffix(){
			var stateParts = $state.current.name.split(".");
			return stateParts[stateParts.length-1];
		}
		
		function simpleChildStates(parentState,childStates){
			angular.forEach(childStates,function(childState){
				state(parentState+"."+childState, {url:"/"+childState});
			});
		}
		
		
		return{
			
			templatePath:templatePath,
			
			templateState:templateState,
			
				
			state:state,
			
			
		};
		
		
	});
    
});
