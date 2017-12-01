angular.module("core").controller('taxesCtrl', ['$scope', '$http','commonService','$uibModal','$window','$compile','$interval',
    function ($scope, $http, commonService,$uibModal,$window,$compile,$interval) {
        let info = $window.sessionStorage.getItem("info").split(",");
        $scope.projectId = parseInt(info[0]);
        $scope.schemeId = parseInt(info[1]);
        let height = $(window).height();
        $(".taxes").height(height*0.76-130);
        $(".taxes .conTop").height(height*0.76-320);
        $(".taxes .body").height(height*0.76-350);
       /* window.interval = $interval(function updataRing(){
            let total = 0;
            let count = 0;
            $(".taxes input").map((index,value)=>{
                if($(value).attr("readonly")!="readonly"){
                    total+=1;
                    if($(value).val()!=""){
                        count+=1;
                    }
                }
            })
            let taxesPar;
            if(total==0){
                taxesPar=100
            }else{
                taxesPar= parseInt(count/total*100);
            }
            window.par_7=taxesPar;
            if(isNaN(window.par_5)||window.par_5==undefined){
                window.par_5=100;
            }
            if(isNaN(window.par_6)||window.par_6==undefined){
                window.par_106=0;
            }
            let par = (window.par_5+window.par_6+taxesPar)/3;
            window.drawRing(100,100,parseInt(par),3);
        },50)*/

        window.taxesChange=false;
        function getChange(){
            $(".taxes .body tbody tr input").change(function() {
                window.taxesChange=true;
            });
        }

        commonService.getTaxes($scope.schemeId).then((res)=> {
            res.result.map((item, index)=> {
                let rate = item.rate==null?"":item.rate;
                let rates = item.rate==null?"":item.rate.toFixed(2);
                let html = `<tr isDefault="${item.isDefault}" defaultNum="${item.defaultNum}" data-id="${item.id}" ng-click="click($event)">
                    <td width="10%">${item.itemSort}</td>
                    <td width="45%"><input type="text" maxlength="20" value="${item.itemName==null?"":item.itemName}"></td>
                    <td width="45%"><input type="number" maxlength="2" min="0" max="99.99999" set-focus value="${rates}" data-num="${rate}"></td>
                </tr>`
                let temp = $compile(html)($scope);
                angular.element($(".taxes .body tbody")).append(temp);
            })
            setHeight();
            getChange();
        })

        function setHeight(){
            if($(".taxes .body table").height()>$(".taxes .body").height()){
                $(".taxes .head").css({"paddingRight":"6px"});
            }else{
                $(".taxes .head").css({"paddingRight":"0px"});
            }
        }

        function getReaDom(){
            let total = 0;
            let count = 0;
            let tabId = $(".basicForm .slider>ul>li:nth-child(4)>ul>li:nth-child(3)").attr("data-id");
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
            saveStatal(total,count,parseInt(tabId));
            getParcent();
        }

        $scope.addTaxes = ()=>{
            $(".taxes .body tbody tr").removeClass("add");
            window.taxesChange=true;
            let length=$(".taxes .body tbody tr").length;
            let html = `<tr ng-click="click($event)" class="add">
                    <td width="10%">${length+1}</td>
                    <td width="45%"><input type="text" maxlength="20" set-focus></td>
                    <td width="45%"><input type="number" maxlength="2" min="0" max="99.99999" set-focus ></td>
                </tr>`
            let temp = $compile(html)($scope);
            angular.element($(".taxes .body tbody")).append(temp);
            setHeight();
            commonService.taxes_addRow($scope.projectId,$scope.schemeId).then((res)=>{
                if(res.success==true){
                    $(".taxes .body .add").attr("data-id",res.result);
                    getReaDom();
                }
            })
        }
        $scope.click = (e)=>{
            let _this = $(e.target);
            $(".taxes .body tr").removeClass("inputClick");
            $(_this).parents("tr").addClass("inputClick");
            if($(_this).parents("tr").attr("isDefault")==1) {
                $(".taxes .deleLine").attr("disabled","disabled");
            }else{
                $(".taxes .deleLine").removeAttr("disabled");
            }
        }
        $scope.deleteTaxes = ()=>{
            window.taxesChange=true;
            let tr = $(".taxes .body tr");
            if(tr.hasClass("inputClick")){
                let id = $(".taxes .body table .inputClick").attr("data-id");
                commonService.taxes_delRow(id).then((res)=>{
                    if(res.success==true){
                        $(".taxes .body table .inputClick").remove();
                        tr.map((index,value)=>{
                            $(value).find("td:nth-child(1)").text(index+1);
                        })
                        setHeight();
                        getReaDom();
                    }
                })
            }else{
                alert("请选择删除行");
            }
        }
    }]);