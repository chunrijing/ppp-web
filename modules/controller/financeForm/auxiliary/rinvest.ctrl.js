angular.module('core').controller('rinvestCtrl', ['$scope', '$http','$rootScope','commonService','$timeout','$compile','$state',"$stateParams","$window",
    function ($scope, $http,$rootScope,commonService,$timeout,$compile,$state,$stateParams,$window) {
        let info = $window.sessionStorage.getItem("info").split(",");
        $scope.projectId = parseInt(info[0]);
        $scope.schemeId = parseInt(info[1]);
        let height = $(window).height();
        $(".rinvest").height(height-250);
        commonService.getRinvest($scope.schemeId).then((res)=>{
            commonService.getPeriod($scope.schemeId).then((respon)=>{
                $scope.periodConstruction=respon.result.periodConstruction;
                res.result.map((i,v)=>{
                    for(let i=0;i<v.length;i++){
                        if(v[i]==null){
                            v[i]="";
                        }
                    }
                })
                $scope.list = res.result;
            })
        })
    }]);