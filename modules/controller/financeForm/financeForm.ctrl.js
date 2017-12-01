angular.module('core').controller('financeFormCtrl', ['$scope', '$http','$rootScope','commonService','$timeout','$compile','$state',"$stateParams","$window",
    function ($scope, $http,$rootScope,commonService,$timeout,$compile,$state,$stateParams,$window) {
        let urls = ApplicationConfiguration.urls.apiUrl;
        let info = $window.sessionStorage.getItem("info").split(",");
        let finaceId = $window.sessionStorage.getItem("finaceId");
        let finaceName = $window.sessionStorage.getItem("finaceName");
        $scope.proName = info[3];
        $scope.schemeName = info[2];
        $scope.projectId = parseInt(info[0]);
        $scope.schemeId = parseInt(info[1]);
        let height = $(window).height();
        $(".financeForm .slider").height(height-140);
        $(".financeForm .container").height(height-140);
        $(".financeForm .form").height(height-240);
        commonService.getNav("2").then((res)=>{
            $scope.financeNav = res.result;
        })
        $scope.$on('listrepeatFinish', function (){
            finaceId=finaceId==null?16:parseInt(finaceId);
            $scope.tId = finaceId;
            finaceName=finaceName==null?"建设投资估算表":finaceName;
            $scope.titleName=finaceName;
            if(finaceId>=16&&finaceId<=29||finaceId==42){
                $(".financeForm .slider>ul>li:first-child>ul").show();
                $timeout(()=>{
                    setglyphicon($(".financeForm .slider>ul>li:first-child>ul"));
                    let li = $('.financeForm .slider>ul>li>ul>li[data-id="'+finaceId+'"]');
                    li.addClass("navActive");
                },50)
            }else if(finaceId>=31&&finaceId<=38){
                $(".financeForm .slider>ul>li:nth-child(2)>ul").show();
                $timeout(()=>{
                    setglyphicon($(".financeForm .slider>ul>li:nth-child(2)>ul"));
                    let li = $('.financeForm .slider>ul>li>ul>li[data-id="'+finaceId+'"]');
                    li.addClass("navActive");
                },50)
            }else{
                $timeout(()=>{
                    let div = $('.financeForm .slider>ul>li>div[data-id="'+finaceId+'"]');
                    div.addClass("navActive");
                },50)
            }
        })

        $scope.seletForm = ($event,tId,tName)=>{
            $scope.tId = tId;
            $scope.titleName=tName;
            let _this = $event.target;
            if(_this.nodeName=="LI"){
                $(_this).parent("ul").find("li").removeClass("navActive");
                $(_this).addClass("navActive");
            }else{
                $(".financeForm .slider").find(".glyphicon").css("transform","rotate(0deg)");
                let isChild = $(_this).parents("li").find("div").attr("isChild");
                $(_this).parents("li").siblings().find("div").removeClass("navActive");
                $(_this).parents("li").siblings().find("ul").hide();
                if(isChild!=""){
                    let name = $(_this).parents("li").find("ul li:first-child").attr("data-name");
                    let id = parseInt($(_this).parents("li").find("ul li:first-child").attr("data-id"));
                    $scope.titleName=name;
                    $scope.tId=id;
                    $(_this).parents("li").find("ul").show();
                    $(_this).parents("li").find("ul li").removeClass("navActive");
                    $(_this).parents("li").find("ul li:first-child").addClass("navActive");
                    setglyphicon($(_this).parents("li").find("ul"));
                }else{
                    $(_this).parents("li").find("div").addClass("navActive");
                }
            }
            $window.sessionStorage.setItem("finaceId",$scope.tId);
            $window.sessionStorage.setItem("finaceName",$scope.titleName);
            console.log($window.sessionStorage.getItem("finaceId"))
        }

        function setglyphicon(ul){
            if(ul.css("display")=="block"){
                $(".financeForm .slider").find(".glyphicon").css("transform","rotate(0deg)");
                ul.parent("li").find(".glyphicon").css("transform","rotate(180deg)");
            }else{
                ul.siblings("div").find(".glyphicon").css("transform","rotate(0deg)");
            }
        }
        //导出Excel
        $scope.exportExcel=()=>{
            if($scope.tId==16){
                window.location.href=urls+"rinvest/downLoad/"+$scope.schemeId;
            }
            if($scope.tId==17){
                window.location.href=urls+"rmaterials/downLoad/"+$scope.schemeId;
            }
            if($scope.tId==18){
                window.location.href=urls+"rmaterialsfuel/downLoad/"+$scope.schemeId;
            }
            if($scope.tId==19){
                window.location.href=urls+"rsalary/downLoad/"+$scope.schemeId;
            }
            if($scope.tId==20){
                window.location.href=urls+"rincometax/downLoad/"+$scope.schemeId;
            }
            if($scope.tId==21){
                window.location.href=urls+"rflowCash/downLoad/"+$scope.schemeId;
            }
            if($scope.tId==22){
                window.location.href=urls+"rplanfinancing/downLoad/"+$scope.schemeId;
            }
            if($scope.tId==23){
                window.location.href=urls+"rinterest/downLoad/"+$scope.schemeId;
            }
            if($scope.tId==24){
                window.location.href=urls+"rRlanContractor/downLoad/"+$scope.schemeId;
            }
            if($scope.tId==25){
                window.location.href=urls+"rassetstype/downLoad/"+$scope.schemeId;
            }
            if($scope.tId==26){
                window.location.href=urls+"rborrowRepay/downLoad/"+$scope.schemeId;
            }
            if($scope.tId==27){
                window.location.href=urls+"avtcontractor/downLoad/"+$scope.schemeId;
            }
            if($scope.tId==28){
                window.location.href=urls+"amortize/downLoad/"+$scope.schemeId;
            }
            if($scope.tId==29){
                window.location.href=urls+"rTotalCost/downLoad/"+$scope.schemeId;
            }
            if($scope.tId==42){
                window.location.href=urls+"rDepriciationx/downLoad/"+$scope.schemeId;
            }
            /*财务报表*/
            if($scope.tId==31){
                window.location.href=urls+"rprofits/downLoad/"+$scope.schemeId;
            }
            if($scope.tId==32){
                window.location.href=urls+"rinvestCashFlow/downLoad/"+$scope.schemeId;
            }
            if($scope.tId==33){
                window.location.href=urls+"rcapitalcashflow/downLoad/"+$scope.schemeId;
            }
            if($scope.tId==34){
                window.location.href=urls+"rfinancialCash/get/downLoad/"+$scope.schemeId;
            }
            if($scope.tId==35){
                window.location.href=urls+"rBalanceSheet/downLoad/"+$scope.schemeId;
            }
            if($scope.tId==36){
                window.location.href=urls+"rPrivateInvestFlow/downLoad/"+$scope.schemeId;
            }
            if($scope.tId==37){
                window.location.href=urls+"rDebtGather/downLoad/"+$scope.schemeId;
            }
            if($scope.tId==38){
                window.location.href=urls+"rFinanceGather/downLoad/"+$scope.schemeId;
            }
            if($scope.tId==39){
                window.location.href=urls+"sensitivity/downLoad/"+$scope.schemeId;
            }
            if($scope.tId==40){
                window.location.href=urls+"balance/downLoad/"+$scope.schemeId;
            }

        }

    }]);