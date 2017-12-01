'use strict';
var ApplicationConfiguration = (function(){
	// 应用程序名和依赖
	var applicationModuleName = 'appname';
	var applicationModuleVendorDependencies = ['ui.router','ui.bootstrap'];
	var tempList = [];

	// 添加新模块
	var registerModule = function(moduleName, dependencies) {
		angular.module(moduleName, dependencies || []);
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	var urls = {
		//apiUrl: 'http://192.168.3.156:8080/ppp/rs/'
		apiUrl: 'http://172.16.21.142:8080/ppp/rs/'
		//apiUrl: 'http://180.167.25.170:8088/ppp/rs/'
    };

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule,
		urls:urls,
		tempList:tempList
	};
})();

