angular.module("core").controller('materialsAuxCtrl', ['$scope', '$http','commonService','$uibModal','$window','$compile','$interval',
    function ($scope, $http, commonService,$uibModal,$window,$compile,$interval) {
        let info = $window.sessionStorage.getItem("info").split(",");
        $scope.projectId = parseInt(info[0]);
        $scope.schemeId = parseInt(info[1]);
        let tId = $(".slider>ul>li:nth-child(5) ul li:nth-child(2)").attr("data-id");
        let height = $(window).height();
        $(".materialsAux").height(height*0.76-130);
        $(".materialsAux .tableCon").height(height*0.76-320);
        $(".materialsAux .tableCon .body").height(height*0.76-350);
        function setHeigth(){
            if($(".materialsAux .body table").height()>$(".materialsAux .body").height()){
                $(".materialsAux .head").css({"paddingRight":"26px"});
            }else{
                $(".materialsAux .head").css({"paddingRight":"20px"});
            }
        }

        commonService.findTaxSys(parseFloat(tId),$scope.schemeId).then((res)=>{
            if(res.result==null){
                $scope.taxType = 1;
            }else {
                $scope.taxType = res.result.taxType;
            }
            commonService.getMaterialsAux(
                {
                    "projectId": $scope.projectId,
                    "schemeId": $scope.schemeId
                }
            ).then((res)=>{
                let list = res.result;
                list.map((item,index)=>{
                    let addTax=item.addTax==null?"":item.addTax;
                    let addTaxs=item.addTax==null?"":item.addTax.toFixed(2);
                    let taxCost=item.taxCost==null?"":item.taxCost;
                    let taxCosts=item.taxCost==null?"":item.taxCost.toFixed(2);
                    let unTaxCost=item.unTaxCost==null?"":item.unTaxCost;
                    let unTaxCosts=item.unTaxCost==null?"":item.unTaxCost.toFixed(2);
                    let html = `<tr isDefault="${item.isDefault}" defaultNum="${item.defaultNum}" ng-click="click($event)">
                        <td width="10%">${index+1}</td>
                        <td width="30%"><input maxlength="20" readonly="readonly" type="text" set-focus value=${item.auxName}></td>
                        <td width="20%" class="selTd">
                            <input type="number" min="0" max="99.9999" data-num="${addTax}" ng-keyup="aduitTax($event,'增值税')" set-focus value=${addTaxs}>
                            <span ng-click="showHide($event)" class="glyphicon glyphicon-menu-down"></span>
                            <div class="seleName">
                                <option ng-click="selectAdd($event,0)">0</option>
                                <option ng-click="selectAdd($event,6)">6</option>
                                <option ng-click="selectAdd($event,11)">11</option>
                                <option ng-click="selectAdd($event,17)">17</option>
                            </div>
                        </td>
                        <td width="20%"><input type="number" min="0" data-num="${taxCosts}" ng-keyup="aduitTax($event,'含税')" set-focus value=${taxCosts}></td>
                        <td width="20%"><input type="number" min="0" data-num="${unTaxCost}" ng-keyup="aduitTax($event,'不含税')" set-focus value=${unTaxCosts}></td>
                    </tr>`;
                    let temp = $compile(html)($scope);
                    angular.element($(".materialsAux .body tbody")).append(temp);
                    getChange();
                })
                setHeigth();
                setTaxType();
            })
        })
        window.materialsAuxChange=false;
        function getChange(){
            $(".materialsAux .body tbody input").change(function() {
                window.materialsAuxChange=true;
            });
        }
        $scope.add = ()=>{
            let length = $(".materialsAux .body table tr").length;
            let html = `<tr ng-click="click($event)">
                <td width="10%">${length+1}</td>
                <td width="30%"><input type="text" maxlength="20" set-focus></td>
                <td width="20%" class="selTd">
                    <input type="number" min="0" max="99.9999" ng-keyup="aduitTax($event,'增值税')" set-focus>
                    <span ng-click="showHide($event)" class="glyphicon glyphicon-menu-down"></span>
                    <div class="seleName">
                        <option ng-click="selectAdd($event,0)">0</option>
                        <option ng-click="selectAdd($event,6)">6</option>
                        <option ng-click="selectAdd($event,11)">11</option>
                        <option ng-click="selectAdd($event,17)">17</option>
                    </div>
                </td>
                <td width="20%"><input type="number" min="0" ng-keyup="aduitTax($event,'含税')" set-focus></td>
                <td width="20%"><input type="number" min="0" ng-keyup="aduitTax($event,'不含税')" set-focus></td>
            </tr>`;
            let temp = $compile(html)($scope);
            angular.element($(".materialsAux .body tbody")).append(temp);
            setHeigth();
            setTaxType();
            window.materialsAuxChange=true;
        }
        $scope.delete = ()=>{
            let tr = $(".materialsAux .body table tr");
            if(tr.hasClass("inputClick")){
                tr.map((index,value)=>{
                    if($(value).hasClass("inputClick")){
                        $(value).remove();
                    }
                })
                tr = $(".materialsAux .body table tr");
                tr.map((index,value)=>{
                    $(value).find("td:nth-child(1)").text(index+1);
                })
                setHeigth();
                window.materialsAuxChange=true;
            }else{
                alert("请选择删除行");
            }
        }
        $scope.showHide = ($event)=>{
            $(".materialsAux .seleName").hide();
            $($event.target).siblings("div").show();
        }
        $("body").click(function (e) {
            if (!$(e.target).closest(".glyphicon").length) {
                $(".materialsAux .seleName").hide();
            }
        });
        $scope.click = (e)=>{
            let _this = $(e.target);
            $(".materialsAux .body table tr").removeClass("inputClick");
            $(_this).parents("tr").addClass("inputClick");
            if($(_this).parents("tr").attr("isDefault")!=0) {
                $(".materialsAux .delete").attr("disabled","disabled");
            }else{
                $(".materialsAux .delete").removeAttr("disabled");
            }
        }
        function setTaxType(){
            if($scope.taxType==0){//含税
                $(".materialsAux .body tr td:nth-child(4) input").removeAttr("readonly").removeClass("readonlyStyle");
                $(".materialsAux .body tr td:nth-child(5) input").attr("readonly","readonly").addClass("readonlyStyle");
            }else{
                $(".materialsAux .body tr td:nth-child(5) input").removeAttr("readonly").removeClass("readonlyStyle");
                $(".materialsAux .body tr td:nth-child(4) input").attr("readonly","readonly").addClass("readonlyStyle");
            }
        }
        //价格体系、单位
        $scope.selectTax = (num)=>{
            $scope.taxType = num;
            setTaxType();
        }
        //增值税下拉选择
        $scope.selectAdd = ($event,num)=>{
            window.materialsAuxChange=true;
            let _this = $($event.target);
            _this.parent().siblings("input").removeClass("focused");
            _this.parent().siblings("input").attr("data-num",num);
            _this.parent().siblings("input").val(num.toFixed(2));
            let addTax = num;
            let hTax =  _this.parents("tr").find("td:nth-child(4) input").attr("data-num");
            let nTax =  _this.parents("tr").find("td:nth-child(5) input").attr("data-num");
            if($scope.taxType == 1){
                //含税费用
                if(nTax!=undefined&&nTax!=""){
                    let value = nTax*(1+parseFloat(addTax)/100);
                    _this.parents("tr").find("td:nth-child(4) input").attr("data-num",value);
                    _this.parents("tr").find("td:nth-child(4) input").val(value.toFixed(2));
                }
            }else{
                if(hTax!=undefined&&hTax!=""){
                    let value = hTax/(1+parseFloat(addTax)/100);
                    _this.parents("tr").find("td:nth-child(5) input").attr("data-num",value);
                    _this.parents("tr").find("td:nth-child(5) input").val(value.toFixed(2));
                }
            }
        }

        //计算营业收入键盘事件
        $scope.aduitTax = ($event,str)=>{
            let _this = $($event.target);
            let val = _this.val();
            let hTax =  _this.parents("tr").find("td:nth-child(4) input").attr("data-num");
            let nTax =  _this.parents("tr").find("td:nth-child(5) input").attr("data-num");
            //增值税
            let addTax = _this.parents("tr").find("td:nth-child(3) input").attr("data-num");
            if(str=="增值税"){
                addTax = val;
            }
            if(str=="含税"){
                hTax = val;
            }
            if(str=="不含税"){
                nTax = val;
            }
            if(_this.attr("readonly")=="readonly"){
                return;
            }
            if(val==""||addTax==undefined||addTax==""){
                return;
            }
            //不含税 不含税费用=含税费用/（1+税率）
            if($scope.taxType == 1){
                //含税费用
                if(nTax!=undefined&&nTax!=""){
                    let value = nTax*(1+parseFloat(addTax)/100);
                    _this.parents("tr").find("td:nth-child(4) input").attr("data-num",value);
                    _this.parents("tr").find("td:nth-child(4) input").val(value.toFixed(2));
                }
            }else{
                if(hTax!=undefined&&hTax!=""){
                    let value = hTax/(1+parseFloat(addTax)/100);
                    _this.parents("tr").find("td:nth-child(5) input").attr("data-num",value);
                    _this.parents("tr").find("td:nth-child(5) input").val(value.toFixed(2));
                }
            }
        }
        function setTotal(){
            let values=0;
            $(".materialsAux .body table tr:not(.total) td:last-child").map((index,value)=>{
                let val = $(value).find("input").attr("data-num");
                val = (isNaN(val)||val==undefined)?0 : parseFloat(val);
                values+=parseFloat(val);
            })
            $(".materialsAux .body table tr:last-child td:last-child").attr("data-num",values);
            $(".materialsAux .body table tr:last-child td:last-child").text(values.toFixed(2));
        }
    }]);