angular.module("core").controller('depriciationxCtrl', ['$scope', '$http','commonService','$uibModal','$window','$compile','$interval','$timeout',
    function ($scope, $http, commonService,$uibModal,$window,$compile,$interval,$timeout) {
        let info = $window.sessionStorage.getItem("info").split(",");
        $scope.projectId = parseInt(info[0]);
        $scope.schemeId = parseInt(info[1]);
        let tId = $(".slider>ul>li:nth-child(6)").attr("data-id");
        let height = $(window).height();
        $(".depriciationx .tableCon").height(height*0.76-290);
        $(".depriciationx .body").height(height*0.76-360);
        commonService.getPeriod($scope.schemeId).then((res)=>{
            $scope.periodOptrationa = res.result.periodOptrationa;
            let arr=[];
            for(let i=1;i<=$scope.periodOptrationa;i++){
                $scope._periodOptrationa = arr.push(i)
            }

            commonService.findInvestment($scope.schemeId).then((res)=>{
                if(res.success==false){
                    return
                }
                res.result.map((item)=>{
                    let html = `<tr class="add" data-id="${item.id}" ng-click="click($event)">
                    <td width="30%"><input type="text" value="${item.itemName==''?'':item.itemName}"></td>
                        <td width="10%" class="amount"><input type="number" value="${item.depbYear==null?'1':item.depbYear}" data-num="${item.depbYear==null?'1':item.depbYear}"  min="0" set-focus></td>
                        <td width="20%"><input type="number" value="${item.rate==null?'':item.rate.toFixed(2)}" data-num="${item.rate==null?'':item.rate}"  min="0" max="100" set-focus></td>
                        <td width="20%" class="selTd">
                            <input type="number" value="${item.yyqYear==null?'':item.yyqYear}" data-num="${item.yyqYear==null?'':item.yyqYear}" readonly="readonly">
                            <span ng-click="showHide($event)" class="glyphicon glyphicon-menu-down"></span>
                            <div class="seleName scrollbars">
                            </div>
                        </td>
                        <td width="20%"><input type="number" value="${item.assetSum==null?'':item.assetSum.toFixed(2)}" data-num="${item.assetSum==null?'':item.assetSum}" min="0" set-focus></td>
                </tr>`;
                    let temp = $compile(html)($scope);
                    angular.element($(".depriciationx .body tbody")).append(temp);
                })
                $(".depriciationx .body tbody tr").map((index,value)=>{
                    let _html="";
                    for(let i=1;i<=$scope.periodOptrationa;i++){
                        _html = _html+` <option ng-click="select($event,${i})">${i}</option>`;
                    }
                    let _temp = $compile(_html)($scope);
                    angular.element($(value).find(".seleName")).append(_temp);
                })
                setPd();
            })
        })

        $scope.completeRepeat = ()=>{

        }
        function getReaDom(){
            let total = 0;
            let count = 0;
            let tabId = $(".basicForm .slider>ul>li:nth-child(7)>div").attr("data-id");
            $(".depriciationx input").map((index,value)=>{
                if($(value).attr("readonly")!="readonly"){
                    total+=1;
                    if($(value).val()!=""){
                        count+=1;
                    }
                }
            })
            saveStatal(total,count,parseInt(tabId));
            getParcent();
        }

        $scope.showHide = ($event)=>{
            $(".depriciationx .seleName").hide();
            $($event.target).siblings("div").show();
            setPd();
        }
        $("body").click(function (e) {
            if (!$(e.target).closest(".glyphicon").length) {
                $(".depriciationx .seleName").hide();
            }
        });

        function setPd(){
            let investTableBody_height = $(".depriciationx .body>table").height();
            let formTable_height = $(".depriciationx .body").height();
            if(investTableBody_height>formTable_height){
                $(".depriciationx .head").css("paddingRight","26px");
            }else{
                $(".depriciationx .head").css("paddingRight","20px")
            }
        }

        $scope.add = ()=>{
            $(".depriciationx .body tr").removeClass("add");
            commonService.investment_addRow($scope.projectId,$scope.schemeId).then((res)=>{
                if(res.success==true){
                    let html = `<tr class="add" ng-click="click($event)">
                        <td width="30%"><input type="text"></td>
                        <td width="10%" class="amount"><input type="number" value="" data-num="" min="0" set-focus></td>
                        <td width="20%"><input type="number" value="" data-num="" min="0" max="100" set-focus></td>
                        <td width="20%" class="selTd">
                            <input type="number" value="1" readonly="readonly">
                            <span ng-click="showHide($event)" class="glyphicon glyphicon-menu-down"></span>
                            <div class="seleName scrollbars">
                            </div>
                        </td>
                        <td width="20%"><input type="number" min="0" set-focus></td>
                    </tr>`;
                    let temp = $compile(html)($scope);
                    let _html="";
                    angular.element($(".depriciationx .body tbody")).append(temp);
                    for(let i=1;i<=$scope.periodOptrationa;i++){
                        _html = _html+` <option ng-click="select($event,${i})">${i}</option>`;
                    }
                    let _temp = $compile(_html)($scope);
                    angular.element($(".depriciationx .body .add .seleName")).append(_temp);
                    $(".depriciationx .add").attr("data-id", res.result);
                    getReaDom();
                    setPd();
                }
            })
        }

        $scope.delete = ()=>{
            let tr = $(".depriciationx .body table tr");
            if(tr.hasClass("inputClick")){
                let id = parseInt($(".depriciationx .body table .inputClick").attr("data-id"));
                commonService.investment_delRow(id).then((res)=>{
                    if(res.success==true){
                        $(".depriciationx .body table .inputClick").remove();
                        getReaDom();
                        setPd();
                    }
                })
            }else{
                alert("请选择删除行");
            }
        }
        $scope.select = ($event,num)=>{
            $($event.target).parent().siblings("input").attr("data-num",num);
            $($event.target).parent().siblings("input").val(num);
            $($event.target).parent().siblings("input").removeClass("focused");
        }
        $scope.click = (e)=>{
            let _this = $(e.target);
            $(".depriciationx .body table tr").removeClass("inputClick");
            $(e.target).parents("tr").addClass("inputClick");
        }
    }]);
