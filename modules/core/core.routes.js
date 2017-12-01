'use strict';

angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/login');
		$stateProvider.
		 state('login', {
			url:'/login',
			params:{str: null},
			templateUrl: 'template/core/login.html',
			controller:'loginCtrl',
			data: {
				displayName: 'login'
			}
		}).state('project', {
			url:'/project',
			templateUrl: 'template/component/project.html',
			controller:'projectCtrl',
			data: {
				displayName: 'project'
			}
		}).state('paramForm',{
			url:'/paramForm',
			params:{projectId: null,schemeId: null,schemeName: null,proName: null,isReport: null},
			templateUrl:'template/component/paramForm.html',
			controller:'paramFormCtrl',
			displayName:{
				displayName:"paramForm"
			}
		}).state('financeForm',{
			url:'/financeForm',
			templateUrl:'template/component/financeForm.html',
			controller:'financeFormCtrl',
			displayName:{
				displayName:"financeForm"
			}
		});
	}
]);