angular.module("core").controller('salaryCtrl', ['$scope', '$http','commonService','$uibModal','$window','$compile','$interval',
    function ($scope, $http, commonService,$uibModal,$window,$compile,$interval) {
        let info = $window.sessionStorage.getItem("info").split(",");
        $scope.projectId = parseInt(info[0]);
        $scope.schemeId = parseInt(info[1]);
        let tId = $(".slider>ul>li:nth-child(5) ul li:nth-child(2)").attr("data-id");

        commonService.getSalary(
            {
                "projectId": $scope.projectId,
                "schemeId": $scope.schemeId
            }
        ).then((res)=>{
            res.result.map((item,index)=>{
                let yearSalaryAvg = item.yearSalaryAvg==null?"":item.yearSalaryAvg;
                let yearSalaryAvgs = item.yearSalaryAvg==null?"":item.yearSalaryAvg.toFixed(2);
                let welfare = item.welfare==null?"":item.welfare;
                let welfares = item.welfare==null?"":item.welfare.toFixed(2);
                let total = item.total==null?"":item.total;
                let totals = item.total==null?"":item.total.toFixed(2);
                let peopleNums = item.peopleNums==null?"":item.peopleNums;
                let costType;
                if(item.costType==null){
                    costType=""
                }else if(item.costType==1){
                    costType='可变成本'
                }else{
                    costType='固定成本'
                }
                let html = `<tr isDefault="${item.isDefault}" ng-click="click($event)" data-id="${item.id}">
                    <td>${index+1}</td>
                    <td><input type="text" maxlength="20" set-focus value="${item.employType}" readonly="readonly"></td>
                    <td class="amount"><input type="number" maxlength="8" min="0" ng-keyup="aduit($event,'people')" data-num="${peopleNums}" set-focus value="${peopleNums}"></td>
                    <td><input type="number" min="0" data-num="${yearSalaryAvg}" ng-keyup="aduit($event,'year')" set-focus value="${yearSalaryAvgs}"></td>
                    <td><input type="number" min="0" max="100" data-num="${welfare}" set-focus value="${welfares}"></td>
                    <td><input type="number" data-num="${total}" value="${totals}" readonly="readonly"></td>
                    <td class="selTd">
                        <input type="text" value="${costType}" data-num="${item.costType}" readonly="readonly">
                        <span ng-click="showHide($event)" class="glyphicon glyphicon-menu-down"></span>
                        <div class="seleName">
                            <option ng-click="select($event,1,'可变成本')">可变成本</option>
                            <option ng-click="select($event,2,'固定成本')">固定成本</option>
                        </div>
                    </td>
                </tr>`;
                let temp = $compile(html)($scope);
                angular.element($(".salary .body tbody")).append(temp);
                //getChange();
            })
            if($(".salary .body table").height()>320){
                $(".salary .head").css({"paddingRight":"26px"});
            }else{
                $(".salary .head").css({"paddingRight":"20px"});
            }
        })

        $scope.select = ($event,num,str)=>{
            $($event.target).parent().siblings("input").attr("data-num",num);
            $($event.target).parent().siblings("input").val(str);
            $($event.target).parent().siblings("input").removeClass("focused");
        }
        $scope.showHide = ($event)=>{
            $(".salary .seleName").hide();
            $($event.target).siblings("div").show();
        }
        $("body").click(function (e) {
            if (!$(e.target).closest(".glyphicon").length) {
                $(".salary .seleName").hide();
            }
        });
        $scope.click = (e)=>{
            let _this = $(e.target);
            $(".salary .body table tr").removeClass("inputClick");
            $(_this).parents("tr").addClass("inputClick");
            if($(_this).parents("tr").attr("isDefault")==1){
                $(".salary .deleLine").attr("disabled","disabled");
            }else{
                $(".salary .deleLine").removeAttr("disabled");
            }
        }
        function getReaDom(){
            let total = 0;
            let count = 0;
            let tabId = $(".basicForm .slider>ul>li:nth-child(5)>ul>li:nth-child(3)").attr("data-id");
            $(".materialsFuel .body tr input").map((index,value)=>{
                if($(value).attr("readonly")=="readonly"){
                    $(value).removeClass("focused");
                }else{
                    total+=1;
                    if($(value).val()!=""){
                        count+=1;
                    }
                }
            })
            saveStatal(total,count,parseInt(tabId));
            getParcent();
        }

        $scope.add = ()=>{
            $(".salary .body .addNew").removeClass("addNew");
            let length = $(".salary .body table tr").length;
            let html = `<tr class="addNew" ng-click="click($event)" isDefault="0">
                <td>${length+1}</td>
                <td><input type="text" maxlength="20" set-focus></td>
                <td class="amount"><input type="number" min="0" maxlength="8" ng-keyup="aduit($event,'people')" set-focus></td>
                <td><input type="number" min="0" ng-keyup="aduit($event,'year')" set-focus ></td>
                <td><input type="number" min="0" max="100" set-focus></td>
                <td><input type="number" readonly="readonly"></td>
                <td class="selTd">
                    <input type="text" readonly="readonly">
                    <span ng-click="showHide($event)" class="glyphicon glyphicon-menu-down"></span>
                    <div class="seleName">
                        <option ng-click="select($event,1,'可变成本')">可变成本</option>
                        <option ng-click="select($event,2,'固定成本')">固定成本</option>
                    </div>
                </td>
            </tr>`;
            let temp = $compile(html)($scope);
            angular.element($(".salary .body tbody")).append(temp);
            commonService.salary_addRow($scope.projectId,$scope.schemeId).then((res)=>{
                if(res.success==true){
                    $(".salary .addNew").attr("data-id",res.result);
                    getReaDom();
                }
            })
            if($(".salary .body table").height()>320){
                $(".salary .head").css({"paddingRight":"26px"});
            }else{
                $(".salary .head").css({"paddingRight":"20px"});
            }
        }
        $scope.delete = ()=>{
            let tr = $(".salary .body table tr");
            let id = $(".salary .inputClick").attr("data-id");
            if(tr.hasClass("inputClick")){
                commonService.materialsFuel_delRow(parseInt(id)).then((res)=>{
                    if(res.success==true){
                        $(".salary .inputClick").remove();
                        getReaDom();
                    }
                })
                tr = $(".salary .body table tr");
                tr.map((index,value)=>{
                    $(value).find("td:nth-child(1)").text(index+1);
                })
                if($(".salary .body table").height()>320){
                    $(".salary .head").css({"paddingRight":"26px"});
                }else{
                    $(".salary .head").css({"paddingRight":"20px"});
                }
            }else{
                alert("请选择删除行");
            }
        }
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