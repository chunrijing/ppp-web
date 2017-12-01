angular.module("core").controller('materialsFuelCtrl', ['$scope', '$http','commonService','$uibModal','$window','$compile','$interval',
    function ($scope, $http, commonService,$uibModal,$window,$compile,$interval) {
        let info = $window.sessionStorage.getItem("info").split(",");
        $scope.projectId = parseInt(info[0]);
        $scope.schemeId = parseInt(info[1]);
        let tId = $(".slider>ul>li:nth-child(5) ul li:nth-child(3)").attr("data-id");

        commonService.findTaxSys(parseFloat(tId),$scope.schemeId).then((res)=>{
            if(res.result==null) {
                $scope.taxType = 1;
                $scope.unitType = 0;
            }else{
                $scope.taxType = res.result.taxType;
                $scope.unitType = res.result.unitType;
            }
            commonService.getMaterialsFuel(
                {
                    "projectId": $scope.projectId,
                    "schemeId": $scope.schemeId
                }
            ).then((res)=> {
                if(res.result.length!=0){
                    let list = res.result;
                    list.map((item,index)=>{
                        let fuelAmount=item.fuelAmount==null?"":item.fuelAmount;
                        let amountUnit=item.amountUnit==null?"":item.amountUnit;
                        let addTax=item.addTax==null?"":item.addTax;
                        let addTaxs=item.addTax==null?"":item.addTax.toFixed(2);
                        let taxPrice=item.taxPrice==null?"":item.taxPrice;
                        let taxPrices=item.taxPrice==null?"":item.taxPrice.toFixed(2);
                        let unTaxPrice=item.unTaxPrice==null?"":item.unTaxPrice;
                        let unTaxPrices=item.unTaxPrice==null?"":item.unTaxPrice.toFixed(2);
                        let cost=item.cost==null?"":item.cost;
                        let costs=item.cost==null?"":item.cost.toFixed(2);
                        let html = `<tr data-type=${item.fuelType} ng-click="click($event)" data-id="${item.id}">
                    <td width="8%"></td>
                    <td width="20%"><input type="text" maxlength="20" set-focus value=${item.fuelName==null?"":item.fuelName}></td>
                    <td width="12%" class="amount"><input type="number" min="1" ng-blur="aduitTax($event,'数量')" set-focus value="${fuelAmount}"></td>
                    <td width="12%" class="selTd">
                        <input type="text" set-focus maxlength="10" onkeyup="this.value=this.value.replace(/[^\a-zA-Z\u4E00-\u9FA5]/g,'')" value="${amountUnit}">
                    </td>
                    <td width="12%" class="selTd">
                        <input type="number" min="0" max="99.9999" data-num="${addTax}" ng-blur="aduitTax($event,'增值税')" set-focus value="${addTaxs}">
                        <span ng-click="showHide($event)" class="glyphicon glyphicon-menu-down"></span>
                        <div class="seleName">
                            <option ng-click="selectAdd($event,0)">0</option>
                            <option ng-click="selectAdd($event,6)">6</option>
                            <option ng-click="selectAdd($event,11)">11</option>
                            <option ng-click="selectAdd($event,17)">17</option>
                        </div>
                    </td>
                    <td width="12%"><input type="number" min="0" data-num="${taxPrice}" ng-blur="aduitTax($event,'含税')" set-focus value="${taxPrices}"></td>
                    <td width="12%"><input type="number" min="0" data-num="${unTaxPrice}" ng-blur="aduitTax($event,'不含税')" set-focus value="${unTaxPrices}"></td>
                    <td width="12%"><input type="number" min="0" data-num="${cost}" readonly="readonly" set-focus value=${costs}></td>
                </tr>`;
                        let temp = $compile(html)($scope);
                        if(item.fuelType==0){
                            angular.element($(".materialsFuel .body .power")).before(temp);
                        }else{
                            angular.element($(".materialsFuel .body .total")).before(temp);
                        }
                    })
                    $(".materialsFuel .body tbody tr[data-type='0']:not(.except)").map((index,value)=>{
                        let count = index+1;
                        $(value).find("td:first-child").text(1+'.'+count)
                    })
                    $(".materialsFuel .body tbody tr[data-type='1']:not(.except)").map((index,value)=>{
                        let count = index+1;
                        $(value).find("td:first-child").text(2+'.'+count);
                    })
                    setTotal();
                    setTaxType();
                }
            })
        })

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
            $(".materialsFuel .body .addNew").removeClass("addNew");
            let tr = $(".materialsFuel .body table tr");
            if(tr.hasClass("inputClick")){
                let type = $(".materialsFuel .inputClick").attr("data-type");
                let html = `<tr class="addNew" ng-click="click($event)">
                    <td width="8%"></td>
                    <td width="20%"><input type="text" maxlength="20" set-focus></td>
                    <td width="12%" class="amount"><input type="number" min="1" ng-blur="aduitTax($event,'数量')" set-focus></td>
                    <td width="12%" class="selTd">
                        <input type="text" maxlength="10" onkeyup="this.value=this.value.replace(/[^\a-zA-Z\u4E00-\u9FA5]/g,'')" set-focus>
                    </td>
                    <td width="12%" class="selTd">
                        <input type="number" min="0" max="99.9999" ng-blur="aduitTax($event,'增值税')" set-focus>
                        <span ng-click="showHide($event)" class="glyphicon glyphicon-menu-down"></span>
                        <div class="seleName">
                            <option ng-click="selectAdd($event,0)">0</option>
                            <option ng-click="selectAdd($event,6)">6</option>
                            <option ng-click="selectAdd($event,11)">11</option>
                            <option ng-click="selectAdd($event,17)">17</option>
                        </div>
                    </td>
                    <td width="12%"><input type="number" min="0" ng-blur="aduitTax($event,'含税')" set-focus></td>
                    <td width="12%"><input type="number" min="0" ng-blur="aduitTax($event,'不含税')" set-focus></td>
                    <td width="12%"><input type="number" min="0" readonly="readonly" set-focus></td>
                </tr>`;
                let temp = $compile(html)($scope);
                let count;
                if(type=="0"){
                    angular.element($(".materialsFuel .power")).before(temp);
                    count=$(".materialsFuel .body tr[data-type='0']").length;
                }else{
                    angular.element($(".materialsFuel .total")).before(temp);
                    count=$(".materialsFuel .body tr[data-type='1']").length;
                }
                $(".materialsFuel .addNew").attr("data-type",type);
                commonService.materialsFuel_addRow(parseInt(type),$scope.projectId,$scope.schemeId).then((res)=>{
                    if(res.success==true){
                        $(".materialsFuel .addNew").attr("data-id",res.result);
                        getReaDom();
                        setTaxType();
                        type=parseInt(type)+1;
                        $(".materialsFuel .addNew td:first-child").text(type+'.'+count);
                    }
                })
                if($(".materialsFuel .body table").height()>320){
                    $(".materialsFuel .head").css({"paddingRight":"26px"});
                }else{
                    $(".materialsFuel .head").css({"paddingRight":"20px"});
                }
            }else{
                alert("请选择所属类型");
            }
        }
        $scope.click = (e)=>{
            let _this = $(e.target);
            if(_this.parents("tr").hasClass("total")){
                return;
            } else{
                $(".materialsFuel .body table tr").removeClass("inputClick");
                $(_this).parents("tr").addClass("inputClick");
                if(_this.parents("tr").hasClass("fixLine")){
                    $(".materialsFuel .deleLine").attr("disabled","disabled");
                    $(".materialsFuel .addLine").removeAttr("disabled");
                }else{
                    $(".materialsFuel .addLine").attr("disabled","disabled");
                    $(".materialsFuel .deleLine").removeAttr("disabled");
                }
            }
        }

        $scope.delete = ()=>{
            if($(".materialsFuel .body tr").hasClass("inputClick")){
                let type = $(".materialsFuel .inputClick").attr("data-type");
                let id = $(".materialsFuel .inputClick").attr("data-id");
                commonService.materialsFuel_delRow(parseInt(id)).then((res)=>{
                    if(res.success==true){
                        $(".materialsFuel .inputClick").remove();
                        getReaDom();
                        setTotal();
                        let trs;
                        if(type=="0"){
                            trs = $(".materialsFuel .body tr[data-type='0']:not(.fixLine)");
                        }else{
                            trs = $(".materialsFuel .body tr[data-type='1']:not(.fixLine)");
                        }
                        type=parseInt(type)+1;
                        trs.map((i,v)=>{
                            let num = i+1;
                            $(v).find("td:first-child").text(type+'.'+num);
                        })
                        if($(".materialsFuel .body table").height()>320){
                            $(".materialsFuel .head").css({"paddingRight":"37px"});
                        }else{
                            $(".materialsFuel .head").css({"paddingRight":"20px"});
                        }
                    }
                })

            }else{
                alert("请选择删除行");
            }
        }
        $scope.showHide = ($event)=>{
            $(".materialsFuel .seleName").hide();
            $($event.target).siblings("div").show();
        }
        $("body").click(function (e) {
            if (!$(e.target).closest(".glyphicon").length) {
                $(".materialsFuel .seleName").hide();
            }
        });

        function setTaxType(){
            if($scope.taxType==0){//含税
                $(".materialsFuel .body tr:not(.except) td:nth-child(6) input").removeAttr("readonly").removeClass("readonlyStyle");
                $(".materialsFuel .body tr:not(.except) td:nth-child(7) input").attr("readonly","readonly").addClass("readonlyStyle");
            }else{
                $(".materialsFuel .body tr:not(.except) td:nth-child(7) input").removeAttr("readonly").removeClass("readonlyStyle");
                $(".materialsFuel .body tr:not(.except) td:nth-child(6) input").attr("readonly","readonly").addClass("readonlyStyle");
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
                    changeUnitType($(".materialsFuel .body tr:not(.total) td:nth-child(6) input"),"*");
                    changeUnitType($(".materialsFuel .body tr:not(.total) td:nth-child(7) input"),"*");
                }else{
                    //元更改为万元
                    changeUnitType($(".materialsFuel .body tr:not(.total) td:nth-child(6) input"),"/");
                    changeUnitType($(".materialsFuel .body tr:not(.total) td:nth-child(7) input"),"/");
                }
            }
            $scope.unitType=num;
        }
        //增值税、数量单位
        $scope.selectAdd = ($event,num)=>{
            window.materialsFuelChange=true;
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
                //获取不含税单价
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
            if(val==""||addTax==undefined||count==""){
                return
            }
            //不含税
            if($scope.taxType == 1){
                if(addTax!=undefined){
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
                if(addTax!=undefined){
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
            $(".materialsFuel .body table tr:not(.except,.total) td:last-child").map((index,value)=>{
                let val = $(value).find("input").attr("data-num");
                val = (isNaN(val)||val==undefined||val=="")?0 : parseFloat(val);
                values+=val;
            })
            $(".materialsFuel .total td:last-child input").attr("data-num",values);
            $(".materialsFuel .total td:last-child input").val(values.toFixed(2));
        }

    }]);