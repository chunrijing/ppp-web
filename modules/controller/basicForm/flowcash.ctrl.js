angular.module("core").controller('flowcashCtrl', ['$scope', '$http','commonService','$uibModal','$window','$compile','$interval',
    function ($scope, $http, commonService,$uibModal,$window,$compile,$interval) {
        let info = $window.sessionStorage.getItem("info").split(",");
        $scope.projectId = parseInt(info[0]);
        $scope.schemeId = parseInt(info[1]);

        commonService.getFlowcash($scope.schemeId).then((respon)=>{
            if(respon.result==null){
                window.id=null;
                $scope.estimateWay=1;
                $scope.costRatio = "";
                $scope.incomeRatio="";
                $scope.manualFill="";
                $scope.prepayments="";
                $scope.finishedGoods = "";
                $scope.sourceMaterial="";
                $scope.cash="";
                $scope.fuel="";
                $scope.productingGoods = "";
                $scope.accountsPayable="";
            }else{
                let res = respon.result;
                window.id=res.id;
                $scope.estimateWay=res.estimateWay;
                $scope.costRatios = res.costRatio==null?"":res.costRatio.toFixed(2);
                $scope.costRatio = res.costRatio;
                $scope.incomeRatio=res.incomeRatio==null?"":res.incomeRatio.toFixed(2);
                $scope.incomeRatios=res.incomeRatio;
                $scope.manualFill=res.manualFill==null?"":res.manualFill.toFixed(2);
                $scope.manualFills=res.manualFill;
                $scope.prepayments=res.prepayments;
                $scope.finishedGoods = res.finishedGoods;
                $scope.sourceMaterial=res.sourceMaterial;
                $scope.cash=res.cash;
                $scope.fuel=res.fuel;
                $scope.productingGoods = res.productingGoods;
                $scope.accountsPayable=res.accountsPayable;
            }
        })
        window.flowcashChange=true;;
        function getChange(){
            $(".flowcash input").change(function() {
                window.flowcashChange=true;
            });
        }

        $scope.select = ($event,num)=>{
            $scope.estimateWay=num;
            $(".flowcash .seleName").hide();
        }
        $scope.showHide = ($event)=>{
            $($event.target).siblings("div").toggle();
        }
        $("body").click(function (e) {
            if (!$(e.target).closest(".glyphicon").length) {
                $(".flowcash .seleName").hide();
            }
        });
        $scope.aduit = ($event,str)=>{
            let _this = $($event.target);
            let val = _this.val();
            let peopleNums =  _this.parents("tr").find("td:nth-child(3) input").val();
            let yearSalaryAvg =  _this.parents("tr").find("td:nth-child(4) input").attr("data-num");
            if(str=="people"){
                peopleNums=val;
            }else{
                yearSalaryAvg=val;
            }
            if(_this.val()==""||peopleNums==""||peopleNums==undefined||yearSalaryAvg==""||yearSalaryAvg==undefined){
                return;
            }else{
                let total = parseFloat(peopleNums)*parseFloat(yearSalaryAvg);
                _this.parents("tr").find("td:nth-child(6) input").attr("data-num",total);
                _this.parents("tr").find("td:nth-child(6) input").val(total.toFixed(2));
            }
        }

    }]);