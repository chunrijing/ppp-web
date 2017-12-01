angular.module('core').controller('rmaterialsfuelCtrl', ['$scope', '$http','$rootScope','commonService','$timeout','$compile','$state',"$stateParams","$window",
    function ($scope, $http,$rootScope,commonService,$timeout,$compile,$state,$stateParams,$window) {
        let info = $window.sessionStorage.getItem("info").split(",");
        $scope.projectId = parseInt(info[0]);
        $scope.schemeId = parseInt(info[1]);
        let height = $(window).height();
        $(".rmaterialsfuel").height(height-250);
        commonService.getRMaterFuels($scope.projectId,$scope.schemeId).then((respon)=>{
            $scope.list=respon.result;
            commonService.getPeriod($scope.schemeId).then((res)=>{
                let respon = res.result;
                //建设期
                $scope.periodConstruction =respon.periodConstruction;
                //运营期
                $scope.periodOptrationa=respon.periodOptrationa;
                let count = $scope.periodConstruction+$scope.periodOptrationa;
                //表头分年投资拼接
                for(let i=0;i<count;i++){
                    let html = `<th>${i+1}</th>`;
                    let temp = $compile(html)($scope);
                     angular.element($(".rmaterialsfuel .tableAuto thead tr:last-child")).append(temp);
                }

                let fixedList = [];
                let autoList = [];
                $scope.list.map((value,index)=>{
                    let flist = [];
                    let alist = [];
                    for(let i=0;i<value.length;i++){
                        if(i<3){
                            flist.push(value[i]);
                        }else{
                            alist.push(value[i]);
                        }
                    }
                    fixedList.push(flist);
                    autoList.push(alist);
                })
                let ftrs = $(".table_fixed tbody tr");
                let atrs = $(".tableAuto tbody tr");
                fixedList.map((value,index)=>{
                    for(let i=0;i<value.length;i++){
                        let values=value[i]==null?"":(typeof value[i]=="number"?value[i].toFixed(2):value[i]);
                        let html = `<td><input  readonly="readonly" value="${values}"></td>`;
                        let temp = $compile(html)($scope);
                        angular.element($(ftrs[index])).append(temp);
                    }
                })
                autoList.map((value,index)=>{
                    for(let i=0;i<value.length;i++){
                        let values=value[i]==null?"":(typeof value[i]=="number"?value[i].toFixed(2):value[i]);
                        let html = `<td ><input readonly="readonly" value="${values}"></td>`;
                        let temp = $compile(html)($scope);
                        angular.element($(atrs[index])).append(temp);
                    }
                })
            })
        })
    }]);