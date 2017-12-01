angular.module('core').controller('projectCtrl', ['$scope', '$http','$rootScope','$uibModal','commonService','$timeout','$compile','$state',"$stateParams","$window",
    function ($scope, $http,$rootScope,$uibModal,commonService,$timeout,$compile,$state,$stateParams,$window) {
        let height = $(window).height();
        $(".main-container .sidebar").height(height-100);
        $(".main-container .plan").height(height-350);
        $(".main-container .plan .planTable").height(height-540);
        $(".main-container .plan .planTable .tbody").height(height-600);
        let proUlHeight = $(".main-container .proUl").height();
        let pageSize = Math.ceil(proUlHeight/60);
        //获取项目图片
        $scope.imgList=[];
        function getImgList(pageNo,str){
            if(str=="scroll"){
                $scope.imgLists = $scope.imgList;
            }
            commonService.getProjectImg({
                "name": $scope.namePro,
                "pageNo": pageNo,
                "pageSize": pageSize
            }).then((repon)=>{
                if(repon.success==false||repon.result.length==0){
                    return
                }
                repon.result.map((items)=>{
                    if(items.image==null||items.image==""){
                        items.image="imgs/last.jpg";
                    }
                    if(str=="scroll"){
                        $scope.imgLists.push(items);
                    }
                })
                $scope.imgList = repon.result;
                if(str=="scroll"){
                    $scope.imgList=$scope.imgLists;
                }
                getImg();
            })
        }

        function getImg(){
            if($scope.imgList!=undefined){
                $scope.imgList.map((items)=>{
                    $('.sidebar .proUl li[data-id="'+items.projectId+'"]').find("img").attr("src",items.image);
                    if(items.projectId==$scope.projectId){
                        $scope.image= items.image;
                    }
                })
            }
        }

        $scope.proList=[];

        //获取项目信息
        function getProject(pageNo,str){
            $(".main-container .proUl>h4").remove();
            if(str=="scroll"){
                $scope.proLists = $scope.proList;
            }
            commonService.getProject({
                "name": $scope.namePro,
                 "pageNo": pageNo,
                 "pageSize": pageSize
            }).then(function(res){
                if(res.code!=200){
                    return
                }
                $scope.totalPages =res.result.totalPages;
                if(res.result.content.length==0){
                    let html=`<h4>无项目</h4>`;
                    $(".main-container .proUl").append(html);
                    $scope.proList=[];
                    return
                }
                res.result.content.map((item)=>{
                    item.startTime = item.startTime==null?"":setDate(item.startTime);
                    if(str=="scroll"){
                        $scope.proLists.push(item);
                    }
                })
                $scope.proList = res.result.content;
                if(str=="scroll"){
                    $scope.proList=$scope.proLists;
                }
                _slider=1;
                $scope.completeRepeat();
                //默认第一个项目信息加载
                let proInfo =  $scope.proList[0];
                $scope.proSelect = proInfo;
                $scope.name = proInfo.name;
                $scope.address = proInfo.address;
                $scope.organization = proInfo.organization;
                $scope.socialCapital = proInfo.socialCapital;
                $scope.startTime = proInfo.startTime;
                $scope.constructionScale = proInfo.constructionScale;
                $scope.invest = proInfo.invest;
                $scope.address = proInfo.address;
                findIndustType(proInfo.industryType);
                $scope.projectId = proInfo.projectId;
                $scope.currentPage=1;
                $scope.schemeName = "";
                getPlanList();
                getImgList(pageNo,str);
            })
        }

        let _slider=1;
        $scope.completeRepeat = ()=>{
            $timeout(()=>{
                $(".main-container .proUl").scroll(function(){
                    let length = $(".main-container .proUl li").length;
                    let page = Math.ceil(length/pageSize);
                    if((($(".main-container .proUl").scrollTop()+$(".main-container .proUl").height()+5))>=page*pageSize*60){
                        if(page!=_slider){
                            return
                        }else{
                            if($scope.totalPages<page+1){
                                return
                            }
                            getProject(page+1,"scroll");
                            _slider++;
                        }
                    }
                });
            },10)
            getPlanHeight();
        }

        $scope.jobList = ["能源","交通运输","水利建设","生态建设和环境保护","农业","林业","科技","保障性安居工程","医疗卫生","养老","教育","文化","体育","市政工程","政府基础设施","城镇综合开发","旅游","社会保障","其他"]
        function findIndustType(industryType){
            $scope.jobList.map((v,i)=>{
                if(industryType==i+1){
                    $scope.industryType=v;
                }
            })
        }
        //日期格式转换
        function setDate(time){
            let startTime = new Date(time);
            let month = startTime.getMonth()<9?("0"+(startTime.getMonth()+1)):(startTime.getMonth()+1);
            let day = startTime.getDate()<9?("0"+(startTime.getDate())):(startTime.getDate());
            startTime = startTime.getFullYear()+"-"+month+"-"+day;
            return startTime;
        }
        $scope.namePro = "";
        getProject(1);

        //选择项目加载相关信息
        $scope.proInfo = function($event,item){
            $(".main-container .proUl>li:first-child").css({"borderLeft": "4px solid #fff","background":"white"});
            $(".main-container .proUl>li").removeClass("activeSlider");
            if($event.target.nodeName == "LI"){
                $($event.target).addClass("activeSlider");
            }else{
                $($event.target).parent().addClass("activeSlider");
            }
            $scope.proSelect = item;
            $scope.name = item.name;
            $scope.address = item.address;
            $scope.organization = item.organization;
            $scope.socialCapital = item.socialCapital;
            $scope.startTime = item.startTime;
            $scope.constructionScale = item.constructionScale;
            $scope.invest = item.invest;
            $scope.address = item.address;
            $scope.projectId = item.projectId;
            $scope.currentPage=1;
            $scope.schemeName = "";
            getPlanList();
            getImg();
        }
        //搜索项目
        $scope.searchPro = function(e,searchText){
            if(e&&e.keyCode!=13){
                return false;
            }
            if(searchText == undefined||($scope.name==searchText)/*已存在搜索*/){
                return;
            } else {
                $scope.namePro = searchText;
                getProject(1);
            }
        }
        //添加/编辑项目弹框
        $scope.addPro = function(str){
            if(str == 'editPro'){
                if($scope.proList.length==0){
                    alert("请添加项目");
                    return
                }
            }
            $scope.items = {
                str: str,
                info: $scope.proSelect,
                image: $scope.image
            }
            var modalInstance = $uibModal.open({
                windowClass: 'pro-modal',
                backdrop: 'static',
                animation: false,
                size: 'lg',
                templateUrl: 'template/core/addProModal.html',
                controller: 'addModalCtrl',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.namePro = "";
                getProject(1);
            }, function (selectedItem) {

            })
        }

        $scope.$on("listrepeatFinish",function(){
            //getPlanHeight();
        })
        function getPlanHeight(){
            let height = $(".main-container .tbody").height();
            if($(".main-container .tbody table").height()>=height){
                $(".main-container .thead").css({paddingRight: '6px'});
            }else{
                $(".main-container .thead").css({paddingRight: '0px'});
            }
        }

        //删除项目/方案
        $scope.delete = function(str){
            if(str == "pro"){
                if($scope.proList.length==0){
                    alert("请创建项目!");
                    return;
                }
                $scope.items = {
                    str: str,
                    ids: $scope.projectId
                }
            }else{
                let check = $(".checkInput");
                let ids = [];
                check.map((index,item)=>{
                    if($(item).hasClass("background")&&$(item).parents("tr").attr("data-id")!=undefined){
                        ids.push($(item).parents("tr").attr("data-id"));
                    }
                })
                if(ids.length == 0){
                    alert("请选择方案!");
                    return;
                }
                $scope.items = {
                    str: str,
                    ids: ids
                }
            }
            var modalInstance = $uibModal.open({
                windowClass: 'delete-modal',
                backdrop: 'static',
                animation: false,
                size: 'lg',
                templateUrl: 'template/core/deleteModal.html',
                controller: 'deleteModalCtrl',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                getProject(1);
            }, function (selectedItem) {
                if(selectedItem=="deletePlan"){
                    $scope.currentPage = 1;
                    getPlanList();
                }
            })
        }

        //获取方案列表
        function getPlanList(){
            $scope.planList = [];
            $(".main-container .planTable .tbody>h4").remove();
            commonService.getPlan({
               /* "pageNo": $scope.currentPage,
                "pageSize": $scope.pageSize,*/
                "projectId": $scope.projectId,
                "schemeName": $scope.schemeName
            }).then(function(res){
                if(res.success!=true){
                    return
                }
                //$scope.totalItems = res.result.totalElements;
                $(".checkInput").removeClass("background");
                let count;
                let parcent;
                if(res.result.length==0||res.result==null){
                    let html=`<h4>无方案</h4>`;
                    $(".main-container .planTable .tbody").append(html);
                    //return
                }
                res.result.map((item)=>{
                    item.createDate = setDate(item.createDate);
                    commonService.findStatal(item.schemeId).then((resp)=>{
                        if(resp.success!=true){
                            return
                        }
                        let count=0;
                        let total=0;
                        resp.result.map((item)=>{
                            count+=item.realNum;
                            total+=item.accruedNum;
                        })
                        let parcent=count/total*100;
                        item.parcent = parseInt(parcent)+"%";
                        item.parcents = parseInt(parcent);
                    })
                })
                $scope.planList = res.result;
                //getPlanHeight();
            })
        }


        //进度条/
        /*$scope.dynamic = 10;
        $scope.type = $scope.dynamic+"%";*/

        //新建/编辑方案弹框
        $scope.addPlan = function (str,item) {
            if(str=="addPlan"){
                if($scope.proList.length==0){
                    alert("请先添加项目！")
                    return
                }
            }

            $scope.items = {
                str: str,
                info: item,
                projectId: $scope.projectId
            }
            var modalInstance = $uibModal.open({
                windowClass: 'plan-modal',
                backdrop: 'static',
                animation: false,
                size: 'lg',
                templateUrl: 'template/core/addPlanModal.html',
                controller: 'addModalCtrl',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                if(selectedItem!="equal"){
                    $scope.currentPage=1;
                    getPlanList();
                }
            }, function (selectedItem) {
                //console.log("2",selectedItem);
            })
        }

        function getDumpVal() {
            dumpVal = $('.dump-inp input').val();
            return dumpVal;
        }
        let tableHeight = $(".plan .planTable").height();
        $scope.maxSize = 5;
        $scope.pageSize = Math.floor(tableHeight/45)-1;
        $scope.getDumpOk = function (e,numPages) {
            if (e && e.keyCode != 13 && e.keyCode != 10) {
                return false;
            }
            let page = parseInt(getDumpVal());
            if (page > numPages) {
                alert('查询页码超出范围，请重新输入');
                $('.dump-inp input').val("");
                return false;
            }
            $scope.setPage(getDumpVal());
            getPlanList();
        }
        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.pageChanged = function() {
            getPlanList();
        };
        $scope.checkTh = function($event){
            $($event.target).toggleClass("background");
            if($($event.target).hasClass("background")){
                $(".checkInput").addClass("background");
            }else{
                $(".checkInput").removeClass("background");
            }
        }
        $scope.check = function($event){
            $($event.target).toggleClass("background");
            let trLength = $(".main-container .plan table tbody tr").length;
            let count = $(".main-container .plan table tbody tr .background").length
            if(trLength==count){
                $(".main-container .plan table thead  .checkInput").addClass("background");
            }else{
                $(".main-container .plan table thead  .checkInput").removeClass("background");
            }
        }
        //方案搜索
        $scope.searchPlan = function(e,searchText){
            if(e&&e.keyCode!=13){
                return false;
            }
            if(searchText == undefined||($scope.schemeName==searchText)/*已存在搜索*/){
                return;
            } else {
                $scope.schemeName = searchText;
                $scope.currentPage  = 1;
                getPlanList();
            }
        }

        //方案对比
        $scope.contrast = ()=>{
            let check = $(".checkInput");
            let count = 0;
            let scheList = [];
            let arr=[];
            check.map((index,item)=>{
                if($(item).hasClass("background")&&$(item).parents("tr").attr("data-id")!=undefined){
                    count++;
                    let id=($(item).parents("tr").attr("data-id"));
                    let name=($(item).parents("tr").attr("data-name"));
                    if($(item).parents("tr").attr("data-isReport")!="1"){
                        let obj={
                            id: id,
                            name: name
                        }
                        scheList.push(obj);
                    }else{
                        arr.push(name);
                    }
                }
            })
            let str = arr.join(", ");
            if(count<2){
                alert("请至少选择2个方案进行对比!");
                return;
            }else if(scheList.length < 2){
                alert(str+" 未生成数据");
                return;
            }
            $scope.items=scheList;
            var modalInstance = $uibModal.open({
                windowClass: 'plan-modal contrastModal',
                backdrop: 'static',
                animation: false,
                size: 'lg',
                templateUrl: 'template/core/contrastModal.html',
                controller: 'contrastModalCtrl',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                if(selectedItem==$scope.projectId){
                    getPlanList();
                }
            }, function (selectedItem) {

            })
        }

        //方案复制
        $scope.copyPlan = (schemeId,schemeName)=>{
            $scope.items ={
                list: $scope.proList,
                schemeId: schemeId,
                schemeName: schemeName,
                projectId: $scope.projectId,
                name: $scope.name
            }
            var modalInstance = $uibModal.open({
                windowClass: 'plan-modal copyModal',
                backdrop: 'static',
                animation: false,
                size: 'lg',
                templateUrl: 'template/core/copyModal.html',
                controller: 'copyModalCtrl',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                if(selectedItem==$scope.projectId){
                    getPlanList();
                }
            }, function (selectedItem) {

            })
        }


        //跳转到参数表
        $scope.paramForm = function(schemeId,schemeName,isReport){
            $window.sessionStorage.removeItem("info");
            $window.sessionStorage.setItem("info", [$scope.projectId,schemeId,schemeName,$scope.name,isReport]);
            $state.go('paramForm', {projectId: $scope.projectId,schemeId: schemeId,schemeName: schemeName,proName: $scope.name,isReport: isReport});
        }

    }]);