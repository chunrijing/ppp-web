angular.module('core').controller('loginCtrl', ['$scope', '$http','$rootScope','$uibModal','commonService','$timeout','$compile','$state',"$stateParams",
    function ($scope, $http,$rootScope,$uibModal,commonService,$timeout,$compile,$state,$stateParams) {
        $scope.loginIn = function(){
            //console.log("loginIn");
            commonService.login(
                {
                    "uname": "pjj2017",
                    "upwd": "123456"
                }
            ).then(function(res){
                console.log(res);
                $state.go('project');
            })
        }
    }]);