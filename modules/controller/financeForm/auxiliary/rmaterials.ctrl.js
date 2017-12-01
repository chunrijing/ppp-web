angular.module('core').controller('rmaterialsCtrl', ['$scope', '$http','$rootScope','commonService','$timeout','$compile','$state',"$stateParams","$window",
    function ($scope, $http,$rootScope,commonService,$timeout,$compile,$state,$stateParams,$window) {
        let info = $window.sessionStorage.getItem("info").split(",");
        $scope.projectId = parseInt(info[0]);
        $scope.schemeId = parseInt(info[1]);
        let height = $(window).height();
        $(".rmaterials").height(height-250);
        $(".rmaterialsfuel").height(height-250);
        $(".rincometax").height(height-250);
        $(".rflowCash").height(height-250);
        $(".rplanfinancing").height(height-250);
        $(".rinterest").height(height-250);
        $(".rRlanContractor").height(height-250);
        $(".rassetstype").height(height-250);
        $(".rborrowRepay").height(height-250);
        $(".avtcontractor").height(height-250);
        $(".amortize").height(height-250);
        $(".rTotalCost").height(height-250);
        $(".rprofits").height(height-250);
        $(".rinvestCashFlow").height(height-250);
        $(".rcapitalcashflow").height(height-250);
        $(".rfinancialCash").height(height-250);
        $(".rBalanceSheet").height(height-250);
        $(".rPrivateInvestFlow").height(height-250);
        $(".rDebtGather").height(height-250);
        $(".rFinanceGather").height(height-250);
        $(".rDepriciationx").height(height-250);

        /*辅助报表*/

        //外购原材料估算表
        if($(".rmaterials").length==1){
            getHtml(commonService.getRaterials,3);
        }
        //外购燃料和动力费估算表
        if($(".rmaterialsfuel").length==1){
            getHtml(commonService.getRMaterFuels,3);
        }
        //营业收入、附加税金
        if($(".rincometax").length==1){
            getHtml(commonService.getRincometax,3);
        }
        //流动资金
        if($(".rflowCash").length==1){
            getHtml(commonService.getRFlowCash,4,"rflowCash");
        }
        //项目总投资
        if($(".rplanfinancing").length==1){
            getHtml(commonService.getRplanfinancing,3);
        }
        //建设期利息估算表
        if($(".rinterest").length==1){
            getHtml(commonService.getRinterest,3,"rinterest");
        }
        //总包方建安支付报表
        if($(".rRlanContractor").length==1){
            getHtml(commonService.gerRPlanContractor,3,"rRlanContractor");
        }
        //资产分类财务辅助报表
        if($(".rassetstype").length==1){
            getHtml(commonService.gerRassetstype,3);
        }
        //资产分类财务辅助报表
        if($(".rborrowRepay").length==1){
            getHtml(commonService.gerRborrowRepay,3);
        }
        //资产分类财务辅助报表
        if($(".avtcontractor").length==1){
            getHtml(commonService.gerAvtcontractor,3,"avtcontractor");
        }
        //资产分类财务辅助报表
        if($(".amortize").length==1){
            getHtml(commonService.gerAmortize,4);
        }
        //4总成本报表
        if($(".rTotalCost").length==1){
            getHtml(commonService.gerRTotalCost,3);
        }
        //固定资产折旧报表
        if($(".rDepriciationx").length==1){
            getHtml(commonService.findRDepriciationx,5,"rDepriciationx")
        }

        /*财务报表*/

        //8利润与利润分配表
        if($(".rprofits").length==1){
            getHtml(commonService.gerRprofits,3);
        }
        //项目投资现金流量表
        if($(".rinvestCashFlow").length==1){
            getHtml(commonService.gerRinvestCashFlow,3);
        }
        //10项目资本金现金流量表
        if($(".rcapitalcashflow").length==1){
            getHtml(commonService.gerRcapitalcashflow,3);
        }
        //13财务计划现金流量表
        if($(".rfinancialCash").length==1){
            getHtml(commonService.gerRfinancialCash,3);
        }
        //14资产负债表
        if($(".rBalanceSheet").length==1){
            getHtml(commonService.gerRBalanceSheet,3);
        }
        //11社会资本方投资现金流量表
        if($(".rPrivateInvestFlow").length==1){
            getHtml(commonService.gerRPrivateInvestFlow,3);
        }
        //各年偿债能力指标汇总表
        if($(".rDebtGather").length==1){
            getHtml(commonService.gerRDebtGather,2);
        }
        //财务指标分析汇总表
        if($(".rFinanceGather").length==1){
            getHtml(commonService.gerRFinanceGather,4,"rFinanceGather");
        }

        function getHtml(http,num,str){
            http($scope.schemeId,$scope.projectId).then((respon)=>{
                if(respon.success==false){
                    return
                }
                if(str=="rflowCash"){
                    $scope.way = respon.result.mateWay;
                    $scope.list = respon.result.obj;
                    if($scope.way==1){
                        num= 4;
                    }else{
                        num=3;
                        $(".rflowCash .tableAuto").css("paddingLeft","363px");
                    }
                }else if(str=="rDepriciationx"){
                    $scope.list=respon.result;
                    $(".rDepriciationx .tableAuto").css("paddingLeft","565px");
                }else{
                    $scope.list=respon.result;
                }
                commonService.getPeriod($scope.schemeId).then((res)=>{
                    /*if(res.success==false){
                        return
                    }*/
                    let respons = res.result;
                    //建设期
                    if(str=="rinterest"){
                        $scope.periodOptrationa=0;
                    }else if(str=="rRlanContractor"||str=="avtcontractor"){
                        $scope.periodOptrationa=2;
                    }else{
                        //运营期
                        $scope.periodOptrationa=respons.periodOptrationa;
                    }
                    $scope.periodConstruction =respons.periodConstruction;
                    let count = $scope.periodConstruction+$scope.periodOptrationa;
                    $scope.count=count;
                    $(".tableAuto thead tr:last-child").empty();

                    //表头分年投资拼接
                    for(let i=0;i<count;i++){
                        let html = `<th>${i+1}</th>`;
                        let temp = $compile(html)($scope);
                        angular.element($(".tableAuto thead tr:last-child")).append(temp);
                    }

                    let fixedList = [];
                    let autoList = [];
                    if($scope.list==undefined||$scope.list==undefined){
                        return
                    }
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
                    ftrs.empty();
                    atrs.empty();
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
                    if(str=='rFinanceGather'){
                        $('.rFinanceGather .table_fixed tbody tr').map((index,value)=>{
                            if($(value).find("td:first-child input").val()=='1'||$(value).find("td:first-child input").val()=='2'){
                                $(value).find("td:first-child").css({'fontWeight': 'bold'});
                                $(value).find("td:nth-child(2)").css({'fontWeight': 'bold'});
                            }
                        })
                    }
                })
            })
        }

    }]);