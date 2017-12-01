angular.module('core').controller('sensitivityCtrl', ['$scope', '$http','$rootScope','commonService','$timeout','$compile','$state',"$stateParams","$window",
    function ($scope, $http,$rootScope,commonService,$timeout,$compile,$state,$stateParams,$window) {
        let info = $window.sessionStorage.getItem("info").split(",");
        $scope.projectId = parseInt(info[0]);
        $scope.schemeId = parseInt(info[1]);
        let height = $(window).height();
        $(".sensitivity").height(height-250);
        function getDate(rate){
            commonService.getSensitivity($scope.projectId,$scope.schemeId,rate).then((res)=>{
                if(res.result!=null&&res.result.length!=0){
                    $scope.list_1 = res.result[0];
                    $scope.list_2 = res.result[1];
                    if(rate==-1){
                        let rates = res.result[0][0][5];
                        $(".sensitivity .changeRate>input").val(rates);
                        $scope.rate = rates;
                    }
                    setFixed($scope.list_1);
                    setFixed($scope.list_2);
                    let rateDate = res.result[1][0].slice(2);
                    rateDate.map((v,i)=>{
                        rateDate[i]=v+"%"
                    })
                    let bussDate = res.result[1][1].slice(2);
                    let costDate = res.result[1][2].slice(2);
                    let contraDate = res.result[1][3].slice(2);
                    creatChart(rateDate,bussDate,costDate,contraDate);
                }
            })
        }
        function setFixed(list){
            list.map((v)=>{
                v.map((value,index)=>{
                    if(typeof value=="number"){
                        value=value.toFixed(2);
                    }
                    v[index]=value;
                })
            })
        }

        $scope.$on('nglistrepeatFinish', function (){
            $(".sensitivity .tables table tr td:nth-child(2)").hide();
        })
        getDate(-1);

        $scope.ok = ()=>{
            let rate = $(".sensitivity .changeRate>input").val();
            if(rate!=""){
                if(0<=parseFloat(rate)&&parseFloat(rate)<100){
                    if(rate!=$scope.rate){
                        $scope.rate=rate;
                        getDate(rate);
                    }
                }else{
                    $($event.target).val("")
                }
            }
        }

        $scope.change = ($event)=>{

        }
        function creatChart(rateDate,bussDate,costDate,contraDate){
            var myChart = echarts.init(document.getElementById('rateEchart'));
            let option = {
                title: {
                    text: '不确定因素对IRR(%税后)的影响',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['营业收入','经营成本','建设投资'],
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
                    data: rateDate
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name:'营业收入',
                        type:'line',
                        stack: '总量',
                        data:bussDate
                    },
                    {
                        name:'经营成本',
                        type:'line',
                        stack: '总量',
                        data:costDate
                    },
                    {
                        name:'建设投资',
                        type:'line',
                        stack: '总量',
                        data:contraDate
                    }
                ]
            };
            myChart.setOption(option);
        }
    }]);