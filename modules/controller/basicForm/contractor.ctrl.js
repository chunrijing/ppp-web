angular.module("core").controller('contractorCtrl', ['$scope', '$http','commonService','$uibModal','$window','$compile','$interval',
    function ($scope, $http, commonService,$uibModal,$window,$compile,$interval) {
        let info = $window.sessionStorage.getItem("info").split(",");
        $scope.projectId = parseInt(info[0]);
        $scope.schemeId = parseInt(info[1]);
        let height = $(window).height();
        $(".contractor").height(height*0.76-170);
        $(".contractor .conTop").height(height*0.76-270);

        commonService.getContractor(
            {
                "projectId": $scope.projectId,
                "schemeId": $scope.schemeId
            }
        ).then((res)=> {
            let parList = [];
            let list = [];
            let chilList = [];
            res.result.map(((item)=> {
                if (item.itemLevel == 1) {
                    parList.push(item);
                }else{
                    list.push(item);
                }
            }))
            parList.map((item)=> {
                item.list=[];
                list.map(((items)=> {
                    if (items.itemLevel == 2 && items.itemParentNum==item.itemNum) {
                        item.list.push(items);
                    }
                }))
            })
            parList.map((item,index)=>{
                let ratio = item.ratio==null?"":item.ratio;
                let ratios =item.ratio==null?"":item.ratio.toFixed(2);
                let html = `<tr defaultNum="${item.defaultNum}" data-id="${item.id}">
                    <td width="10%">${index+1}</td>
                    <td width="45%">${item.itemName}</td>
                    <td width="45%"><input type="number" min="0" max="100" set-focus value="${ratios}" data-num="${ratio}"></td>
                </tr>`
                let temp = $compile(html)($scope);
                angular.element($(".contractor table>tbody")).append(temp);
                item.list.map((items,indexs)=>{
                    let ratio = items.ratio==null?"":items.ratio;
                    let ratios =items.ratio==null?"":items.ratio.toFixed(2);
                    let html = `<tr defaultNum="${items.defaultNum}" data-id="${items.id}">
                    <td width="10%">${index+1}.${indexs+1}</td>
                    <td width="45%">${items.itemName}</td>
                    <td width="45%"><input type="number" min="0" max="100"
                    value="${ratios}" data-num="${ratio}" set-focus uib-tooltip="结算支付比例 > 竣工验收比例 > 工程进度款比例"
                    tooltip-trigger="'focus'" tooltip-placement="right" class="form-control"></td>
                </tr>`
                    let temp = $compile(html)($scope);
                    angular.element($(".contractor table>tbody")).append(temp);
                })
            })

            if($(".contractor .tableBody table").height()>$(".contractor .conTop").height()){
                $(".contractor .tableHead").css("paddingRight","6px");
            }
            $(".contractor tr").map((i,v)=>{
                if($(v).attr("defaultNum")=="1"||$(v).attr("defaultNum")=="6"){
                    $(v).find("td:last-child").addClass("line_add").empty();
                    $(v).find("td input").attr("readonly","readonly");
                    let html = `<span class='line'></span>`;
                    let temp = $compile(html)($scope);
                    angular.element($(v).find("td:last-child")).append(temp);
                }
                if($(v).attr("defaultNum")=="2"||$(v).attr("defaultNum")=="7"){
                    $(v).find("td input").attr("min","60");
                    $(v).find("td input").attr("max","90");
                }
                if($(v).attr("defaultNum")=="3"||$(v).attr("defaultNum")=="8"){
                    $(v).find("td input").attr("min","60");
                    $(v).find("td input").attr("max","100");
                }
                if($(v).attr("defaultNum")=="4"||$(v).attr("defaultNum")=="9"){
                    $(v).find("td input").attr("min","97");
                    $(v).find("td input").attr("max","100");
                }
                if($(v).attr("defaultNum")=="5"||$(v).attr("defaultNum")=="10"){
                    let num_5,_num_5,num_10,_num_10;
                    if($(v).attr("defaultNum")=="5"){
                        num_5 = $(v).find("td input").val();
                        _num_5 = $(v).find("td input").attr("data-num");
                        let html = `<input type="number" min="0" max="3"
                    value="${num_5}" data-num="${_num_5}" readonly="readonly" set-focus>`;
                        $(v).find("td input").remove();
                        let temp = $compile(html)($scope);
                        angular.element($(v).find("td:last-child")).append(temp);
                    }else{
                        num_10 = $(v).find("td input").val();
                        _num_10 = $(v).find("td input").attr("data-num");
                        let html = `<input type="number" min="0" max="3" ng-blur="audit($event)"
                    value="${num_10}" data-num="${_num_10}" readonly="readonly" set-focus>`;
                        $(v).find("td input").remove();
                        let temp = $compile(html)($scope);
                        angular.element($(v).find("td:last-child")).append(temp);
                    }
                }
            })
        })
    }]);