var URL = 'http://localhost:1337'; 
var debug = true; 
function log(obj) 
{ 
	if (debug) console.log(obj); 
} 
var mainApp = angular.module('paperlessPractice', ['ngRoute','paperlessPractice.patient'])
.config(function($routeProvider, $locationProvider, $httpProvider) { 
	$routeProvider.otherwise({ redirectTo: '/login'}); 
})
.run(function($http,$location,$rootScope){
	init();
	function init(){
		$http.get(URL + '/user')
		.then(function(r){
			console.log(r);
			if (r.statusText == 'OK') 
			{
				$rootScope.user = r.data;
			}
			else
			{
				$location.url('/login');
			}
		},function(e){
			console.log(e);
			$location.url('/login');
		});
	};
})

