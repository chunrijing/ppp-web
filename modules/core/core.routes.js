'use strict';

angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/project');

		$stateProvider.
		 state('login', {
			url:'/login',
			templateUrl: 'template/core/login.html',
			controller:'loginCtrl',
			data: {
				displayName: 'login'
			}
		}).state('project', {
			//params:{"name":null},
			url:'/project',
			templateUrl: 'template/component/project.html',
			controller:'projectCtrl',
			data: {
				displayName: 'project'
			}
		})/*.state('upload',{
			url:'/upload',
			templateUrl:'template/component/upload.html',
			controller:'uploadCtrl',
			displayName:{
				displayName:"upload"
			}
		}).state('audit',{
			url:'/audit',
			templateUrl:'template/component/audit.html',
			controller:'auditCtrl',
			displayName:{
				displayName:"audit"
			}
		}).state('largePattern',{
			url:'/largePattern',
			templateUrl:'template/component/largePattern.html',
			controller:'largePatternCtrl',
			data:{
				displayName:"largePattern"
			}
		})*/;
	}
]);