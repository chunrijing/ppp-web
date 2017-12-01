angular.module('core').controller('addModalCtrl', ['$scope', '$http','items', '$rootScope','$uibModalInstance','commonService','$timeout','$compile','$state',"$stateParams",
    function ($scope, $http,items,$rootScope,$uibModalInstance,commonService,$timeout,$compile,$state,$stateParams) {
        $scope.jobShow=false;
        $scope.openTime = (e)=>{
            $(e.target).siblings("div").toggle();
        }

        function setTime(){
            $timeout(function(){
                var mySchedule = new Schedule({
                    el: '#schedule-box',
                    clickCb: function (y,m,d) {
                        $('#inveStart input').val(y+'-'+m+'-'+d);
                        $scope.dt = y+'-'+m+'-'+d;
                        $('#inveStart div').hide();
                    },
                    nextMonthCb: function (y,m,d) {
                        $('#inveStart input').val(y+'-'+m+'-'+d)
                        $scope.dt = y+'-'+m+'-'+d;
                    },
                    nextYeayCb: function (y,m,d) {
                        $('#inveStart input').val(y+'-'+m+'-'+d)
                        $scope.dt = y+'-'+m+'-'+d;
                    },
                    prevMonthCb: function (y,m,d) {
                        $('#inveStart input').val(y+'-'+m+'-'+d)
                        $scope.dt = y+'-'+m+'-'+d;
                    },
                    prevYearCb: function (y,m,d) {
                        $('#inveStart input').val(y+'-'+m+'-'+d)
                        $scope.dt = y+'-'+m+'-'+d;
                    }
                });
            },10)
        }

        //新建/编辑项目输入框初始值设置
        $timeout(function(){
            if(items.str == 'addPro'){
                $scope.proType = "新建项目";
                $scope.constructionScale = "";
                $scope.invest = "";
                $scope.address = "";
                $scope.proName="";
                $scope.organization="";
                $scope.socialCapital="";
                $scope.dt="";
                $scope.projectId=0;
                setTime();
            }else if(items.str == 'editPro'){
                $scope.proType = "编辑项目";
                let info = items.info;
                findIndustType(info.industryType);
                $scope.industryType=info.industryType;
                $scope.constructionScale = info.constructionScale;
                $scope.invest = info.invest==null?"":thousands(info.invest);
                $scope.invested=info.invest==null?"":info.invest;
                $scope.address = info.address;
                $scope.image=items.image;
                $(".pic").attr("src",items.image);
                $scope.proName=info.name;
                $scope.organization=info.organization;
                $scope.socialCapital=info.socialCapital;
                $scope.dt = info.startTime;
                $scope.projectId=info.projectId;
                setTime();
            }else if(items.str == 'addPlan'){
                $scope.planType = "新建方案";
                $scope.projectId = items.projectId;
                $scope.schemeName = "";
                $scope.remark = "";
            }else{
                $scope.planType = "编辑方案";
                let planInfo = items.info;
                $scope.schemeName = planInfo.schemeName;
                $scope.remark = planInfo.remark;
                $scope.projectId = items.projectId;
                $scope.schemeId = planInfo.schemeId;
            }
        },10)

        function findIndustType(industryType){
            $scope.jobList.map((v,i)=>{
                if(industryType==i+1){
                    $scope.industryTypeName=v;
                }
            })
        }


        //失去焦点
        $scope.changeThousands = function(invest,$event){
            if(invest==undefined){
                return
            }
            $scope.invested = $scope.invest;
            $scope.invest = thousands(invest);
        }

        //金额添加千分位符并保留两位小数
        function　thousands(num){
            num = num.toString();   //将输入的数字转换为字符串
            if(/^-?\d+\.?\d+$/.test(num)){  //判断输入内容是否为整数或小数
                if(/^-?\d+$/.test(num)){    //判断输入内容是否为整数
                    num =num + ",00";   //将整数转为精度为2的小数，并将小数点换成逗号
                }else{
                    num = num.replace(/\./,',');    //将小数的小数点换成逗号
                }
                while(/\d{4}/.test(num)){ //
                    /***
                     *判断是否有4个相连的数字，如果有则需要继续拆分，否则结束循环；
                     *将4个相连以上的数字分成两组，第一组$1是前面所有的数字（负数则有符号），
                     *第二组第一个逗号及其前面3个相连的数字；
                     * 将第二组内容替换为“,3个相连的数字，”
                     ***/
                    num = num.replace(/(\d+)(\d{3}\,)/,'$1,$2');
                }
                num = num.replace(/\,(\d*)$/,'.$1');   //将最后一个逗号换成小数点
            }
            return num;
        }

        function ajax(){
            if($scope.industryType==undefined){
                $scope.industryType=-1;
            }
            let obj = {
                "address": $scope.address,
                "constructionScale": $scope.constructionScale,
                "image": $scope.image,
                "industryType": $scope.industryType,
                "invest": $scope.invested,
                "name": $scope.proName,
                "organization": $scope.organization,
                "projectId": $scope.projectId,
                "socialCapital": $scope.socialCapital,
                "startTime": $scope.dt
            }
            if(items.str == 'addPro'){
                commonService.addProject(obj).then(function(res){
                    $uibModalInstance.close("");
                })

            }else if(items.str == 'editPro'){
                commonService.editProject(obj).then(function(res){
                    $uibModalInstance.close("");
                })
            }
        }
        $scope.okPro = function(){
            if($scope.proName=="" || $scope.proName==undefined){
                $(".pro-modal .modal-body .pro_Name>input").addClass("focused");
                $scope.isPlanBlock = true;
            }else{
                $(".pro-modal .modal-body .pro_Name>input").removeClass("focused");
                $scope.isPlanBlock = false;
                if(items.str == 'addPro'){
                    commonService.repeatProject($scope.proName).then((res)=>{
                        if(res.result==0){
                            ajax();
                        }else{
                            $scope.isPlanequal = true;
                        }
                    })
                }else if(items.str == 'editPro'){
                    if($scope.proName==items.info.name){
                        ajax();
                    }else{
                        commonService.repeatProject($scope.proName).then((res)=>{
                            if(res.result==0){
                                ajax();
                            }else{
                                $scope.isPlanequal = true;
                                //ajax();
                            }
                        })
                    }
                }
            }

        }

        $scope.cancel = function(){
            $uibModalInstance.dismiss('');
        }

        $scope.okPlan = function(){
            if($scope.schemeName=="" || $scope.schemeName==undefined){
                $scope.isPlanName = false;
                $scope.isBlock = true;
            }else{
                $scope.isBlock = false;
                if(items.str == 'addPlan'){
                    commonService.isEqual($scope.schemeName,items.projectId).then((res)=>{
                        if(res.result == 1){
                            $scope.isPlanName = true;
                        }else{
                            $scope.isPlanName = false;
                            addPlan();
                        }
                    })
                }else{
                    if($scope.schemeName == items.info.schemeName){
                        if($scope.remark == items.info.remark){
                            $uibModalInstance.close("equal");
                        }else{
                            editPlan();
                        }
                    }else{
                        commonService.isEqual($scope.schemeName,items.projectId).then((res)=>{
                            if(res.result == 1){
                                $scope.isPlanName = true;
                            }else{
                                $scope.isPlanName = false;
                                $scope.isBlock = false;
                                editPlan();
                            }
                        })
                    }
                }

            }
        }
        //编辑方案
        function editPlan(){
            commonService.editPlan(
                {
                    "remark": $scope.remark,
                    "schemeId": $scope.schemeId,
                    "schemeName": $scope.schemeName
                }
            ).then((res)=>{
                $uibModalInstance.close("");
            })
        }
        //添加方案
        function addPlan(){
            commonService.addPlan(
                {
                    "projectId": $scope.projectId,
                    "remark": $scope.remark,
                    "schemeName": $scope.schemeName
                }
            ).then((res)=>{
                $uibModalInstance.close("");
            })
        }
        /*所在地，位置控件*/
       /* $(function () {
            $('#txt_city').jcity({
                urlOrData: 'lib/jquery-city/js/citydata.json',
                //animate: { showClass: 'animated flipInX', hideClass: 'animated flipOutX' },
                onChoice: function (data) {
                    console.log(data);
                }
            });
        });*/
        /*图片上传*/
        $scope.upload = function(){
            $("#upload").click(); //隐藏了input:file样式后，点击头像就可以本地上传
            $("#upload").on("change",function(){
                var objUrl = getObjectURL(this.files[0]) ; //获取图片的路径，该路径不是图片在本地的路径
                var image = new Image();
                image.src = objUrl;
                image.onload = function(){
                    $scope.image = getBase64Image(image);
                }
                if (objUrl) {
                    $(".pic").attr("src", objUrl) ; //将图片路径存入src中，显示出图片
                }
            });
        }
        //base64位转码
        function getBase64Image(img) {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height);
            var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
            var dataURL = canvas.toDataURL("image/"+ext);
            return dataURL;
        }

        //建立一個可存取到該file的url
        function getObjectURL(file) {
            var url = null ;
            if (window.createObjectURL!=undefined) { // basic
                url = window.createObjectURL(file) ;
            } else if (window.URL!=undefined) { // mozilla(firefox)
                url = window.URL.createObjectURL(file) ;
            } else if (window.webkitURL!=undefined) { // webkit or chrome
                url = window.webkitURL.createObjectURL(file) ;
            }
            return url ;
        }
        /*项目行业分布*/
        $scope.jobList = ["能源","交通运输","水利建设","生态建设和环境保护","农业","林业","科技","保障性安居工程","医疗卫生","养老","教育","文化","体育","市政工程","政府基础设施","城镇综合开发","旅游","社会保障","其他"]

        $scope.selectJob = function(){
            $scope.jobShow = !$scope.jobShow;
        }

        $scope.selectOption = function(index,job){
            $scope.industryType = index;
            $scope.industryTypeName = job;
            $scope.jobShow = false;
        }

    }]);