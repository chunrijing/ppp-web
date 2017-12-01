angular.module("core").controller('materialsCtr', ['$scope', '$http','commonService','$uibModal','$window','$compile','$interval',
    function ($scope, $http, commonService,$uibModal,$window,$compile,$interval) {
        let info = $window.sessionStorage.getItem("info").split(",");
        $scope.projectId = parseInt(info[0]);
        $scope.schemeId = parseInt(info[1]);
        let tId = $(".slider>ul>li:nth-child(5) ul li:nth-child(1)").attr("data-id");
        let height = $(window).height();
        $(".materials").height(height*0.76-130);
        $(".materials .tableCon").height(height*0.76-320);
        $(".materials .tableCon .body").height(height*0.76-350);
        function setHeigth(){
            if($(".materials .body table").height()>$(".materials .body").height()){
                $(".materials .head").css({"paddingRight":"26px"});
            }else{
                $(".materials .head").css({"paddingRight":"20px"});
            }
        }

        commonService.findTaxSys(parseFloat(tId),$scope.schemeId).then((res)=>{
            if(res.result==null){
                $scope.taxType = 1;
                $scope.unitType = 0;
            }else {
                $scope.taxType = res.result.taxType;
                $scope.unitType = res.result.unitType;
            }
            commonService.getMaterials(
                {
                    "projectId": $scope.projectId,
                    "schemeId": $scope.schemeId
                }
            ).then((res)=>{
                let list = res.result;
                list.map((item,index)=>{
                    let matAmount=item.matAmount==null?"":item.matAmount;
                    let amountUnit=item.amountUnit==null?"":item.amountUnit;
                    let addTax=item.addTax==null?"":item.addTax;
                    let addTaxs=item.addTax==null?"":item.addTax.toFixed(2);
                    let taxPrice=item.taxPrice==null?"":item.taxPrice;
                    let taxPrices=item.taxPrice==null?"":item.taxPrice.toFixed(2);
                    let ntaxPrice=item.unTaxPrice==null?"":item.unTaxPrice;
                    let ntaxPrices=item.unTaxPrice==null?"":item.unTaxPrice.toFixed(2);
                    let cost=item.cost==null?"":item.cost;
                    let costs=item.cost==null?"":item.cost.toFixed(2);
                    let html = `<tr ng-click="click($event)" data-id="${item.id}">
                <td width="8%">${index+1}</td>
                <td width="20%"><input type="text" maxlength="20" set-focus value="${item.matName==null?"":item.matName}"></td>
                <td width="12%" class="amount"><input type="number" min="1" ng-keyup="aduitTax($event,'数量')" set-focus value="${matAmount}"></td>
                <td width="12%" class="selTd">
                    <input type="text" maxlength="10" onkeyup="this.value=this.value.replace(/[^\a-zA-Z\u4E00-\u9FA5]/g,'')" set-focus value="${amountUnit}">
                </td>
                <td width="12%" class="selTd">
                    <input type="number" min="0" max="99.9999" data-num="${addTax}" ng-keyup="aduitTax($event,'增值税')" set-focus value="${addTaxs}">
                    <span ng-show="${item.addTax!=null}" ng-click="showHide($event)" class="glyphicon glyphicon-menu-down"></span>
                    <div class="seleName">
                        <option ng-click="selectAdd($event,0)">0</option>
                        <option ng-click="selectAdd($event,6)">6</option>
                        <option ng-click="selectAdd($event,11)">11</option>
                        <option ng-click="selectAdd($event,17)">17</option>
                    </div>
                </td>
                <td width="12%"><input type="number" min="0" data-num="${taxPrice}" ng-keyup="aduitTax($event,'含税')" set-focus value="${taxPrices}"></td>
                <td width="12%"><input type="number" min="0" data-num="${ntaxPrice}" ng-keyup="aduitTax($event,'不含税')" set-focus value="${ntaxPrices}"></td>
                <td width="12%"><input type="number" min="0" data-num="${cost}" readonly="readonly" set-focus value="${costs}"></td>
            </tr>`;
                    let temp = $compile(html)($scope);
                    angular.element($(".materials .body tbody .total")).before(temp);
                })
                let tr = $(".materials .body table tr");
                let length = tr.length;
                $(".materials .total>td:nth-child(1)").text(length);
                setHeigth();
                setTotal();
                setTaxType();
                getChange();
            })
        })
        window.materialsChange=false;
        function getChange(){
            $(".materials .body tbody input").change(function() {
                window.materialsChange=true;
            });
        }

        function getReaDom(){
            let total = 0;
            let count = 0;
            let tabId = $(".slider>ul>li:nth-child(5) ul li:nth-child(1)").attr("data-id");
            $(".materials .body tr:not(.total) input").map((index,value)=>{
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
            $(".materials .body table tr").removeClass("add");
            let tr = $(".materials .body table tr");
            let length = tr.length;
            let html = `<tr ng-click="click($event)" class="add">
                <td width="8%">${length}</td>
                <td width="20%"><input type="text" maxlength="20" set-focus></td>
                <td width="12%" class="amount"><input type="number" min="1" ng-keyup="aduitTax($event,'数量')" set-focus></td>
                <td width="12%" class="selTd">
                    <input type="text" maxlength="10"  onkeyup="this.value=this.value.replace(/[^\a-zA-Z\u4E00-\u9FA5]/g,'')" set-focus>
                </td>
                <td width="12%" class="selTd">
                    <input type="number" min="0" max="99.9999" ng-keyup="aduitTax($event,'增值税')" set-focus>
                    <span ng-click="showHide($event)" class="glyphicon glyphicon-menu-down"></span>
                    <div class="seleName">
                        <option ng-click="selectAdd($event,0)">0</option>
                        <option ng-click="selectAdd($event,6)">6</option>
                        <option ng-click="selectAdd($event,11)">11</option>
                        <option ng-click="selectAdd($event,17)">17</option>
                    </div>
                </td>
                <td width="12%"><input type="number" min="0" ng-keyup="aduitTax($event,'含税')" set-focus></td>
                <td width="12%"><input type="number" min="0" ng-keyup="aduitTax($event,'不含税')" set-focus></td>
                <td width="12%"><input type="number" min="0" readonly="readonly" set-focus></td>
            </tr>`;
            let temp = $compile(html)($scope);
            angular.element($(".materials .total")).before(temp);
            $(".materials .total>td:nth-child(1)").text(length+1);
            commonService.materials_addRow($scope.projectId,$scope.schemeId).then((res)=>{
                if(res.success==true){
                    $(".materials .body table .add").attr("data-id",res.result);
                    setHeigth();
                    setTaxType();
                    getReaDom();
                }
            })
        }
        $scope.delete = ()=>{
            let tr = $(".materials .body table tr");
            if(tr.hasClass("inputClick")){
                let id = parseInt($(".materials .body .inputClick").attr("data-id"));
                commonService.materials_delRow(id).then((res)=>{
                    if(res.success==true){
                        $(".materials .body .inputClick").remove();
                        tr.map((index,value)=>{
                            $(value).find("td:nth-child(1)").text(index+1);
                        })
                        setHeigth();
                        setTotal();
                    }
                })
            }else{
                alert("请选择删除行");
            }
        }
        $scope.showHide = ($event)=>{
            $(".materials .seleName").hide();
            $($event.target).siblings("div").show();
        }
        $("body").click(function (e) {
            if (!$(e.target).closest(".glyphicon").length) {
                $(".materials .seleName").hide();
            }
        });
        $scope.click = (e)=>{
            let _this = $(e.target);
            if(_this.parents("tr").hasClass("total")){
                return;
            }else{
                $(".materials .body table tr").removeClass("inputClick");
                $(_this).parents("tr").addClass("inputClick");
            }
        }
        function setTaxType(){
            if($scope.taxType==0){//含税
                $(".materials .body tr:not(.total) td:nth-child(6) input").removeAttr("readonly").removeClass("readonlyStyle");
                $(".materials .body tr:not(.total) td:nth-child(7) input").attr("readonly","readonly").addClass("readonlyStyle");
            }else{
                $(".materials .body tr:not(.total) td:nth-child(7) input").removeAttr("readonly").removeClass("readonlyStyle");
                $(".materials .body tr:not(.total) td:nth-child(6) input").attr("readonly","readonly").addClass("readonlyStyle");
            }
        }
        //价格体系、单位
        $scope.selectTax = (num)=>{
            $scope.taxType = num;
            setTaxType();
        }
        function changeUnitType(obj,str){
            obj.map((i,v)=>{
                let num = $(v).attr("data-num");
                if(num!=undefined){
                    if(str=="*"){
                        $(v).attr("data-num",num*10000);
                        $(v).val((num*10000).toFixed(2));
                    }else{
                        $(v).attr("data-num",num/10000);
                        $(v).val((num/10000).toFixed(2));
                    }
                }
            })
        }
        $scope.selectUnit = (num)=>{
            if($scope.unitType!=num){
                //万元更改为元
                if($scope.unitType==0){
                    changeUnitType($(".materials .body tr:not(.total) td:nth-child(6) input"),"*");
                    changeUnitType($(".materials .body tr:not(.total) td:nth-child(7) input"),"*");
                }else{
                    //元更改为万元
                    changeUnitType($(".materials .body tr:not(.total) td:nth-child(6) input"),"/");
                    changeUnitType($(".materials .body tr:not(.total) td:nth-child(7) input"),"/");
                }
            }
            $scope.unitType=num;
        }
        $scope.selectAdd = ($event,num)=>{
            window.materialsChange=true;
            let _this = $($event.target);
            _this.parent().siblings("input").removeClass("focused");
            _this.parent().siblings("input").attr("data-num",num);
            _this.parent().siblings("input").val(num.toFixed(2));
            let addTax = num;
            let count = _this.parents("tr").find("td:nth-child(3) input").val();
            let hTax =  _this.parents("tr").find("td:nth-child(6) input").attr("data-num");
            let nTax =  _this.parents("tr").find("td:nth-child(7) input").attr("data-num");
            if($scope.taxType == 1){
                if(nTax=="" || nTax==undefined){
                    return;
                }else{
                    let value = nTax*(1+parseFloat(addTax)/100);
                    _this.parents("tr").find("td:nth-child(6) input").attr("data-num",value);
                    _this.parents("tr").find("td:nth-child(6) input").val(value.toFixed(2));
                    if(count!=""){
                        let values;
                        if($scope.unitType==0){
                            values = parseFloat(nTax)*parseFloat(count);
                        }else{
                            values = parseFloat(nTax)*parseFloat(count)/10000;
                        }
                        _this.parents("tr").find("td:last-child input").attr("data-num",values);
                        _this.parents("tr").find("td:last-child input").val(values.toFixed(2));
                        setTotal();
                    }
                }
            }else{
                //不含税单价
                let value = hTax/(1+parseFloat(addTax)/100);
                _this.parents("tr").find("td:nth-child(7) input").attr("data-num",value);
                _this.parents("tr").find("td:nth-child(7) input").val(value.toFixed(2));
                if(count!="") {
                    let values;
                    if ($scope.unitType == 0) {
                        values = parseFloat(value) * parseFloat(count);
                    } else {
                        values = parseFloat(value) * parseFloat(count) / 10000;
                    }
                    _this.parents("tr").find("td:last-child input").attr("data-num", values);
                    _this.parents("tr").find("td:last-child input").val(values.toFixed(2));
                    setTotal();
                }
            }
        }

        //计算营业收入键盘事件
        $scope.aduitTax = ($event,str)=>{
            let _this = $($event.target);
            let val = _this.val();
            let hTax =  _this.parents("tr").find("td:nth-child(6) input").attr("data-num");
            let nTax =  _this.parents("tr").find("td:nth-child(7) input").attr("data-num");
            //增值税
            let addTax = _this.parents("tr").find("td:nth-child(5) input").attr("data-num");
            //数量
            let count = _this.parents("tr").find("td:nth-child(3) input").val();
            if(str=="数量"){
                count = val;
            }
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
            if(val==""||addTax==undefined||addTax==""||count==""){
                return
            }
            //不含税
            if($scope.taxType == 1){
                if(addTax!=undefined&&addTax!=""){
                    //含税单价
                    let value = nTax*(1+parseFloat(addTax)/100);
                    _this.parents("tr").find("td:nth-child(6) input").attr("data-num",value);
                    _this.parents("tr").find("td:nth-child(6) input").val(value.toFixed(2));
                    if(count!=""){
                        let values;
                        if($scope.unitType==0){
                            values = parseFloat(nTax)*parseFloat(count);
                        }else{
                            values = parseFloat(nTax)*parseFloat(count)/10000;
                        }
                        _this.parents("tr").find("td:last-child input").attr("data-num",values);
                        _this.parents("tr").find("td:last-child input").val(values.toFixed(2));
                        setTotal();
                    }
                }
            }else{
                if(addTax!=undefined&&addTax!=""){
                    //不含税单价
                    let value = hTax/(1+parseFloat(addTax)/100);
                    _this.parents("tr").find("td:nth-child(7) input").attr("data-num",value);
                    _this.parents("tr").find("td:nth-child(7) input").val(value.toFixed(2));
                    if(count!=""){
                        let values;
                        if($scope.unitType==0){
                            values = parseFloat(value)*parseFloat(count);
                        }else{
                            values = parseFloat(value)*parseFloat(count)/10000;
                        }
                        _this.parents("tr").find("td:last-child input").attr("data-num",values);
                        _this.parents("tr").find("td:last-child input").val(values.toFixed(2));
                        setTotal();
                    }
                }
            }
        }
        function setTotal(){
            let values=0;
            $(".materials .body table tr:not(.total) td:last-child").map((index,value)=>{
                let val = $(value).find("input").attr("data-num");
                val = (isNaN(val)||val==undefined||val=="")?0 : parseFloat(val);
                values+=parseFloat(val);
            })
            $(".materials .body table tr:last-child td:last-child").attr("data-num",values);
            $(".materials .body table tr:last-child td:last-child").text(values.toFixed(2));
        }
    }]);