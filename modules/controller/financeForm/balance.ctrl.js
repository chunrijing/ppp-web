angular.module('core').controller('balanceCtrl', ['$scope', '$http','$rootScope','commonService','$timeout','$compile','$state',"$stateParams","$window",
    function ($scope, $http,$rootScope,commonService,$timeout,$compile,$state,$stateParams,$window) {
        let info = $window.sessionStorage.getItem("info").split(",");
        $scope.projectId = parseInt(info[0]);
        $scope.schemeId = parseInt(info[1]);
        commonService.getBalance($scope.projectId,$scope.schemeId).then((respon)=>{
            let num = 2;
            if(respon.success==true){
                $scope.list=respon.result;
                let list=respon.result;
                list.map((v)=>{
                    v.map((value,index)=>{
                        if(typeof value=="number"){
                            value=value.toFixed(2);
                        }
                        v[index]=value;
                    })
                })
                let bussData = list[0].slice(2);
                let taxesData = list[1].slice(2);
                let changeData = list[2].slice(2);
                let fixData = list[3].slice(2);
                let balanceData = list[4].slice(2);
                commonService.getPeriod($scope.schemeId).then((res)=>{
                    if(res.success==true){
                        let respon = res.result;
                        //运营期
                        $scope.periodOptrationa=respon.periodOptrationa;
                        //$scope.periodConstruction =respon.periodConstruction;
                        let count = $scope.periodOptrationa;
                        $scope.count = count;
                        let yearList = [];
                        //表头分年投资拼接
                        for(let i=0;i<count;i++){
                            yearList.push(i+1);
                            let html = `<th>${i+1}</th>`;
                            let temp = $compile(html)($scope);
                            angular.element($(".tableAuto thead tr")).append(temp);
                        }
                        let fixedList = [];
                        let autoList = [];
                        $scope.list.map((value,index)=>{
                            let flist = [];
                            let alist = [];
                            for(let i=0;i<value.length;i++){
                                if(i<num){
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
                                let html = `<td><input readonly="readonly" value="${values}"></td>`;
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
                        creatChart(bussData,changeData,fixData,balanceData);
                    }
                });
            }
        })
        function creatChart(bussData,changeData,fixData,balanceData){
            var myChart = echarts.init(document.getElementById('charts'));
            let option = {
                title: {
                    text: '盈亏平衡图-生产能力利用率',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['营业收入（万元）','可变成本（万元）','固定成本（万元）'],
                    bottom: 0
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '10%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: balanceData
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name:'营业收入（万元）',
                        type:'line',
                        data:bussData
                    },
                    {
                        name:'可变成本（万元）',
                        type:'line',
                        data:changeData
                    },
                    {
                        name:'固定成本（万元）',
                        type:'line',
                        data:fixData
                    }
                ]
            };
            myChart.setOption(option);
        }
        commonService.findBalanceNum($scope.projectId,$scope.schemeId).then((res)=>{
            console.log(res);
            if(res.success==true){
                $scope.rate = res.result[0].toFixed(2);
                $scope.price = res.result[1].toFixed(2);
                $scope.yield = res.result[2].toFixed(2);
            }
        })
    }]);