angular.module('core').controller('projectCtrl', ['$scope', '$http','$rootScope','$uibModal','commonService','$timeout','$compile','$state',"$stateParams",
    function ($scope, $http,$rootScope,$uibModal,commonService,$timeout,$compile,$state,$stateParams) {
        let height = $(".main-container .proInfo").height()+41+$(".main-container .plan").height();
        $(".main-container .sidebar").height(height);
        $scope.addPro = function(){
            var modalInstance = $uibModal.open({
                windowClass: 'pro-modal',
                backdrop: 'static',
                animation: false,
                size: 'lg',
                templateUrl: 'template/core/addProModal.html',
                controller: 'addModalCtrl',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                console.log("1",selectedItem)
            }, function (selectedItem) {
                console.log(selectedItem);
            })
        }
        //新建方案
        $scope.addPlan = function () {
            var modalInstance = $uibModal.open({
                windowClass: 'plan-modal',
                backdrop: 'static',
                animation: false,
                size: 'lg',
                templateUrl: 'template/core/addPlanModal.html',
                controller: 'addModalCtrl',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                console.log("1",selectedItem)
            }, function (selectedItem) {
                console.log(selectedItem);
            })
        }
        $scope.city = "西北";
        $scope.totalItems = 64;
        $scope.currentPage = 1;

        $scope.getDumpOk = function(a,b){
            console.log("====");
        }
        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.currentPage);
        };

        $scope.maxSize = 5;
        $scope.bigTotalItems = 175;
        $scope.bigCurrentPage = 1;

        $scope.check = function($event){
            $($event.target).toggleClass("background");
        }
    }]);