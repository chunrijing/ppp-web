angular.module("core").controller('basisCtrl', ['$scope', '$http','commonService','$uibModal','$window','$compile','$interval',
    function ($scope, $http, commonService,$uibModal,$window,$compile,$interval) {
        let info = $window.sessionStorage.getItem("info").split(",");
        $scope.projectId = parseInt(info[0]);
        $scope.schemeId = parseInt(info[1]);

        $scope.isOperation = false;
        $scope.selerefundMode = 1;

        //下拉切换处理
        function getName_projectOperation(){
            if($scope.seleprojectOperation==1){
                $scope.obj.projectOperation = "BOT";
            }else if($scope.seleprojectOperation==2){
                $scope.obj.projectOperation = "TOT";
            }else{
                $scope.obj.projectOperation = "BOOT(BOO)";
            }
        }
        function getName_projectReward(){
            if($scope.seleprojectReward==1){
                $scope.obj.projectReward="政府付费";
            }else if($scope.seleprojectReward==2){
                $scope.obj.projectReward = "使用者付费";
            }else {
                $scope.obj.projectReward = "可行性缺口补助";
            }
        }
        function getName_refundMode(){
            if($scope.selectrefundMode==1){
                $scope.obj.refundMode="等额本息";
            }else if($scope.selectrefundMode==2){
                $scope.obj.refundMode = "等额还本付息";
            }else if($scope.selectrefundMode==3){
                $scope.obj.refundMode = "先息后本";
            }else{
                $scope.obj.refundMode = "一次性偿还";
            }
        }
        function getName_depreciationType(){
            if($scope.depreciationType==1){
                $scope.obj.depreciationType="直线折旧";
            }else if($scope.depreciationType==2){
                $scope.obj.depreciationType = "双倍余额递减法";
            }else if($scope.depreciationType==3){
                $scope.obj.depreciationType = "年数总和法";
            }
        }
        $scope.obj = {
            //"baseBudgetAllowance": "",
            //"bondRate": "",
            "bottomRatio": "",
            "constructionRate": "",
            "incomeTaxRate": "",
            "legalRatio": "",
            "otherCost": "",
            "periodConstruction": "",
            "periodCooperation": "",
            "periodOptrationa": "",
            //"playbackAccrual": "",
            "playbackPeriod": "",
            "projectCapital": "",
            "projectId": $scope.projectId,
            "projectOperation": "",
            "projectReward": "",
            "randomRatio": "",
            "refundMode": "",
            "schemeId": $scope.schemeId,
            "shortLoanRate": "",
            "surplusRatios": "",
            //"upBudgetAllowance": "",
            "yieldRate": "",
            "depreciationType": ""
        }

        commonService.getBasic(
            {
                "projectId": $scope.projectId,
                "schemeId": $scope.schemeId
            }
        ).then((res)=>{
            if(res.result == null){
                $scope.obj.periodConstruction=3;
                $scope.obj.periodOptrationa=10;
                window.baseId = null;
                $scope.obj.incomeTaxRate = 25;
                $scope.seleprojectOperation=1;
                getName_projectOperation();
                $scope.seleprojectReward = 2;
                $scope.selectrefundMode=1;
                $scope.depreciationType=1;
                getName_projectReward();
                getName_refundMode();
                getName_depreciationType();
                $scope.obj.yieldRate=6;
                $scope.obj.legalRatio=10;
                $scope.obj.randomRatio=5;
                $scope.obj.projectCapital=20;
                $scope.obj.bottomRatio=30;
                $scope.obj.surplusRatios=80;
            }else{
                let result = res.result;
                window.baseId = result.baseId;
                $scope.obj.incomeTaxRate = (result.incomeTaxRate==null?"":result.incomeTaxRate);
                $scope.seleprojectOperation = (result.projectOperation==null?"":result.projectOperation);
                $scope.seleprojectReward = (result.projectReward==null?"":result.projectReward);
                $scope.selectrefundMode = (result.refundMode==null?"":result.refundMode);
                $scope.depreciationType = (result.depreciationType==null?"":result.depreciationType);
                getName_projectOperation();
                getName_projectReward();
                getName_refundMode();
                getName_depreciationType();
                $scope.obj.periodConstruction = (result.periodConstruction==null?"":result.periodConstruction);
                $scope.obj.projectCapital = (result.projectCapital==null?"":result.projectCapital);
                $scope.obj.bottomRatio = (result.bottomRatio==null?"":result.bottomRatio);
                $scope.obj.yieldRate =(result.yieldRate==null?"":result.yieldRate);
                $scope.obj.baseBudgetAllowance=(result.baseBudgetAllowance==null?"":result.baseBudgetAllowance);
                $scope.obj.bondRate=(result.bondRate==null?"":result.bondRate);
                $scope.obj.constructionRate=(result.constructionRate==null?"":result.constructionRate);
                $scope.obj.legalRatio=(result.legalRatio==null?"":result.legalRatio);
                $scope.obj.otherCost=(result.otherCost==null?"":result.otherCost);
                $scope.obj.periodOptrationa=(result.periodOptrationa==null?"":result.periodOptrationa);
                $scope.obj.playbackPeriod=(result.playbackPeriod==null?"":result.playbackPeriod);
                $scope.obj.randomRatio=(result.randomRatio==null?"":result.randomRatio);
                $scope.obj.shortLoanRate=(result.shortLoanRate==null?"":result.shortLoanRate);
                $scope.obj.surplusRatios=(result.surplusRatios==null?"":result.surplusRatios);
                $scope.obj.upBudgetAllowance=(result.upBudgetAllowance==null?"":result.upBudgetAllowance);
            }
            window.periodConstruction=$scope.obj.periodConstruction;
            window.periodOptrationa=$scope.obj.periodOptrationa;
            $(".basicForm .basic>table input").change(function() {
                window.baseChange=true;
            });
        })
        window.baseChange=false;

        $scope.showOrHide = ($event)=>{
            $(".basicForm .basic>table tr td:last-child>div").hide();
            $($event.target).siblings("div").show();
        }
        $("body").click(function (e) {
            if (!$(e.target).closest(".glyphicon").length) {
                $(".basicForm .basic>table tr td:last-child>div").hide();
            }
        });
        $scope.selectRate = ($event,rate)=>{
            if(rate!=$scope.obj.incomeTaxRate){
                window.baseChange=true;
            }
            $scope.obj.incomeTaxRate = rate;
            $($event.target).parent().hide();
        }
        $scope.selectOperation = ($event,opera,str)=>{
            if(str!=$scope.obj.projectOperation){
                window.baseChange=true;
            }
            $scope.seleprojectOperation = opera;
            $scope.obj.projectOperation = str;
            $($event.target).parent().hide();
        }
        $scope.selectReward = ($event,opera,str)=>{
            if(str!=$scope.obj.projectReward){
                window.baseChange=true;
            }
            $scope.objseleprojectReward = opera;
            $scope.obj.projectReward = str;
            $($event.target).parent().hide();
        }
        $scope.selectrefund = ($event,opera,str)=>{
            if(str!=$scope.obj.refundMode){
                window.baseChange=true;
            }
            $scope.selectrefundMode = opera;
            $scope.obj.refundMode = str;
            $($event.target).parent().hide();
        }
        $scope.selectreFixed = ($event,opera,str)=>{
            $scope.depreciationType = opera;
            $scope.obj.depreciationType = str;
            $($event.target).parent().hide();
        }
    }]);