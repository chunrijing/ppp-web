angular.module('core').controller('copyModalCtrl', ['$scope', '$http','items', '$rootScope','$uibModalInstance','commonService','$timeout','$compile','$state',"$stateParams",
    function ($scope, $http,items,$rootScope,$uibModalInstance,commonService,$timeout,$compile,$state,$stateParams) {
        //$scope.list = items.list;
        $scope.projectId = items.projectId;
        $scope.name = items.name;
        $scope.schemeName = items.schemeName;

        $scope.ok = ()=>{
            $scope.isBlock=false;
            $scope.isPlanName=false;
            if($scope.schemeName!=""){
                checkName();
            }else{
                $scope.isBlock=true;
            }
            if($scope.isBlock==true||$scope.isPlanName==true){
                return
            }
            commonService.schemeCopy(items.schemeId,$scope.projectId,$scope.schemeName).then((res)=>{
                if(res.success==true){
                    $uibModalInstance.close($scope.projectId);
                }
            });
        }
        $scope.cancel = ()=>{
            $uibModalInstance.dismiss('');
        }
        commonService.getProjectAll({
            "name": ""
        }).then((res)=>{
            if(res.success!=true){
                return
            }
            $scope.list = res.result;
        })
        $scope.showOrHide = ($event)=>{
            $($event.target).siblings("div").toggle();
        }
        $("body").click(function (e) {
            if (!$(e.target).closest(".proName").length) {
                $(".copyModal .seleName").hide();
            }
        });
        $scope.select = ($event,projectId,name)=>{
            $($event.target).parent().siblings("input").val(name);
            $scope.projectId = projectId;
            $($event.target).parent().hide();
        }
        $scope.check = ($event)=>{
            $scope.isBlock=false;
            $scope.isPlanName=false;
            if($scope.schemeName==""){
                $scope.isBlock=true;
            }
        }
        function checkName(){
            commonService.isEqual($scope.schemeName,$scope.projectId).then((res)=>{
                if(res.result==1){
                    $scope.isPlanName=true;
                }
            })
        }
    }]);