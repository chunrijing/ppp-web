angular.module('core').controller('paramFormCtrl', ['$scope', '$http','$filter','$rootScope','$uibModal','commonService','$timeout','$compile','$state',"$stateParams","$window",'$interval',
    function ($scope, $http,$filter,$rootScope,$uibModal,commonService,$timeout,$compile,$state,$stateParams,$window,$interval) {
        let info = $window.sessionStorage.getItem("info").split(",");
        $scope.proName = info[3];
        $scope.schemeName = info[2];
        $scope.projectId = parseInt(info[0]);
        $scope.schemeId = parseInt(info[1]);
        //$scope.isReport = parseInt(info[4]);
        let height = $(window).height();
        $(".basicForm .slider").height(height*0.76);
        $(".basicForm .container").height(height*0.76);
        $(".basicForm .title").height(height*0.07);
        $(".basicForm .form").height(height*0.76-140);
        $(".basicForm .form>div").height(height*0.76-200);

        $(".basicForm").scroll(function(){
            console.log("dfjdgh");
        });

        commonService.isOrReport($scope.schemeId).then((res)=>{
            if(res.success==true){
                $scope.isReport = res.result;
                if($scope.isReport==0){
                    $(".basicForm .checkForm").removeAttr("disabled");
                }
            }
        })
        //删除保存的报表信息
        $window.sessionStorage.removeItem("finaceId");
        $window.sessionStorage.removeItem("finaceName");

        //查看数据
        $scope.checkForm = ()=>{
            $state.go("financeForm");
        }

        //侧边栏数据
        commonService.getNav("1").then((res)=>{
            $scope.navList = res.result;
        })

        $scope.sref = ()=>{
            $state.go("project");
        }

        //侧边栏进度条函数
        window.drawRing =(w,h,val,num)=>{
            var c=document.getElementsByClassName('myCanvas')[num];
            var ctx=c.getContext('2d');
            ctx.canvas.width=w;
            ctx.canvas.height=h;
            //圆环有两部分组成，底部灰色完整的环，根据百分比变化的环
            //先绘制底部完整的环
            //起始一条路径
            ctx.beginPath();
            //设置当前线条的宽度
            ctx.lineWidth=5;//10px
            //设置笔触的颜色
            ctx.strokeStyle='#e6e6e6';
            //arc()方法创建弧/曲线（用于创建圆或部分圆）arc(圆心x,圆心y,半径,开始角度,结束角度)
            ctx.arc(50,50,28,0,2*Math.PI);
            //绘制已定义的路径
            ctx.stroke();

            //绘制根据百分比变动的环
            ctx.beginPath();
            ctx.lineWidth=5;
            ctx.strokeStyle='#24d17e';
            //设置开始处为0点钟方向（-90*Math.PI/180）
            //x为百分比值（0-100）
            ctx.arc(50,50,28,-90*Math.PI/180,(val*3.6-90)*Math.PI/180);
            ctx.stroke();
            //绘制中间的文字
            ctx.font='bold  15px Arial';
            ctx.fillStyle='#444444';
            ctx.textBaseline='middle';
            ctx.textAlign='center';
            ctx.fillText(val+'%',50,50);
        }
        $scope.$on('listrepeatFinish', function () {
            getParcent();
            $(".basicForm .slider>ul>li:first-child>div").addClass("activeSlider");
            $(".basicForm .slider>ul>li>ul").hide();
            $(".basicForm .slider>ul>li:nth-child(3)>div").css("fontStyle","italic");
            $scope.tId=1;
            $scope.titleName = "基础信息参数表";
        })

        window.getParcent=function(){
            //侧边百分比
            commonService.findStatal($scope.schemeId).then((res)=>{
                if(res.success!=true){
                    return
                }
                let _par0 = parseInt((res.result[0].realNum)/(res.result[0].accruedNum)*100);
                drawRing(100,100,_par0,0);
                let _par1 = parseInt((res.result[1].realNum)/(res.result[1].accruedNum)*100);
                drawRing(100,100,_par1,1);
                let _par2 = parseInt((res.result[2].realNum)/(res.result[2].accruedNum)*100);
                drawRing(100,100,_par2,2);
                let _par3=parseInt((res.result[3].realNum+res.result[4].realNum+
                res.result[5].realNum)/(res.result[3].accruedNum+res.result[4].accruedNum+res.result[5].accruedNum)*100);
                drawRing(100,100,_par3,3);
                let _par4 = parseInt((res.result[6].realNum+res.result[7].realNum+res.result[8].realNum+res.result[9].realNum+
                        res.result[10].realNum)/(res.result[6].accruedNum+res.result[7].accruedNum+
                    res.result[8].accruedNum+res.result[9].accruedNum+res.result[10].accruedNum)*100);
                drawRing(100,100,_par4,4);
                let _par5 = parseInt((res.result[11].realNum)/(res.result[11].accruedNum)*100);
                drawRing(100,100,_par5,5);
                let _par6 = parseInt((res.result[12].realNum)/(res.result[12].accruedNum)*100);
                drawRing(100,100,_par6,6);
                //_par2==100总包方相关参数表为可选表
                if(_par0==100&&_par1==100&&_par3==100&&_par4==100&&_par5==100&&_par6==100){
                    $(".basicForm .container .btns .prodForm").removeAttr("disabled");
                }else{
                    $(".basicForm .container .btns .prodForm").attr("disabled","disabled");
                }
            })
        }

        //备注信息查询
        function gettableRemark(tId){
            commonService.gettableRemark($scope.schemeId,tId).then((res)=>{
                if(res.success==true){
                    $(".basicForm .container .markText textarea").val(res.result.tRemark);
                }
            })
        }
        //备注信息提交
        function updatetableRemark(tId){
            let info = $(".basicForm .container .markText textarea").val();
            commonService.updatetableRemark($scope.projectId,$scope.schemeId,tId,{"id":null,"tRemark": info}).then((res)=>{})
        }

        //侧边栏切换处理
        $scope.seletForm  = function($event,tName,tId){
            if($scope.tId==1){
                saveBase("",$event,tName,tId);
                return
            }
            if($scope.tId==2){
                saveInvest("",$event,tName,tId);
                return
            }
            if($scope.tId==3){
                saveContractor("",$event,tName,tId);
                return
            }
            if($scope.tId==5){
                saveBusiness("",$event,tName,tId);
                return
            }
            if($scope.tId==6){
                saveIncome("",$event,tName,tId);
                return
            }
            if($scope.tId==7){
                saveTaxes("",$event,tName,tId);
                return
            }
            if($scope.tId==9){
                saveMaterials("",$event,tName,tId);
                return
            }
            if($scope.tId==10){
                saveMaterialsAux("",$event,tName,tId);
                return
            }
            if($scope.tId==11){
                saveMaterialsFuel("",$event,tName,tId);
                return
            }
            if($scope.tId==12){
                saveSalary("",$event,tName,tId);
                return
            }
            if($scope.tId==13){
                saveOtherCost("",$event,tName,tId);
                return
            }
            if($scope.tId==14){
                saveFlowcash("",$event,tName,tId);
                return
            }
            if($scope.tId==41){
                saveInvestment("",$event,tName,tId);
                return
            }
        }
        function styleSlider($event,tName,tId){
            let _this = $event.target;
            if(_this.nodeName=="LI"){
                $(_this).parent("ul").find("li").removeClass("activeSlider");
                $(_this).addClass("activeSlider");
                setglyphicon($(".financeForm .slider>ul>li:nth-child(4)>ul"));
                setglyphicon($(".financeForm .slider>ul>li:nth-child(5)>ul"));
            }else{
                $(".financeForm .slider").find(".glyphicon").css("transform","rotate(0deg)");
                let isChild = $(_this).parents("li").find("div").attr("isChild");
                $(_this).parents("li").siblings().find("div").removeClass("activeSlider");
                $(_this).parents("li").siblings().find("ul").hide();
                if(isChild!=""){
                    let name = $(_this).parents("li").find("ul li:first-child").attr("data-name");
                    let id = parseInt($(_this).parents("li").find("ul li:first-child").attr("data-id"));
                    $scope.titleName=name;
                    $scope.tId=id;
                    $(_this).parents("li").find("ul").show();
                    $(_this).parents("li").find("ul li").removeClass("activeSlider");
                    $(_this).parents("li").find("ul li:first-child").addClass("activeSlider");
                    setglyphicon($(_this).parents("li").find("ul"));
                }else{
                    $(_this).parents("li").find("div").addClass("activeSlider");
                    $(".basicForm .slider").find(".glyphicon").css("transform","rotate(0deg)");
                }
            }
        }

        function setglyphicon(ul){
            if(ul.css("display")=="block"){
                $(".basicForm .slider").find(".glyphicon").css("transform","rotate(0deg)");
                ul.parent("li").find(".glyphicon").css("transform","rotate(180deg)");
            }else{
                ul.siblings("div").find(".glyphicon").css("transform","rotate(0deg)");
            }
        }

        function setSlider($event,tName,tId){
            $(".basicForm .container>.btns .next").show();
            styleSlider($event,tName,tId);
            $scope.tId = tId;
            $scope.titleName = tName;
            if(tId==4){
                $scope.tId = 5;
                $scope.titleName = '负荷率和收入补贴';
            }
            if(tId==8){
                $scope.tId = 9;
                $scope.titleName = '外购原材料参数表';
            }
            gettableRemark($scope.tId);
        }

        //价格体系、单位数据保存
        function saveRaxSys(tId,taxType,unitType){
            commonService.taxSys(
                {
                    "projectId": $scope.projectId,
                    "relevantTable": parseFloat(tId),
                    "schemeId": $scope.schemeId,
                    "taxType": taxType,
                    "unitType": unitType
                }
            ).then((res)=>{})
        }

        window.saveStatal=function(accruedNum,realNum,tabId){
            commonService.saveStatal(
                {
                    "accruedNum": accruedNum,
                    "projectId": $scope.projectId,
                    "realNum": realNum,
                    "schemeId": $scope.schemeId,
                    "tabId": tabId
                }
            ).then((res)=>{
                //console.log(res);
            })

        }

        function obj(fun,str,$event,tName,tId) {
            //基础信息参数
            let bottomRatio = parseFloat($(".basic .bottomRatio").val());
            let constructionRate=parseFloat($(".basic .constructionRate").val());
            let incomeTaxRate=parseFloat($(".basic .incomeTaxRate").val());
            let legalRatio = parseFloat($(".basic .legalRatio").val());
            let otherCost=parseFloat($(".basic .otherCost").val());
            let periodConstruction=parseFloat($(".basic .periodConstruction").val());
            let periodCooperation = parseFloat($(".basic .option").val());
            let periodOptrationa=parseFloat($(".basic .periodOptrationa").val());
            let playbackPeriod=parseFloat($(".basic .playbackPeriod").val());
            let projectCapital = parseFloat($(".basic .projectCapital").val());
            let projectOperation=$(".basic .projectOperation").val();
            projectOperation=projectOperation=='BOT'?1:(projectOperation=='TOT'?2:3);
            let projectReward=$(".basic .projectReward").val();
            projectReward=projectReward=='政府付费'?1:(projectReward=='使用者付费'?2:3);
            let randomRatio = parseFloat($(".basic .randomRatio").val());
            let refundMode=$(".basic .refundMode").val();
            refundMode=refundMode=='等额本息'?1:(refundMode=='等额还本付息'?2:(refundMode=='先息后本'?3:4));
            let shortLoanRate=parseFloat($(".basic .shortLoanRate").val());
            let surplusRatios=parseFloat($(".basic .surplusRatios").val());
            let yieldRate=parseFloat($(".basic .yieldRate").val());
            let depreciationType=$(".basic .depreciationType").val();
            depreciationType=depreciationType=='直线折旧'?1:(refundMode=='双倍余额递减法'?2:3);
            let obj = {
                "bottomRatio": bottomRatio,
                "constructionRate": constructionRate,
                "incomeTaxRate": incomeTaxRate,
                "legalRatio": legalRatio,
                "otherCost": otherCost,
                "periodConstruction": periodConstruction,
                "periodCooperation": periodCooperation,
                "periodOptrationa": periodOptrationa,
                "playbackPeriod": playbackPeriod,
                "projectCapital": projectCapital,
                "projectId": $scope.projectId,
                "projectOperation": projectOperation,
                "projectReward": projectReward,
                "randomRatio": randomRatio,
                "refundMode": refundMode,
                "schemeId": $scope.schemeId,
                "shortLoanRate": shortLoanRate,
                "surplusRatios": surplusRatios,
                "yieldRate": yieldRate,
                "depreciationType": depreciationType
            }
            let object = {
                "baseId": window.baseId,
                "periodConstruction": periodConstruction,
                "periodCooperation": periodCooperation,
                "periodOptrationa": periodOptrationa,
                "projectId": $scope.projectId,
                "schemeId": $scope.schemeId
            }
            if(window.periodConstruction!=periodConstruction){
                commonService.jsqEvent(object).then((res)=>{
                    //console.log(res);
                })
            }
            if(window.periodOptrationa!=periodOptrationa){
                commonService.yyqEvent(object).then((res)=>{
                    //console.log(res);
                })
            }
            if(fun =="saveBasic"){
                commonService.saveBasic(obj).then((res)=>{
                    if(res.success==true) {
                        getParcent();
                        if(str==""){
                            setSlider($event, tName, tId);
                        }
                    }
                })
            }else{
                delete obj.projectId;
                delete obj.schemeId;
                obj.baseId = window.baseId;
                commonService.updateBasis(obj).then((res)=>{
                    if(res.success==true) {
                        getParcent();
                        if(str==""){
                            setSlider($event, tName, tId);
                        }
                    }
                })
            }
        }
        function saveBase(str,$event,tName,tId){
            let tabId = $(".basicForm .slider>ul>li:first-child>div").attr("data-id");
            let total = $(".basic>table input").length;
            let count = 0;
            $(".basic>table input").map((index, value)=> {
                if ($(value).val() != "") {
                    count += 1;
                }
            })
            let err = $("input").hasClass("focused");
            if(err==true){
                return;
            }
            if(window.baseId == null){
                obj("saveBasic",str,$event,tName,tId);
            }else{
                obj("updateBasis",str,$event,tName,tId)
            }
            saveStatal(total,count,parseInt(tabId));
        }

        //建设投资参数表数据更新
        function saveInvest(str,$event,tName,tab){
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
            let err = $("input").hasClass("focused");
            if(err==true){
                return;
            }
            updatetableRemark(parseInt(tabId));
            investPar=100;
            let list=[];
            $(".constructInvest .investTableBody tr").map((index,value)=>{
                let inverstId = parseFloat($(value).attr("id"));
                let itemSort = parseFloat($(value).attr("data-sort"));
                let itemName = $(value).find("td:nth-child(2) input").val();
                itemName=itemName=="预备费(按投资额)"?1:(itemName=="预备费(按费率(%)"?2:itemName);
                let cost = $(value).find("td:nth-child(3) input").attr("data-num");
                cost=cost==""?null:parseFloat(cost);
                let lowerRate = $(value).find("td:nth-child(4) input").attr("data-num");
                lowerRate=lowerRate==""||lowerRate==undefined||isNaN(lowerRate)?null:parseFloat(lowerRate);
                let deductionRate = $(value).find("td:nth-child(5) input").attr("data-num");
                deductionRate=deductionRate==""||deductionRate==undefined||isNaN(deductionRate)?null:parseFloat(deductionRate);
                let depreciation = $(value).find("td:nth-child(6) input").val();
                depreciation=depreciation==""||depreciation==undefined||isNaN(depreciation)?null:parseFloat(depreciation);
                let salvageRate = $(value).find("td:nth-child(7) input").attr("data-num");
                salvageRate=salvageRate==""||salvageRate==undefined||isNaN(salvageRate)?null:parseFloat(salvageRate);
                let lowerInvest = $(value).find("td:nth-child(8) input").attr("data-num");
                lowerInvest=lowerInvest==""||lowerInvest==undefined||isNaN(lowerInvest)?null:parseFloat(lowerInvest);
                let deductionPrice = $(value).find("td:nth-child(9) input").attr("data-num");
                deductionPrice=deductionPrice==""||deductionPrice==undefined||isNaN(deductionPrice)?null:parseFloat(deductionPrice);
                let tds = $(value).find("td[name='addTd']");
                let object={};
                let investYearInfos = [];
                let obj = {};
                tds.map((i,v)=>{
                    let yearNum = i+1;
                    let proportion = $(tds[i]).find("input").attr("data-num");
                    proportion=proportion==""||proportion==undefined||isNaN(proportion)?null:parseFloat(proportion);
                    obj={
                        "proportion": proportion,
                        "yearNum": yearNum
                    }
                    investYearInfos.push(obj);
                })
                object={
                    "cost": cost,
                    "deductionPrice": deductionPrice,
                    "deductionRate": deductionRate,
                    "depreciation": depreciation,
                    "inverstId": inverstId,
                    "investYearInfos": investYearInfos,
                    "itemName": itemName,
                    "itemSort": itemSort,
                    "lowerInvest": lowerInvest,
                    "lowerRate": lowerRate,
                    "salvageRate": salvageRate
                }
                list.push(object);
            })
            commonService.updateInvest($scope.projectId,$scope.schemeId,list).then((res)=>{
                if (res.success == true) {
                    saveStatal(total,count,parseInt(tabId));
                    getParcent();
                    if(str==""){
                        setSlider($event, tName, tab);
                    }
                }
            })
        }
        //总包方数据更新
        function saveContractor(str,$event,tName,tab){
            let total = 0;
            let count = 0;
            let tabId = $(".basicForm .slider>ul>li:nth-child(3)>div").attr("data-id");
            $(".contractor .tableLeft tbody tr input").map((index,value)=>{
                if($(value).attr("readonly")=="readonly"){
                    $(value).removeClass("focused");
                }else{
                    total++;
                    if($(value).val()!=""){
                        count++
                    }
                }
            })
            let body = $(".contractor .tableLeft tbody tr");
            let _2_num = body.find('tr[defaultNum="2"] input').attr("data-num");
            let _3_num = body.find('tr[defaultNum="3"] input').attr("data-num");
            let _4_num = body.find('tr[defaultNum="4"] input').attr("data-num");
            let _7_num = body.find('tr[defaultNum="7"] input').attr("data-num");
            let _8_num = body.find('tr[defaultNum="8"] input').attr("data-num");
            let _9_num = body.find('tr[defaultNum="9"] input').attr("data-num");
            if(parseFloat(_4_num)<=parseFloat(_3_num)){
                body.find('tr[defaultNum="3"] input').addClass("focused");
            }else {
                body.find('tr[defaultNum="3"] input').removeClass("focused");
                if(parseFloat(_3_num)<=parseFloat(_2_num)){
                    body.find('tr[defaultNum="2"] input').addClass("focused");
                }else{
                    body.find('tr[defaultNum="2"] input').removeClass("focused");
                }
            }
            if(parseFloat(_9_num)<=parseFloat(_8_num)){
                body.find('tr[defaultNum="8"] input').addClass("focused");
            }else {
                body.find('tr[defaultNum="8"] input').removeClass("focused");
                if(parseFloat(_8_num)<=parseFloat(_7_num)){
                    body.find('tr[defaultNum="7"] input').addClass("focused");
                }else{
                    body.find('tr[defaultNum="7"] input').removeClass("focused");
                }
            }
            let err = $("input").hasClass("focused");
            if(err==true){
                return;
            }else{
                updatetableRemark(parseInt(tabId));
                contractorPar=100;
                let list=[];
                $(".contractor .tableLeft tbody tr").map((index,item)=>{
                    let id=$(item).attr("data-id");
                    let ratio=$(item).find("td input").attr("data-num");
                    let object={};
                    object.id=parseFloat(id);
                    object.ratio=parseFloat(ratio);
                    list.push(object);
                })
                commonService.updateContractor(list).then((res)=> {
                    if (res.success == true) {
                        saveStatal(total, count, parseInt(tabId));
                        getParcent();
                        if(str==""){
                            setSlider($event, tName, tab);
                        }
                    }
                })
            }
        }
        //负荷率和收入补贴数据更新
        function saveBusiness(str,$event,tName,tab){
            let total = 0;
            let count = 0;
            let tabId = $(".basicForm .slider>ul>li:nth-child(4)>ul>li:first-child").attr("data-id");
            $(".business .table input").map((index,value)=>{
                if($(value).attr("readonly")=="readonly"){
                    $(value).removeClass("focused");
                }else{
                    total++;
                    if($(value).val()!=""){
                        count++;
                    }
                }
            })
            let err = $("input").hasClass("focused");
            if(err==true){
                return;
            }
            updatetableRemark(parseInt(tabId));
            businessPar=100;
            let list=[];
            $(".business .table .rate input").map((index,value)=>{
                $(".business .table .pay input").map((indexs,values)=>{
                    let num = parseFloat($(value).attr("yearNum"));
                    let nums = parseFloat($(values).attr("yearNum"));
                    let rate = parseFloat($(value).attr("data-num"));
                    let pay = parseFloat($(values).attr("data-num"));
                    if(num==nums){
                        let obj = {
                            "optrationalCode": rate,
                            "subsidizeRevenue": pay,
                            "yearNum": num
                        }
                        list.push(obj);
                    }
                })
            })
            commonService.updateBusiness($scope.projectId, $scope.schemeId, list).then((res)=> {
                if (res.success == true) {
                    saveStatal(total, count, parseInt(tabId));
                    getParcent();
                    if(str==""){
                        setSlider($event, tName, tab);
                    }
                }
            })
        }
        //收入预测数据更新
        function saveIncome(str,$event,tName,tab){
            let total = 0;
            let count = 0;
            let tabId = $(".basicForm .slider>ul>li:nth-child(4)>ul>li:nth-child(2)").attr("data-id");
            $(".income input").map((index,value)=>{
                if($(value).attr("readonly")!="readonly"){
                    total+=1;
                    if($(value).val()!=""){
                        count+=1;
                    }
                }
            })
            $(".income .body tr:not(.total) input").map((index,value)=>{
                if($(value).attr("readonly")=="readonly"){
                    $(value).removeClass("focused");
                }
            })
            let err = $("input").hasClass("focused");
            if(err==true){
                return;
            }
            updatetableRemark(parseInt(tabId));
            let unitType,taxType;
            let tId = $(".slider>ul>li:nth-child(4) ul li:nth-child(2)").attr("data-id");
            if($(".income .tax>input").val()=="含税"){
                taxType=0;
            }else{
                taxType=1;
            }
            if($(".income .unit>input").val()=="万元"){
                unitType=0;
            }else{
                unitType=1;
            }
            saveRaxSys(tId,taxType,unitType);
            let list = [];
            $(".income .body tr:not(.total)").map((index,value)=>{
                let id = parseInt($(value).attr("data-id"));
                let itemSort = parseInt($(value).find("td:first-child").text());
                let itemName = $(value).find("td:nth-child(2) input").val();
                let amount = parseInt($(value).find("td:nth-child(3) input").val());
                let outPutUnit = $(value).find("td:nth-child(4) input").val();
                let addTax = parseFloat($(value).find("td:nth-child(5) input").attr("data-num"));
                let taxPrice  = parseFloat($(value).find("td:nth-child(6) input").attr("data-num"));
                let ntaxPrice = parseFloat($(value).find("td:nth-child(7) input").attr("data-num"));
                let businessIncome = parseFloat($(value).find("td:nth-child(8) input").attr("data-num"));
                let obj={
                    "id": id,
                    "amount": amount,
                    "businessIncome": businessIncome,
                    "itemName": itemName,
                    "itemSort": itemSort,
                    "ntaxPrice": ntaxPrice,
                    "outPutUnit": outPutUnit,
                    "taxPrice": taxPrice,
                    "addTax": addTax
                };
                list.push(obj);
            });
            commonService.updataTax($scope.projectId, $scope.schemeId, list).then((res)=> {
                if (res.success == true) {
                    saveStatal(total, count, parseInt(tabId));
                    getParcent();
                    if(str==""){
                        setSlider($event, tName, tab);
                    }
                }
            })
        }
        //附加税金
        function saveTaxes(str,$event,tName,tab){
            let total = 0;
            let count = 0;
            let tabId = $(".basicForm .slider>ul>li:nth-child(4)>ul>li:nth-child(3)").attr("data-id");
            let err = false;
            updatetableRemark(parseInt(tabId));
            $(".taxes .body tr input").map((index,value)=>{
                if($(value).attr("readonly")=="readonly"){
                    $(value).removeClass("focused");
                }else{
                    total+=1;
                    if($(value).val()!=""){
                        count+=1;
                    }
                }
            })
            err = $("input").hasClass("focused");
            if(err==true){
                return;
            }
            taxesPar=100;
            let list = [];
            $(".taxes .body tr").map((i,v)=>{
                let isDefault = parseInt($(v).attr("isDefault"));
                let defaultNum = parseInt($(v).attr("defaultNum"));
                let sort = parseFloat($(v).find("td:first-child").text());
                let name = $(v).find("td:nth-child(2) input").val();
                let rate = parseFloat($(v).find("td:nth-child(3) input").attr("data-num"))
                let obj = {
                    "defaultNum": defaultNum,
                    "isDefault": isDefault,
                    "itemName": name,
                    "itemSort": sort,
                    "rate": rate
                }
                list.push(obj);
            })

            commonService.updataTaxes($scope.projectId, $scope.schemeId, list).then((res)=> {
                if (res.success == true) {
                    saveStatal(total, count, parseInt(tabId));
                    getParcent();
                    if(str==""){
                        setSlider($event, tName, tab);
                    }
                }
            });

        }
        //外购原材料参数表数据更新
        function saveMaterials(str,$event,tName,tab){
            let total = 0;
            let count = 0;
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
            let err = $("input").hasClass("focused");
            if(err==true){
                return;
            }
            let unitType,taxType;
            let tId = $(".slider>ul>li:nth-child(5) ul li:nth-child(1)").attr("data-id");
            updatetableRemark(parseInt(tId));
            if($(".materials .tax>input").val()=="含税"){
                taxType=0;
            }else{
                taxType=1;
            }
            if($(".materials .unit>input").val()=="万元"){
                unitType=0;
            }else{
                unitType=1;
            }
            saveRaxSys(tId,taxType,unitType);
            let list = [];
            $(".materials .body tr:not(.total)").map((index,value)=>{
                let matName = $(value).find("td:nth-child(2) input").val();
                let matAmount = parseInt($(value).find("td:nth-child(3) input").val());
                let amountUnit = $(value).find("td:nth-child(4) input").val();
                let addTax = parseFloat($(value).find("td:nth-child(5) input").attr("data-num"));
                let taxPrice  = parseFloat($(value).find("td:nth-child(6) input").attr("data-num"));
                let unTaxPrice = parseFloat($(value).find("td:nth-child(7) input").attr("data-num"));
                let cost = parseFloat($(value).find("td:nth-child(8) input").attr("data-num"));
                let obj={
                    "matAmount": matAmount,
                    "cost": cost,
                    "matName": matName,
                    "unTaxPrice": unTaxPrice,
                    "amountUnit": amountUnit,
                    "taxPrice": taxPrice,
                    "addTax": addTax,
                    "projectId": $scope.projectId,
                    "schemeId": $scope.schemeId
                };
                list.push(obj);
            })
            commonService.updataMaterials(list).then((res)=> {
                if (res.success == true) {
                    saveStatal(total,count,parseInt(tId));
                    getParcent();
                    if(str==""){
                        setSlider($event, tName, tab);
                    }
                }
            })
        }
        //外购原材料辅助数据更新
        function saveMaterialsAux(str,$event,tName,tab){
            let total = 0;
            let count = 0;
            $(".materialsAux .body tr input").map((index,value)=>{
                if($(value).attr("readonly")=="readonly"){
                    $(value).removeClass("focused");
                }else{
                    total+=1;
                    if($(value).val()!=""){
                        count+=1;
                    }
                }
            })
            let err = $("input").hasClass("focused");
            if(err==true){
                return;
            }
            materialsAuxPar=100;
            let taxType;
            let tId = $(".slider>ul>li:nth-child(5) ul li:nth-child(2)").attr("data-id");
            updatetableRemark(parseInt(tId));
            if($(".materialsAux .tax>input").val()=="含税"){
                taxType=0;
            }else{
                taxType=1;
            }
            saveRaxSys(tId,taxType,null);
            let list = [];
            $(".materialsAux .body tr").map((index,value)=>{
                let defaultNum = parseInt($(value).attr("defaultNum"));
                let auxName = $(value).find("td:nth-child(2) input").val();
                let addTax = parseFloat($(value).find("td:nth-child(3) input").attr("data-num"));
                let taxCost  = parseFloat($(value).find("td:nth-child(4) input").attr("data-num"));
                let unTaxCost = parseFloat($(value).find("td:nth-child(5) input").attr("data-num"));
                let obj={
                    "defaultNum": defaultNum,
                    "auxName": auxName,
                    "taxCost": taxCost,
                    "unTaxCost": unTaxCost,
                    "addTax": addTax,
                    "projectId": $scope.projectId,
                    "schemeId": $scope.schemeId
                };
                list.push(obj);
            })
            commonService.updataMaterialsAux(list).then((res)=> {
                if (res.success == true) {
                    saveStatal(total,count,parseInt(tId));
                    getParcent();
                    if(str==""){
                        setSlider($event, tName, tab);
                    }
                }
            })
        }
        //外购燃料与动力参数表数据更新
        function saveMaterialsFuel(str,$event,tName,tab){
            let total = 0;
            let count = 0;
            let tabId = $(".basicForm .slider>ul>li:nth-child(5)>ul>li:nth-child(3)").attr("data-id");
            let err = false;
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
            err = $("input").hasClass("focused");
            if(err==true){
                return;
            }
            updatetableRemark(parseInt(tabId));
            materialsFuelPar=100;
            let unitType,taxType;
            let tId = $(".slider>ul>li:nth-child(5) ul li:nth-child(3)").attr("data-id");
            if($(".materialsFuel .tax>input").val()=="含税"){
                taxType=0;
            }else{
                taxType=1;
            }
            if($(".materialsFuel .unit>input").val()=="万元"){
                unitType=0;
            }else{
                unitType=1;
            }
            saveRaxSys(tId,taxType,unitType);
            let list = [];
            $(".materialsFuel .body tr:not(.fixLine,.total)").map((index,value)=>{
                let fuelName = $(value).find("td:nth-child(2) input").val();
                let fuelAmount = parseInt($(value).find("td:nth-child(3) input").val());
                let amountUnit = $(value).find("td:nth-child(4) input").val();
                amountUnit=amountUnit==""?null:amountUnit;
                let addTax = parseFloat($(value).find("td:nth-child(5) input").attr("data-num"));
                let taxPrice  = parseFloat($(value).find("td:nth-child(6) input").attr("data-num"));
                let unTaxPrice = parseFloat($(value).find("td:nth-child(7) input").attr("data-num"));
                let cost = parseFloat($(value).find("td:nth-child(8) input").attr("data-num"));
                let fuelType = parseInt($(value).attr("data-type"));
                let obj={
                    "addTax": addTax,
                    "amountUnit": amountUnit,
                    "cost": cost,
                    "fuelAmount": fuelAmount,
                    "fuelName": fuelName,
                    "fuelType": fuelType,
                    "taxPrice": taxPrice,
                    "unTaxPrice": unTaxPrice,
                    "projectId": $scope.projectId,
                    "schemeId": $scope.schemeId
                };
                list.push(obj);
            })
            commonService.updataMaterialsFuel(list).then((res)=> {
                if (res.success == true) {
                    saveStatal(total, count, parseInt(tabId));
                    getParcent();
                    if(str==""){
                        setSlider($event, tName, tab);
                    }
                }
            })
        }
        //工资及福利费参数表数据更新
        function saveSalary(str,$event,tName,tab){
            let total = 0;
            let count = 0;
            let tabId = $(".basicForm .slider>ul>li:nth-child(5)>ul>li:nth-child(4)").attr("data-id");
            let err = false;
            $(".salary .body tr input").map((index,value)=>{
                if($(value).attr("readonly")=="readonly"){
                    $(value).removeClass("focused");
                }else{
                    total+=1;
                    if($(value).val()!=""){
                        count+=1;
                    }
                }
            })
            err = $("input").hasClass("focused");
            if(err==true){
                return;
            }
            updatetableRemark(parseInt(tabId));
            salaryPar=100;
            let list = [];
            $(".salary .body tr").map((index,value)=>{
                let isDefault = parseInt($(value).attr("isDefault"));
                let employType = $(value).find("td:nth-child(2) input").val();
                let peopleNums = parseInt($(value).find("td:nth-child(3) input").val());
                let yearSalaryAvg = parseFloat($(value).find("td:nth-child(4) input").attr("data-num"));
                let welfare  = parseFloat($(value).find("td:nth-child(5) input").attr("data-num"));
                let total = parseFloat($(value).find("td:nth-child(6) input").attr("data-num"));
                let costType = parseFloat($(value).find("td:nth-child(7) input").attr("data-num"));
                let obj={
                    "isDefault": isDefault,
                    "costType": costType,
                    "employType": employType,
                    "peopleNums": peopleNums,
                    "projectId": $scope.projectId,
                    "schemeId": $scope.schemeId,
                    "total": total,
                    "welfare": welfare,
                    "yearSalaryAvg": yearSalaryAvg
                };
                list.push(obj);
            })

            commonService.updataSalary(list).then((res)=> {
                if (res.success == true) {
                    saveStatal(total,count,parseInt(tabId));
                    getParcent();
                    if(str==""){
                        setSlider($event, tName, tab);
                    }
                }
            })

        }
        //其它费用参数表数据更新
        function saveOtherCost(str,$event,tName,tab){
            let total = 0;
            let count = 0;
            let tabId = $(".basicForm .slider>ul>li:nth-child(5)>ul>li:nth-child(5)").attr("data-id");
            let err = false;
            $(".otherCost .body tr input").map((index,value)=>{
                if($(value).attr("readonly")=="readonly"){
                    $(value).removeClass("focused");
                }else{
                    total+=1;
                    if($(value).val()!=""){
                        count+=1;
                    }
                }
            })
            err = $("input").hasClass("focused");
            if(err==true){
                return;
            }
            updatetableRemark(parseInt(tabId));
            otherCostPar=100;
            let list = [];
            $(".otherCost .body tr").map((index,value)=>{
                let defaultNum = $(value).find("td:nth-child(1)").text();
                let itemName = $(value).find("td:nth-child(2)").text();
                let itemValue = parseFloat($(value).find("td:nth-child(3) input").attr("data-num"));
                let obj={
                    "defaultNum": defaultNum,
                    "itemName": itemName,
                    "itemValue": itemValue,
                    "projectId": $scope.projectId,
                    "schemeId": $scope.schemeId
                }
                list.push(obj);
            })

            commonService.updataOtherCost(list).then((res)=> {
                if (res.success == true) {
                    saveStatal(total,count,parseInt(tabId));
                    getParcent();
                    if(str==""){
                        setSlider($event, tName, tab);
                    }
                }
            })

        }
        //流动资金估算参数表数据更新
        function saveFlowcash(str,$event,tName,tab){
            let total = 0;
            let count = 0;
            let tabId = $(".basicForm .slider>ul>li:nth-child(6)>div").attr("data-id");
            let err = false;
            $(".flowcash .tableLeft input").map((index,value)=>{
                if($(value).attr("readonly")=="readonly"){
                    $(value).removeClass("focused");
                }else{
                    total+=1;
                    if($(value).val()!=""){
                        count+=1;
                    }
                }
            })
            err = $("input").hasClass("focused");
            if(err==true){
                return;
            }
            flowcashPar=100;
            let obj;
            if($(".flowcash .tableLeft table").length!=0) {
                let trs = $(".flowcash .tableLeft tbody");
                let prepayments = trs.find("tr:first-child input").val();
                let finishedGoods = trs.find("tr:nth-child(2) input").val();
                let sourceMaterial = trs.find("tr:nth-child(3) input").val();
                let cash = trs.find("tr:nth-child(4) input").val();
                let fuel = trs.find("tr:nth-child(5) input").val();
                let productingGoods = trs.find("tr:nth-child(6) input").val();
                let accountsPayable = trs.find("tr:nth-child(7) input").val();
                obj={
                    "accountsPayable": parseInt(accountsPayable),
                    "cash": parseInt(cash),
                    "costRatio": null,
                    "estimateWay": 1,
                    "finishedGoods": parseInt(finishedGoods),
                    "fuel": parseInt(fuel),
                    "incomeRatio": null,
                    "manualFill": null,
                    "prepayments": parseInt(prepayments),
                    "productingGoods": parseInt(productingGoods),
                    "sourceMaterial": parseInt(sourceMaterial)
                }
            }
            if($(".flowcash .tableLeft>div").hasClass("costRatio")){
                let costRatio = $(".flowcash .costRatio>input").attr("data-num");
                obj={
                    "accountsPayable": null,
                    "cash": null,
                    "costRatio": parseFloat(costRatio),
                    "estimateWay": 2,
                    "finishedGoods": null,
                    "fuel": null,
                    "incomeRatio": null,
                    "manualFill": null,
                    "prepayments": null,
                    "productingGoods": null,
                    "sourceMaterial": null
                }
            }
            if($(".flowcash .tableLeft>div").hasClass("incomeRatio")){
                let incomeRatio = $(".flowcash .incomeRatio>input").attr("data-num");
                obj={
                    "accountsPayable": null,
                    "cash": null,
                    "costRatio": null,
                    "estimateWay": 3,
                    "finishedGoods": null,
                    "fuel": null,
                    "incomeRatio": parseFloat(incomeRatio),
                    "manualFill": null,
                    "prepayments": null,
                    "productingGoods": null,
                    "sourceMaterial": null
                }
            }
            if($(".flowcash .tableLeft>div").hasClass("manualFill")){
                let manualFill = $(".flowcash .manualFill>input").attr("data-num");
                obj={
                    "accountsPayable": null,
                    "cash": null,
                    "costRatio": null,
                    "estimateWay": 4,
                    "finishedGoods": null,
                    "fuel": null,
                    "incomeRatio": null,
                    "manualFill": parseFloat(manualFill),
                    "prepayments": null,
                    "productingGoods": null,
                    "sourceMaterial": null
                }
            }
            obj.id=window.id;
            commonService.updataFlowcash($scope.projectId, $scope.schemeId, obj).then((res)=> {
                saveStatal(total,count,parseInt(tabId));
                getParcent();
                if(str==""){
                    setSlider($event, tName, tab);
                }
            })
        }
        //维持运营投资参数表更新
        function saveInvestment(str,$event,tName,tab){
            let total = 0;
            let count = 0;
            let tabId = $(".basicForm .slider>ul>li:nth-child(7)>div").attr("data-id");
            let err = false;
            $(".depriciationx .body tr input").map((index,value)=>{
                if($(value).attr("readonly")=="readonly"){
                    $(value).removeClass("focused");
                }else{
                    total+=1;
                    if($(value).val()!=""){
                        count+=1;
                    }
                }
            })
            err = $("input").hasClass("focused");
            if(err==true){
                return;
            }
            updatetableRemark(parseInt(tabId));
            let list = [];
            $(".depriciationx .body tr").map((index,value)=>{
                let itemName = $(value).find("td:nth-child(1) input").val();
                let depbYear = $(value).find("td:nth-child(2) input").attr("data-num");
                depbYear = depbYear==""?null:parseFloat(depbYear);
                let rate = $(value).find("td:nth-child(3) input").attr("data-num");
                rate = rate==""?null:parseFloat(rate);
                let yyqYear = $(value).find("td:nth-child(4) input").val();
                yyqYear = yyqYear==""?null:parseFloat(yyqYear);
                let assetSum = $(value).find("td:nth-child(5) input").attr("data-num");
                assetSum = assetSum==""?null:parseFloat(assetSum);
                let obj={
                    "assetSum": assetSum,
                    "depbYear": depbYear,
                    "itemName": itemName,
                    "projectId": $scope.projectId,
                    "rate": rate,
                    "schemeId": $scope.schemeId,
                    "yyqYear": yyqYear
                }
                list.push(obj);
            })

            commonService.updateInvestment(list).then((res)=> {
                if (res.success == true) {
                    saveStatal(total,count,parseInt(tabId));
                    getParcent();
                    if(str==""){
                        setSlider($event, tName, tab);
                    }
                }
            })
        }
        $scope.save = ()=>{
            if($scope.tId==1){
                saveBase("prod");
            }
            if($scope.tId==2){
                saveInvest("prod");
            }
            if($scope.tId==3){
                saveContractor("prod");
            }
            if($scope.tId==5){
                saveBusiness("prod");
            }
            if($scope.tId==6){
                saveIncome("prod");
            }
            if($scope.tId==7){
                saveTaxes("prod");
            }
            if($scope.tId==9){
                saveMaterials("prod");
            }
            if($scope.tId==10){
                saveMaterialsAux("prod");
            }
            if($scope.tId==11){
                saveMaterialsFuel("prod");
            }
            if($scope.tId==12){
                saveSalary("prod");
            }
            if($scope.tId==13){
                saveOtherCost("prod");
            }
            if($scope.tId==14){
                saveFlowcash("prod");
            }
            if($scope.tId==41){
                saveInvestment("prod");
            }
        }
        $scope.prodForm = ()=>{
            if($scope.tId==1){
                saveBase("prod");
            }
            if($scope.tId==2){
                saveInvest("prod");
            }
            if($scope.tId==3){
                saveContractor("prod");
            }
            if($scope.tId==5){
                saveBusiness("prod");
            }
            if($scope.tId==6){
                saveIncome("prod");
            }
            if($scope.tId==7){
                saveTaxes("prod");
            }
            if($scope.tId==9){
                saveMaterials("prod");
            }
            if($scope.tId==10){
                saveMaterialsAux("prod");
            }
            if($scope.tId==11){
                saveMaterialsFuel("prod");
            }
            if($scope.tId==12){
                saveSalary("prod");
            }
            if($scope.tId==13){
                saveOtherCost("prod");
            }
            if($scope.tId==14){
                saveFlowcash("prod");
            }
            if($("input").hasClass("focused")){
                return
            }
            //显示加载中
            layer.load(0, {shade: 0.1,content:'数据生成中',success: function(layero){
                layero.find('.layui-layer-content').css('padding-top', '40px');
            }});
            commonService.report($scope.projectId,$scope.schemeId).then((res)=>{
                if(res.code==200){
                    //关
                    setTimeout(function(){
                        layer.closeAll('loading');
                    },10);
                    $state.go("financeForm");
                }else{
                    setTimeout(function(){
                        layer.closeAll('loading');
                    },10);
                    alert(res.msg);
                    if(res.code == 201){
                        setInterval(function(){
                            $state.go("login");
                        },2000)
                    }else{
                        $state.go("login");
                    }
                }
            })
        }
    }]);