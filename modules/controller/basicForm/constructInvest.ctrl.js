angular.module("core").controller('constructInvestCtrl', ['$scope', '$http','commonService','$uibModal','$window','$compile','$timeout','$interval',
    function ($scope, $http, commonService,$uibModal,$window,$compile,$timeout,$interval) {
        let info = $window.sessionStorage.getItem("info").split(",");
        $scope.schemeId = info[1];
        let height = $(window).height();
        $(".construct").height(height*0.76-130);
        $(".constructInvest .tableDiv").height(height*0.76-290);
        $(".constructInvest .formTable").height(height*0.76-390);

        commonService.getInvest($scope.schemeId).then((res)=>{
            if(res.result.length==0||res.result==null){
                return
            }
            $scope.investList = res.result;
            $scope.investYear = $scope.investList[0].investYearInfos;
            getTable();
            //根据方案id查询基础参数年限信息
            commonService.getPeriod($scope.schemeId).then((res)=>{
                if(res.success==true){
                    $scope.count = res.result.periodConstruction;
                    //表头分年投资拼接
                    for(let i=0;i<$scope.count;i++){
                        let html = `<th>${i+1}</th>`;
                        let temp = $compile(html)($scope);
                        angular.element($(".constructInvest .investTable>thead tr:last-child")).append(temp);
                    }
                    //表分年投资拼接
                    addTd($(".constructInvest .investTable>tbody tr"));

                    //赋值
                    $(".constructInvest .investTableBody tr").map((i,v)=>{
                        addTdList.map((item,index)=>{
                            if(parseInt($(v).attr("invId"))==item.id){
                                if(item.list!=null){
                                    for(let i=0;i<item.list.length;i++){
                                        let proportion= item.list[i].proportion==null?"":parseFloat(item.list[i].proportion);
                                        let proportions= item.list[i].proportion==null?"":parseFloat(item.list[i].proportion).toFixed(2);
                                        $($(v).find("td[name='addTd'] input")[i]).val(proportions);
                                        $($(v).find("td[name='addTd'] input")[i]).attr("data-num",proportion);
                                    }
                                }
                            }
                        })
                    })
                    setRead();
                    let num = $(".investTableBody tr:nth-last-child(4) td:nth-child(2) input").val();
                    num=(num=="预备费(按投资额)"?1:2);
                    setInput(num);
                    getChange();
                }
            })
        })
        window.constructInvestChange=false;
        function getChange(){
            $(".constructInvest input").change(function() {
                window.constructInvestChange=true;
            });
        }
        //添加readonly属性
        function setRead(){
            $(".investTableBody tr td:nth-child(8) input,.investTableBody tr td:nth-child(9) input").attr("readonly","readonly");
            $(".investTableBody tr").map((index,value)=>{
                if($(value).attr("isDefault")=="0"){
                    $(value).find("td:nth-child(6) input,td:nth-child(7) input").attr("readonly","readonly");
                    $(value).find("td[name='addTd'] input").attr("readonly","readonly");
                }else{
                    if($(value).find("td:nth-child(2) input").val()=="工程费用"||$(value).find("td:nth-child(2) input").val()=="建设投资合计"){
                        $(value).find("td>input").attr("readonly","readonly");
                    }else if($(value).find("td:nth-child(2) input").val()=="预备费"){
                        $(value).find("td:nth-child(3) input,td:nth-child(4) input,td:nth-child(5) input").attr("readonly","readonly");
                        $(value).find("td:nth-child(6) input,td:nth-child(7) input").attr("readonly","readonly");
                    }else if($(value).find("td:nth-child(2) input").val()=="基本预备费"){
                        $(value).find("td:nth-child(6) input,td:nth-child(7) input").attr("readonly","readonly");
                        $(value).find("td[name='addTd'] input").attr("readonly","readonly");
                    }else if($(value).find("td:nth-child(2) input").val()=="涨价预备费"){
                        $(value).find("td:nth-child(5) input,td:nth-child(6) input,td:nth-child(7) input").attr("readonly","readonly");
                        $(value).find("td[name='addTd'] input").attr("readonly","readonly");
                    }else{
                        $(value).find("td:nth-child(3) input,td:nth-child(4) input,td:nth-child(5) input").attr("readonly","readonly");
                    }
                }
            })

            setRange();
        }
        //添加用户填写数字范围
        function setRange(){
            $(".investTableBody tr td").map((index,value)=>{
                if($(value).find("input").attr("readonly")==undefined){
                    //$(value).find("input").attr("set-focus","");
                }
            })
            //费用
            $(".investTableBody tr td:nth-child(3) input").attr("min",0);
            $(".investTableBody tr td:nth-child(3)").map((index,value)=>{
                //console.log($(value).find("input").attr("readonly")==undefined);
                if($(value).find("input").attr("readonly")==undefined){
                    $(value).find("input").attr("min",0);
                }
            })
            //下浮率
            $(".investTableBody tr td:nth-child(4)").map((index,value)=>{
                if($(value).find("input").attr("readonly")==undefined){
                    $(value).find("input").attr("min",0);
                    $(value).find("input").attr("max",100);
                }
            })
            //抵扣税率
            $(".investTableBody tr td:nth-child(5)").map((index,value)=>{
                if($(value).find("input").attr("readonly")==undefined){
                    $(value).find("input").attr("min",0);
                    $(value).find("input").attr("max",99.999);
                }
            })
            //折旧/推摊
            $(".investTableBody tr td:nth-child(6)").map((index,value)=>{
                if($(value).parent().attr("data-type")=="4"&&$(value).parent().attr("data-order")==undefined){
                    $(value).find("input").attr("readonly","readonly");
                }
                if($(value).find("input").attr("readonly")==undefined){
                    $(value).find("input").attr("min",0);
                }
            })
            //残值率
            $(".investTableBody tr td:nth-child(7)").map((index,value)=>{
                if($(value).find("input").attr("readonly")==undefined){
                    $(value).find("input").attr("min",0);
                    $(value).find("input").attr("max",100);
                }
                let par = $(value).parent();
                if((par.attr("data-type")=="2"||par.attr("data-type")=="3"||par.attr("data-type")=="4")&&par.attr("data-order")==undefined){
                    $(value).find("input").attr("readonly","readonly");
                }
            })
        }
        //添加分年投资
        function addTd(obj,str){
            obj.map((index,value)=>{
                for(let i=0;i<$scope.count;i++){
                    let html = `<td name='addTd' class='td${i+1}'><input type='number' order="${i+1}" data-num="" min="0" max="100" set-focus ng-blur="getValue($event,'分年')"></td>`;
                    if(str=="addTd"){
                        html = `<td name='addTd' class='td${i+1}'><input type='number' data-num="" set-focus min="0" max="100" readonly='readonly'></td>`;
                    }
                    let temp = $compile(html)($scope);
                    angular.element(value).append(temp);
                }
            })
        }

        //初始值设置
        function setNum(itemName,cost,lowerRate,deductionRate,depreciation,salvageRate,lowerInvest,deductionPrice){
            itemNames = (itemName==null?"":itemName);
            costs = (cost==null?"":cost.toFixed(2));
            lowerRates = lowerRate==null?"":lowerRate.toFixed(2);
            depreciations = depreciation==null?"":depreciation.toFixed(2);
            salvageRates = salvageRate==null?"":salvageRate.toFixed(2);
            deductionRates = deductionRate==null?"":deductionRate.toFixed(2);
            lowerInvests = lowerInvest==null?"":lowerInvest.toFixed(2);
            deductionPrices = deductionPrice==null?"":deductionPrice.toFixed(2);
            tcosts = (cost==null?"":cost);
            tlowerRates = lowerRate==null?"":lowerRate;
            tdepreciations = depreciation==null?"":depreciation;
            tsalvageRates = salvageRate==null?"":salvageRate;
            tdeductionRates = deductionRate==null?"":deductionRate;
            tlowerInvests = lowerInvest==null?"":lowerInvest;
            tdeductionPrices = deductionPrice==null?"":deductionPrice;
        }
        let itemNames;
        let costs;
        let tcosts;
        let lowerRates;
        let tlowerRates;
        let depreciatios;
        let tdepreciatios;
        let salvageRates;
        let tsalvageRates;
        let deductionRates;
        let tdeductionRates;
        let lowerInvests;
        let tlowerInvests;
        let deductionPrices;
        let tdeductionPrices;
        let addTdList=[];
        function getTable(){
            $scope.nameShow = false;
            let list = $scope.investList;
            list.map((item,index)=>{
                setNum(item.itemName,item.cost,item.lowerRate,item.deductionRate,item.depreciation,item.salvageRate,item.lowerInvest,item.deductionPrice);
                let nameShow=false;
                if(itemNames==1||itemNames==2){
                    $scope.selPreCost = itemNames;
                    nameShow=true;
                }else{
                    nameShow=false;
                }
                $scope.yearList = item.investYearInfos==null?0:item.investYearInfos;
                let obj={
                    id: item.investId,
                    list: item.investYearInfos
                }
                addTdList.push(obj);
                let itemName=(itemNames=="1"?"预备费(按投资额)":(itemNames=="2"?"预备费(按投资额)":itemNames));
                let html = `<tr ng-click="audit($event)" invId="${item.investId}" data-id=${item.canAddChild} isDefault=${item.isDefault} data-type=${index+1} id=${item.investId} data-sort=${item.itemSort}>
                    <td width='5%'>${index+1}</td>
                    <td width='12%' style="position: relative">
                        <div ng-show=${nameShow} class="seleName">
                            <option ng-click="selectReward($event,1,'预备费(按投资额)')">预备费（按投资额）</option>
                            <option ng-click="selectReward($event,2,'预备费(按费率(%)')">预备费（按费率(%)）</option>
                        </div>
                        <input type="text" maxlength="20" value=${itemName} readonly="readonly" />
                        <span ng-show=${nameShow} ng-click="showOrHide($event)" class="glyphicon glyphicon-menu-down"></span>
                    </td>
                    <td width="8%"><input type="number" set-focus data-num="${tcosts}" value="${costs}" ></td>
                    <td width="8%"><input type="number" set-focus data-num="${tlowerRates}" value="${lowerRates}" ></td>
                    <td width="8%"><input type="number" maxlength="2" set-focus data-num="${tdeductionRates}" value="${deductionRates}" ></td>
                    <td width="8%"><input type="number" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')"  maxlength="2" data-num="${tdepreciations}" value="${depreciations}"></td>
                    <td width="8%"><input type="number" set-focus data-num="${tsalvageRates}"  value="${salvageRates}" ></td>
                    <td width="8%"><input type="number" data-num="${tlowerInvests}"  value="${lowerInvests}"></td>
                    <td width="8%"><input type="number" data-num="${tdeductionPrices}" value="${deductionPrices}"></td>
                    </tr>`
                let temp = $compile(html)($scope);
                angular.element($(".constructInvest .investTable>tbody")).append(temp);
                if(item.investParameterInfos!=null){
                    item.investParameterInfos.map((items,indexs)=>{
                        let objs={
                            id: items.investId,
                            list: items.investYearInfos
                        }
                        addTdList.push(objs);
                        $scope.yearLists = items.investYearInfos==null?0:items.investYearInfos;
                        setNum(items.itemName,items.cost,items.lowerRate,items.deductionRate,items.depreciation,items.salvageRate,items.lowerInvest,items.deductionPrice);
                        let html = `<tr ng-click="audit($event)" invId="${items.investId}" data-id="${items.canAddChild}" isDefault=${items.isDefault} data-type=${index+1} data-order=${indexs+1} id=${items.investId} data-sort=${items.itemSort}>
                            <td width='5%'>${index+1}.${indexs+1}</td>
                            <td width='12%'><input maxlength="20"  type="text" readonly="readonly" value=${itemNames} ></td>
                            <td width="8%"><input type="number" set-focus ng-blur="getValue($event,'费用')"  data-num="${tcosts}" value="${costs}" ></td>
                            <td width="8%"><input type="number" set-focus ng-blur="getValue($event,'下浮率')"  data-num="${tlowerRates}" value="${lowerRates}" ></td>
                            <td width="8%"><input type="number" maxlength="2" set-focus ng-blur="getValue($event,'抵扣税率')"  data-num="${tdeductionRates}" value="${deductionRates}" ></td>
                            <td width="8%"><input type="number"  onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" maxlength="2" ng-blur="getValue($event)" data-num="${tdepreciations}" value="${depreciations}" ></td>
                            <td width="8%"><input type="number" set-focus ng-blur="getValue($event)" data-num="${tsalvageRates}" value="${salvageRates}" ></td>
                            <td width="8%"><input type="number" ng-blur="getValue($event)" data-num="${tlowerInvests}" value="${lowerInvests}" ></td>
                            <td width="8%"><input type="number" ng-blur="getValue($event)" data-num="${tdeductionPrices}" value="${deductionPrices}" ></td>
                            </tr>`
                        let temp = $compile(html)($scope);
                        angular.element($(".constructInvest .investTable>tbody")).append(temp);
                        if(items.investParameterInfos!=null){
                            items.investParameterInfos.map((value,key)=>{
                                let _obj={
                                    id: value.investId,
                                    list: value.investYearInfos
                                }
                                addTdList.push(_obj);
                                $scope.yearlist = value.investYearInfos==null?0:value.investYearInfos;
                                setNum(value.itemName,value.cost,value.lowerRate,value.deductionRate,value.depreciation,value.salvageRate,value.lowerInvest,value.deductionPrice);
                                let html = `<tr ng-click="audit($event)" invId="${value.investId}" data-id="${value.canAddChild}" isDefault=${value.isDefault} data-type=${index+1} data-order=${indexs+1} data-count=${key+1} id=${value.investId} data-sort=${value.itemSort}>
                                    <td width='5%'>${index+1}.${indexs+1}.${key+1}</td>
                                    <td width='12%'><input type="text" set-focus readonly="readonly" value=${itemNames}  ></td>
                                    <td width="8%"><input type="number" set-focus ng-blur="getValue($event,'费用')"  data-num="${tcosts}" value="${costs}" ></td>
                                    <td width="8%"><input type="number" set-focus ng-blur="getValue($event,'下浮率')"  data-num="${tlowerRates}" value="${lowerRates}" ></td>
                                    <td width="8%"><input type="number" maxlength="2" set-focus ng-blur="getValue($event,'抵扣税率')"  data-num="${tdeductionRates}" value="${deductionRates}" ></td>
                                    <td width="8%"><input type="number" maxlength="2" set-focus ng-blur="getValue($event)" data-num="${tdepreciations}" value="${depreciations}" ></td>
                                    <td width="8%"><input type="number" set-focus ng-blur="getValue($event)" data-num="${tsalvageRates}" value="${salvageRates}" ></td>
                                    <td width="8%"><input type="number" ng-blur="getValue($event)" data-num="${tlowerInvests}" value="${lowerInvests}" ></td>
                                    <td width="8%"><input type="number" ng-blur="getValue($event)" data-num="${tdeductionPrices}" value="${deductionPrices}" ></td>
                                    </tr>`
                                let temp = $compile(html)($scope);
                                angular.element($(".constructInvest .investTable>tbody")).append(temp);
                            })
                        }
                    })
                }
            })
            setPd();
            $(".constructInvest .investTableBody tr").map((index,value)=>{
                if($(value).attr("isDefault")=="0"){
                    $(value).find("input").removeAttr("readonly");
                }
            })
        }

        function setPd(){
            let investTableBody_height = $(".investTableBody").height();
            let formTable_height = $(".constructInvest .formTable").height();
            if(investTableBody_height>formTable_height){
                $(".constructInvest .tableDiv>div:first-child").css("paddingRight","6px");
            }else{
                $(".constructInvest .tableDiv>div:first-child").css("paddingRight","0px")
            }
        }

        //纵向求和
        function getSum(_this,type,order,count,str,cost){
            let sum = 0;
            let graSum = 0;
            let par;
            let graPar;
            let product = 0;
            //三级
            if(order!=undefined&&count!=undefined){
                $('.investTableBody tr[data-type="'+type+'"]').map((i,v)=> {
                    if ($(v).attr("data-order") == order && $(v).attr("data-count") != undefined) {
                        //三级兄弟
                        let value;
                        if (str == "费用") {
                            value = $(v).find("td:nth-child(3) input").val();
                        }
                        if (str == "下浮后投资") {
                            value = $(v).find("td:nth-child(8) input").attr("data-num");
                        }
                        if (str == "抵扣额") {
                            value = $(v).find("td:nth-child(9) input").attr("data-num");
                        }
                        value = (isNaN(value) || value== "" ? 0 : parseFloat(value));
                        sum = sum + value;
                    }
                })
                $('.investTableBody tr[data-type="'+type+'"]').map((i,v)=> {
                     if($(v).attr("data-order")==order&&$(v).attr("data-count")==undefined){
                         //父级二级
                         if(str=="费用"){
                             par = $(v).find("td:nth-child(3) input");
                         }
                         if(str=="下浮后投资"){
                             par = $(v).find("td:nth-child(8) input");
                         }
                         if(str=="抵扣额"){
                             par = $(v).find("td:nth-child(9) input");
                         }
                         par.attr("data-num",sum);
                         par.val(sum.toFixed(2));
                     }
                 })
                $('.investTableBody tr[data-type="'+type+'"]').map((i,v)=> {
                    //所有同一一级下二级序号行
                    if($(v).attr("data-order")!=undefined&&$(v).attr("data-count")==undefined){
                        let pars;
                        if(str=="费用"){
                            pars = $(v).find("td:nth-child(3) input").attr("data-num");
                        }
                        if(str=="下浮后投资"){
                            pars = $(v).find("td:nth-child(8) input").attr("data-num");
                        }
                        if(str=="抵扣额"){
                            pars = $(v).find("td:nth-child(9) input").attr("data-num");
                        }
                        pars = (isNaN(pars) || pars== "" ?0:parseFloat(pars));
                        graSum = graSum+pars;
                    }
                });
                $('.investTableBody tr[data-type="'+type+'"]').map((i,v)=> {
                    //一级序号
                    if($(v).attr("data-order")==undefined){
                        if(str=="费用"){
                            graPar = $(v).find("td:nth-child(3) input");
                        }
                        if(str=="下浮后投资"){
                            graPar = $(v).find("td:nth-child(8) input");
                        }
                        if(str=="抵扣额"){
                            graPar = $(v).find("td:nth-child(9) input");
                        }
                        graPar.attr("data-num",graSum);
                        graPar.val(graSum.toFixed(2));
                        //graPar = $(v).find("td:nth-child(8) input");
                    }
                })
            //二级
            }else if(order!=undefined&&count==undefined){
                $('.investTableBody tr[data-type="'+type+'"]').map((i,v)=>{
                    //同级
                    if($(v).attr("data-order")!=undefined){
                        let pars;
                        if(str=="费用"){
                            pars = $(v).find("td:nth-child(3) input").val();
                        }
                        if(str=="下浮后投资"){
                            pars = $(v).find("td:nth-child(8) input").attr("data-num");
                        }
                        if(str=="抵扣额"){
                            pars = $(v).find("td:nth-child(9) input").attr("data-num");
                        }
                        pars = (isNaN(pars) || pars== ""?0:parseFloat(pars));
                        graSum = graSum+pars;
                    }
                })

                $('.investTableBody tr[data-type="'+type+'"]').map((i,v)=>{
                    //父级
                    if($(v).attr("data-order")==undefined){
                        if(str=="费用"){
                            par = $(v).find("td:nth-child(3) input");
                        }
                        if(str=="下浮后投资"){
                            par = $(v).find("td:nth-child(8) input");
                        }
                        if(str=="抵扣额"){
                            par = $(v).find("td:nth-child(9) input");
                        }
                    }
                    par.attr("data-num",graSum);
                    par.val(graSum.toFixed(2));
                })
            }
            //建设投资合计
            getTotal();
        }
        //建设投资合计
        function getTotal(){
            let total_count = 0;
            let total_lower = 0;
            let total_deduction = 0;
            let td_count = $(".investTableBody tr:last-child td:nth-child(3) input");
            let td_lower = $(".investTableBody tr:last-child td:nth-child(8) input");
            let td_deduction = $(".investTableBody tr:last-child td:nth-child(9) input");
            $(".investTableBody tr").map((i,v)=>{
                if($(v).attr("data-order")==undefined&&$(v).attr("data-type")!=5){
                    let each_count = $(v).find("td:nth-child(3) input").attr("data-num");
                    let each_lower = $(v).find("td:nth-child(8) input").attr("data-num");
                    let each_deduction = $(v).find("td:nth-child(9) input").attr("data-num");
                    each_count=each_count==""?0:parseFloat(each_count);
                    each_lower=each_lower==""?0:parseFloat(each_lower);
                    each_deduction=each_deduction==""?0:parseFloat(each_deduction);
                    total_count+=each_count;
                    total_lower+=each_lower;
                    total_deduction+=each_deduction;
                }
            })
            td_count.val(total_count.toFixed(2)).attr("data-num",total_count);
            td_lower.val(total_lower.toFixed(2)).attr("data-num",total_lower);
            td_deduction.val(total_deduction.toFixed(2)).attr("data-num",total_deduction);
            getYearTotal();
        }
        //计算4.1费用
        function getBaseCost(){
            //基本预备费费率
            let reserveRate = $(".constructInvest .reserveRate input").attr("data-num");
            let costFir = $(".constructInvest .investTableBody tbody tr:first-child td:nth-child(3) input").attr("data-num");
            let tr = $(".constructInvest .investTableBody tbody tr[data-type=4]")[1];
            if(reserveRate!=""&&reserveRate!=undefined){
                let val = parseFloat(costFir)*parseFloat(reserveRate)/100;
                $(tr).find("td:nth-child(3) input").val(val.toFixed(2));
                $(tr).find("td:nth-child(3) input").attr("data-num",val);
            }
            getPreCost();
        }
        //计算4.2涨价预备费费用
        //1.1 1.2 1.3 1.4 4.1(4.1费用，4分年投资比例) 费用*分年投资比例(第一年)*（Math.pow(1+预备费价格上涨率,建设期年限）-1）
        // +费用*分年投资比例(第二年)*（Math.pow(1+预备费价格上涨率,建设期年限）-1）+...
        function getUpCost(){
            let incTotal=0;
            let _incTotal=0;
            //4.1
            let tr_4_1 = $(".constructInvest .investTableBody tbody tr[data-type=4]")[1];
            //4分年投资比例
            let tr_4 = $(".constructInvest .investTableBody tbody tr[data-type=4]")[0];
            for(let index=0;index<$scope.count;index++){
                let getYearSum_total=0;
                $('.investTableBody tr[data-type=1]').map((i,v)=> {
                    //debugger
                    if($(v).attr("data-order")!=undefined&&$(v).attr("data-count")==undefined) {
                        let pars = $(v).find("td:nth-child(3) input").attr("data-num");
                        pars=pars==""?0:pars;
                        let num=0;
                        let tds = $(v).find("td[class^='td'] input")[index];
                        let tds_num = $(tds).attr("data-num")==""?0:$(tds).attr("data-num");
                        num = parseFloat(tds_num)*parseFloat(pars)/100;
                        getYearSum_total+=num;
                    }
                })
                //debugger
                //预备费价格上涨率
                let increaseRate=$(".constructInvest .increaseRate input").attr("data-num");
                //4分年投资
                let td_4 = $(tr_4).find("td[class^='td'] input")[index];
                //4.1费用
                let td_4_num = $(tr_4_1).find("td:nth-child(3) input").attr("data-num");
                td_4=$(td_4).attr("data-num");
                td_4=td_4==""?0:td_4;
                td_4_num=td_4_num==""?0:td_4_num;
                if(increaseRate==""){
                    return;
                }else{
                    let num = td_4*parseFloat(td_4_num)/100;
                    getYearSum_total+=num;
                }
                incTotal=getYearSum_total*(Math.pow(1+parseFloat(increaseRate)/100,index+1)-1);
                _incTotal+=incTotal;
            }
            let tr_4_2 = $(".investTableBody tr:nth-last-child(2)");
            tr_4_2.find("td:nth-child(3) input").attr("data-num",_incTotal);
            tr_4_2.find("td:nth-child(3) input").val(_incTotal.toFixed(2));
            getPreCost();
        }
        //重新计算4预备费费用
        function getPreCost(){
            let td_4_0 = $(".investTableBody tr:nth-last-child(4) td:nth-child(3) input");
            let td_4_1 = $(".investTableBody tr:nth-last-child(3) td:nth-child(3) input").attr("data-num");
            let td_4_2 = $(".investTableBody tr:nth-last-child(2) td:nth-child(3) input").attr("data-num");
            td_4_1=td_4_1==""?0:parseFloat(td_4_1);
            td_4_2=td_4_2==""?0:parseFloat(td_4_2);
            let num_4 = td_4_1+td_4_2;
            td_4_0.val(num_4.toFixed(2));
            td_4_0.attr("data-num",num_4);
        }
        //计算分年投资合计
        function getYearTotal(){
            //debugger
            for(let index=0;index<$scope.count;index++){
                let getYearSum_total=0;
                //1工程费用
                $('.investTableBody tr[data-type=1]').map((i,v)=> {
                    if($(v).attr("data-order")!=undefined&&$(v).attr("data-count")==undefined) {
                        let pars = $(v).find("td:nth-child(8) input").attr("data-num");
                        pars=pars==""?0:pars;
                        let num=0;
                        let tds = $(v).find("td[class^='td'] input")[index];
                        let tds_num = $(tds).attr("data-num")==""?0:$(tds).attr("data-num");
                        num = parseFloat(tds_num)*parseFloat(pars)/100;
                        getYearSum_total+=num;
                    }
                })
                //2无形资产费用
                let tr_2=$('.investTableBody tr[data-type=2]')[0];
                //3其他资产费用
                let tr_3=$('.investTableBody tr[data-type=3]')[0];
                //4预备费
                let tr_4=$('.investTableBody tr[data-type=4]')[0];
                //合计
                let year_total=$(".investTableBody tr:last-child td[class^='td'] input")[index];
                //费用
                let count_2=$(tr_2).find("td:nth-child(8) input").attr("data-num");
                let count_3=$(tr_3).find("td:nth-child(8) input").attr("data-num");
                let count_4=$(tr_4).find("td:nth-child(8) input").attr("data-num");
                count_2=count_2==""||count_2=="0"?0:parseFloat(count_2);
                count_3=count_3==""||count_3=="0"?0:parseFloat(count_3);
                count_4=count_4==""||count_4=="0"?0:parseFloat(count_4);
                //分年投资
                let year_2=$(tr_2).find("td[class^='td'] input")[index];
                let year_3=$(tr_3).find("td[class^='td'] input")[index];
                let year_4=$(tr_4).find("td[class^='td'] input")[index];
                year_2=$(year_2).attr("data-num")==""?0:parseFloat($(year_2).attr("data-num"));
                year_3=$(year_3).attr("data-num")==""?0:parseFloat($(year_3).attr("data-num"));
                year_4=$(year_4).attr("data-num")==""?0:parseFloat($(year_4).attr("data-num"));
                let nums = count_2*year_2/100+count_3*year_3/100+count_4*year_4/100;
                getYearSum_total+=nums;
                if(getYearSum_total==0){
                    $(year_total).attr("data-num","");
                    $(year_total).val("");
                }
                $(year_total).attr("data-num",getYearSum_total);
                $(year_total).val(getYearSum_total.toFixed(2));
            }
        }
        //失焦事件（横向计算待封装）
        $scope.getValue=($event,str)=>{
            let _this = $($event.target);
            let value = _this.val();
            let type = _this.parents("tr").attr("data-type");
            let order = _this.parents("tr").attr("data-order");
            let count = _this.parents("tr").attr("data-count");
            if(_this.attr("readonly")=="readonly"||value==""){
                return;
            }
            //费用
            let cost = _this.parents("tr").find("td:nth-child(3)").find("input").attr("data-num");
            //下浮率
            let lowerRate = _this.parents("tr").find("td:nth-child(4)").find("input").attr("data-num");
            //抵扣税率
            let tdeductionRate = _this.parents("tr").find("td:nth-child(5)").find("input").attr("data-num");
            let counts = _this.parents("tr").find("td[name='addTd']").length;
            //基本预备费费率
            let reserveRate = $(".constructInvest .reserveRate input").attr("data-num");
            //预备费价格上涨率
            let increaseRate = $(".constructInvest .increaseRate input").attr("data-num");
            if(str=="费用"){
                cost=value;
                //费用行计算
                if(lowerRate!=""){
                    //下浮后投资
                    let val = cost*(1-parseFloat(lowerRate)/100);
                    _this.parents("tr").find("td:nth-child(8) input").attr("data-num",val);
                    _this.parents("tr").find("td:nth-child(8) input").val(val.toFixed(2));
                    if(tdeductionRate!="") {
                        //抵扣额
                        val = val / (1 + parseFloat(tdeductionRate)/100) * parseFloat(tdeductionRate)/100;
                        _this.parents("tr").find("td:nth-child(9) input").attr("data-num", val);
                        _this.parents("tr").find("td:nth-child(9) input").val(val.toFixed(2));
                    }
                }
                getSum(_this,type,order,count,"下浮后投资");
                getSum(_this,type,order,count,"抵扣额");
                getSum(_this,type,order,count,"费用",cost);
                //计算4.1基本预备费费用
                getBaseCost();
                getUpCost();
            }
            if(str=="下浮率"){
                lowerRate=value;
                if(cost!=""){
                    //行计算
                    //下浮后投资
                    let val = cost*(1-parseFloat(lowerRate)/100);
                    _this.parents("tr").find("td:nth-child(8) input").attr("data-num",val);
                    _this.parents("tr").find("td:nth-child(8) input").val(val.toFixed(2));
                    getSum(_this,type,order,count,"下浮后投资");
                    if(tdeductionRate!=""){
                        //抵扣额
                        val = val/(1+parseFloat(tdeductionRate)/100)*parseFloat(tdeductionRate)/100;
                        _this.parents("tr").find("td:nth-child(9) input").attr("data-num",val);
                        _this.parents("tr").find("td:nth-child(9) input").val(val.toFixed(2));
                        getSum(_this,type,order,count,"抵扣额");
                    }
                }
            }
            if(str=="抵扣税率"){
                tdeductionRate=value;
                if(cost==""||lowerRate==""){
                    return;
                }else{
                    let val = parseFloat(_this.parents("tr").find("td:nth-child(8) input").attr("data-num"));
                    val = val/(1+parseFloat(tdeductionRate)/100)*parseFloat(tdeductionRate)/100;
                    _this.parents("tr").find("td:nth-child(9) input").attr("data-num",val);
                    _this.parents("tr").find("td:nth-child(9) input").val(val.toFixed(2));
                    getSum(_this,type,order,count,"抵扣额");
                }
            }
            let costFir = $(".constructInvest .investTableBody tbody tr:first-child td:nth-child(3) input").attr("data-num");
            if(str=="预备费费率"){
                let lowerRates=$(".constructInvest .investTableBody tr:nth-last-child(3) td:nth-child(4) input").attr("data-num");
                let tdeductionRates=$(".constructInvest .investTableBody tr:nth-last-child(3) td:nth-child(5) input").attr("data-num");
                reserveRate=value;
                if(costFir==""){
                    return
                }else{
                    //计算4.1基本预备费费用
                    getBaseCost();
                    let tr_4_1 = $(".constructInvest .investTableBody tr:nth-last-child(3)");
                    let this_ = tr_4_1.find("td input");
                    let types = tr_4_1.attr("data-type");
                    let orders = tr_4_1.attr("data-order");
                    let counts = tr_4_1.attr("data-count");
                    let _cost = $(".constructInvest .investTableBody tr:nth-last-child(3) td:nth-child(3) input").attr("data-num");
                    _cost=_cost==""||_cost=="0"?0:parseFloat(_cost);
                    if(lowerRates!=""&&lowerRates!=undefined){
                        //下浮后投资
                        let val = _cost*(1-parseFloat(lowerRates)/100);
                        tr_4_1.find("td:nth-child(8) input").attr("data-num",val);
                        tr_4_1.find("td:nth-child(8) input").val(val.toFixed(2));
                        getSum(this_,types,orders,counts,"下浮后投资");
                        if(tdeductionRate!="") {
                            //抵扣额
                            val = val / (1 + parseFloat(tdeductionRates)) * parseFloat(tdeductionRates);
                            this_.parents("tr").find("td:nth-child(9) input").attr("data-num", val);
                            this_.parents("tr").find("td:nth-child(9) input").val(val.toFixed(2));
                            getSum(this_,types,orders,counts,"抵扣额");
                        }
                    }
                    getSum(this_,types,orders,counts,"费用",cost);

                }
            }
            if(str=="价格上涨率"){
                //分年投资
                $(".constructInvest .investTableBody tbody tr[data-type=1]")
                let lowerRates=$(".constructInvest .investTableBody tr:nth-last-child(2) td:nth-child(4) input").attr("data-num");
                let tdeductionRates=$(".constructInvest .investTableBody tr:nth-last-child(2) td:nth-child(5) input").attr("data-num");
                //工程费用
                let proCost = $(".constructInvest .investTableBody tbody tr:first-child td:nth-child(3) input").attr("data-num");
                //4.1基本预备费
                let preCost = $(".constructInvest .investTableBody tbody tr:nth-last-child(3) td:nth-child(3) input").attr("data-num");
                if(proCost==""&&preCost==""){
                    return
                }else{
                    getUpCost(str, value);
                    console.log($(".constructInvest .investTableBody tr:nth-last-child(2) td:nth-child(3) input").attr("data-num"));
                    let tr_4_1 = $(".constructInvest .investTableBody tr:nth-last-child(2)");
                    let this_ = tr_4_1.find("td input");
                    let types = tr_4_1.attr("data-type");
                    let orders = tr_4_1.attr("data-order");
                    let counts = tr_4_1.attr("data-count");
                    let _cost = $(".constructInvest .investTableBody tr:nth-last-child(2) td:nth-child(3) input").attr("data-num");
                    _cost=_cost==""||_cost=="0"?0:parseFloat(_cost);
                    if(lowerRates!=""){
                        //下浮后投资
                        let val = _cost*(1-parseFloat(lowerRates)/100);
                        tr_4_1.find("td:nth-child(8) input").attr("data-num",val);
                        tr_4_1.find("td:nth-child(8) input").val(val.toFixed(2));
                        getSum(this_,types,orders,counts,"下浮后投资");

                        if(tdeductionRates!="") {
                            //抵扣额
                            val = val / (1 + parseFloat(tdeductionRates)/100) * parseFloat(tdeductionRates)/100;
                            this_.parents("tr").find("td:nth-child(9) input").attr("data-num", val);
                            this_.parents("tr").find("td:nth-child(9) input").val(val.toFixed(2));
                            getSum(this_,types,orders,counts,"抵扣额");
                        }
                    }
                    getSum(this_,types,orders,counts,"费用");
                }
            }
            if(str=="分年"){
                getUpCost();
                getPreCost();
                let lowerRates=$(".constructInvest .investTableBody tr:nth-last-child(2) td:nth-child(4) input").attr("data-num");
                let tdeductionRates=$(".constructInvest .investTableBody tr:nth-last-child(2) td:nth-child(5) input").attr("data-num");
                let costs = $(".constructInvest .investTableBody tr:nth-last-child(2) td:nth-child(3) input").attr("data-num");
                let _lowerRates=$(".constructInvest .investTableBody tr:nth-last-child(3) td:nth-child(4) input").attr("data-num");
                let _tdeductionRates=$(".constructInvest .investTableBody tr:nth-last-child(3) td:nth-child(5) input").attr("data-num");
                let _costs = $(".constructInvest .investTableBody tr:nth-last-child(3) td:nth-child(3) input").attr("data-num");
                let tr_4_1 = $(".constructInvest .investTableBody tr:nth-last-child(3)");
                let tr_4_2 = $(".constructInvest .investTableBody tr:nth-last-child(2)");
                let _this_ = tr_4_1.find("td input");
                let this_ = tr_4_2.find("td input");
                let types = tr_4_2.attr("data-type");
                let orders = tr_4_2.attr("data-order");
                let counts = tr_4_2.attr("data-count");
                if(lowerRates!=""){
                    //下浮后投资
                    let val = costs*(1-parseFloat(lowerRates)/100);
                    tr_4_2.find("td:nth-child(8) input").attr("data-num",val);
                    tr_4_2.find("td:nth-child(8) input").val(val.toFixed(2));
                    //getSum(this_,types,orders,counts,"下浮后投资");
                    if(tdeductionRates!="") {
                        //抵扣额
                        val = val / (1 + parseFloat(tdeductionRates)/100) * parseFloat(tdeductionRates)/100;
                        this_.parents("tr").find("td:nth-child(9) input").attr("data-num", val);
                        this_.parents("tr").find("td:nth-child(9) input").val(val.toFixed(2));
                        //getSum(this_,types,orders,counts,"抵扣额");
                    }
                }
                if(_lowerRates!=""){
                    //下浮后投资
                    let val = _costs*(1-parseFloat(_lowerRates)/100);
                    tr_4_1.find("td:nth-child(8) input").attr("data-num",val);
                    tr_4_1.find("td:nth-child(8) input").val(val.toFixed(2));
                    getSum(_this_,types,orders,counts,"下浮后投资");
                    if(_tdeductionRates!="") {
                        //抵扣额
                        val = val / (1 + parseFloat(_tdeductionRates)/100) * parseFloat(_tdeductionRates)/100;
                        _this_.parents("tr").find("td:nth-child(9) input").attr("data-num", val);
                        _this_.parents("tr").find("td:nth-child(9) input").val(val.toFixed(2));
                        getSum(_this_,types,orders,counts,"抵扣额");
                    }
                }
                getSum(_this_,types,orders,counts,"费用");
            }
        }

        $scope.showOrHide = ($event)=>{
            $($event.target).siblings("div").toggle();
            //$($event.target).siblings("div").show();
        }
        $("body").click(function (e) {
            if (!$(e.target).closest(".glyphicon").length) {
                $(".investTableBody .seleName").hide();
            }
        });
        //点击序号选定行
        $scope.audit = function($event){
            $(".investTableBody tr").removeClass("inputClick");
            $($event.target).parents("tr").addClass("inputClick");
            $(".constructInvest .btns>button").removeAttr("disabled");
            if($($event.target).parents("tr").attr("data-id")!="1"){
                $(".constructInvest .addLine").attr("disabled","disabled");
            }
            if($($event.target).parents("tr").attr("isDefault")=="1"){
                $(".constructInvest .deleLine").attr("disabled","disabled");
            }
        }

        function setInput(num,str){
            let input = $(".constructInvest .addSele>div input");
            let input_4_1 = $(".investTableBody tr:nth-last-child(3) td:nth-child(3) input");
            let input_4_2 = $(".investTableBody tr:nth-last-child(2) td:nth-child(3) input");
            if(num==1 || num=="预备费(按投资额)"){
                input.attr("readonly","readonly").removeClass("focused");
                if(str=="change"){
                    input.val("");
                    input.attr("data-num","");
                }
                input_4_1.removeAttr("readonly");
                input_4_2.removeAttr("readonly");
            }else{
                input.removeAttr("readonly");
                input_4_1.attr("readonly","readonly").removeClass("focused");
                input_4_2.attr("readonly","readonly").removeClass("focused");
            }
            if($scope.selPreCost!=num){
                if(str=="change"){
                    input_4_1.attr("data-num","");
                    input_4_1.val("");
                    input_4_2.attr("data-num","");
                    input_4_2.val("");
                }
                //预备费计算方式切换，重新计算
                $(".investTableBody tr:nth-last-child(2) td:nth-child(8) input").val("");
                $(".investTableBody tr:nth-last-child(3) td:nth-child(8) input").attr("data-num","")
                $(".investTableBody tr:nth-last-child(2) td:nth-child(9) input").val("");
                $(".investTableBody tr:nth-last-child(3) td:nth-child(9) input").val("").attr("data-num","");
                let tr=$(".investTableBody tr:nth-last-child(3)");
                let _this=tr.find("td input");
                let type=tr.attr("data-type");
                let order=tr.attr("data-order");
                let count=tr.attr("data-count");
                getSum(_this,type,order,count,"费用");
                getSum(_this,type,order,count,"下浮后投资");
                getSum(_this,type,order,count,"抵扣额");
            }
            $scope.selPreCost = num;
        }

        //选择公式
        $scope.selectReward = ($event,num,str)=>{
            $($event.target).parents("tr").attr("sleName",num);
            $($event.target).parent().siblings("input").val(str);
            setInput(num,"change");
        }

        function getReaDom(){
            let total = 0;
            let count = 0;
            let tabId = $(".basicForm .slider>ul>li:nth-child(2)>div").attr("data-id");
            $(".constructInvest .investTableBody tbody tr input").map((index,value)=>{
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

        $scope.addLine = ()=>{
            if($(".investTableBody tr").hasClass("inputClick")){
                $(".investTableBody tr").removeClass("add");
                $(".investTableBody tr[data-id='1']").map((index,item)=>{
                    if($(item).hasClass("inputClick")){
                        $scope.investId = $(item).attr("id");
                        if($(item).attr("data-order")){
                            let order = $(item).attr("data-order");
                            let type = $(item).attr("data-type");
                            let trs = $(".investTableBody tr");
                            let list = [];
                            trs.map((index,value)=>{
                                if($(value).attr("data-type")==type&&$(value).attr("data-order")==order){
                                    list.push(value);
                                }
                            })
                            let count = $(list[list.length-1]).attr("data-count");
                            if(count==undefined){
                                count = 0;
                            }
                            let html = `<tr  ng-click="audit($event)" class="add" data-type=${type} data-order=${order} data-count=${parseInt(count)+1}>
                                <td width='5%'>${type}.${order}.${parseInt(count)+1}</td>
                                <td width='12%'><input maxlength="20" type="text" data-num="" ng-blur="getValue($event)" set-focus /></td>
                                <td width="8%"><input type="number" data-num="" min="0" ng-blur="getValue($event,'费用')" set-focus /></td>
                                <td width="8%"><input type="number" data-num="" min="0" max="100"  ng-blur="getValue($event,'下浮率')" set-focus /></td>
                                <td width="8%"><input type="number" maxlength="2" min="0" max="100" data-num="" ng-blur="getValue($event,'抵扣税率')" set-focus ></td>
                                <td width="8%"><input type="number" maxlength="2" data-num="" ng-blur="getValue($event)" readonly="readonly"></td>
                                <td width="8%"><input type="number" data-num="" ng-blur="getValue($event)" readonly="readonly"></td>
                                <td width="8%"><input type="number" data-num="" ng-blur="getValue($event)" ></td>
                                <td width="8%"><input type="number" data-num="" ng-blur="getValue($event)" ></td>
                                </tr>`
                            let temp = $compile(html)($scope);
                            angular.element($(list[list.length-1])).after(temp);
                        }else{
                            let type = $(item).attr("data-type");
                            let trs = $(".investTableBody tr");
                            let list = [];
                            trs.map((index,value)=>{
                                if($(value).attr("data-type")==type){
                                    list.push(value);
                                }
                            })
                            let order = $(list[list.length-1]).attr("data-order");
                            if(order==undefined){
                                order = 0;
                            }
                            let html = `<tr ng-click="audit($event)" class="add" data-type=${type} data-order=${parseInt(order)+1}>
                                <td width='5%'>${type}.${parseInt(order)+1}</td>
                                <td width='8%'><input maxlength="20" type="text" /></td>
                                <td width="8%"><input type="number" ng-blur="getValue($event,'费用')" set-focus /></td>
                                <td width="8%"><input type="number"  min="0" max="100" ng-blur="getValue($event,'下浮率')" set-focus /></td>
                                <td width="8%"><input type="number"  min="0" max="100" maxlength="2" ng-blur="getValue($event,'抵扣税率')" set-focus ></td>
                                <td width="8%"><input type="number" maxlength="2" readonly="readonly"></td>
                                <td width="8%"><input type="number" readonly="readonly"></td>
                                <td width="8%"><input type="number" ></td>
                                <td width="8%"><input type="number" ></td>
                                </tr>`
                            let temp = $compile(html)($scope);
                            angular.element($(list[list.length-1])).after(temp);
                        }
                    }
                })
                setPd();
                commonService.addLine($scope.investId).then((res)=>{
                    if(res.success!=true){
                        return
                    }
                    let investId = res.result.investId;
                    let itemSort = res.result.itemSort;
                    $(".investTableBody .add").attr({"id":investId,"data-sort": itemSort});
                })
                addTd($(".investTableBody .add"),"addTd");
                $(".investTableBody .add td:nth-child(8) input,.investTableBody .add td:nth-child(9) input").attr("readonly","readonly");
                getChange();
                getReaDom();
            }else{
                alert("请选择行");
            }
        }

        $scope.deleLine = ()=>{
            let _this,type,order,count,str;
            if($(".investTableBody tr").hasClass("inputClick")) {
                $(".investTableBody tr").map((index, value)=> {
                    if ($(value).hasClass("inputClick")) {
                        _this=$(value).find("td:nth-child(3)");
                        $scope.investId = $(value).attr("id");
                        let trs = $(".investTableBody tr");
                        type = $(value).attr("data-type");
                        order = $(value).attr("data-order");
                        count = $(value).attr("data-count");
                        let list = [];
                        if (count == undefined) {
                            //两层
                            let orders;
                            trs.map((indexa, valuea)=> {
                                if ($(valuea).attr("data-type") == type && $(valuea).attr("data-order") != undefined) {
                                    list.push(valuea);
                                    orders = $(valuea).attr("data-order");
                                    if (orders > order) {
                                        orders = parseInt(orders) - 1;
                                        $(valuea).attr("data-order", orders);
                                        $(valuea).find("td").eq(0).html(type + '.' + orders);
                                    }
                                    $(value).remove();
                                }
                            })
                        } else {
                            //三层
                            let counts;
                            trs.map((indexb, valueb)=> {
                                if ($(valueb).attr("data-type") == type && $(valueb).attr("data-order") == order && $(valueb).attr("data-count") != undefined) {
                                    list.push(valueb);
                                    counts = $(valueb).attr("data-count");
                                    if (counts > count) {
                                        counts = parseInt(counts) - 1;
                                        $(valueb).attr("data-count", counts);
                                        $(valueb).find("td").eq(0).html(type + '.' + order + '.' + counts);
                                    }
                                    $(value).remove();
                                }
                            })
                        }
                    }
                })
                setPd();
                commonService.deleteLine($scope.investId).then((res)=>{
                    if(res.success==true){
                        getSum(_this,type,order,count,"费用");
                        getSum(_this,type,order,count,"下浮后投资");
                        getSum(_this,type,order,count,"抵扣额");
                        window.constructInvestChange=true;
                        getReaDom();
                    }
                })
            }else{
                alert("请选择行");
            }
        }
    }]);