angular.module('core').controller('addModalCtrl', ['$scope', '$http','items', '$rootScope','$uibModalInstance','commonService','$timeout','$compile','$state',"$stateParams",
    function ($scope, $http,items,$rootScope,$uibModalInstance,commonService,$timeout,$compile,$state,$stateParams) {
        $scope.jobShow=false;
        $scope.selected = "";
        //输入框初始值设置
        $scope.constructionScale = "上海中心大楼";
        $scope.invest = "300,000,000.00";
        $scope.address = "";
        $scope.image="";
        $scope.proName="";
        $scope.organization="";
        $scope.socialCapital="";
        $scope.dt="";
        $scope.cancel = function(){
            $uibModalInstance.dismiss('');
        }
        $scope.addPro = function(){
            commonService.addProject(
                {
                    "address": $scope.address,
                    "constructionScale": $scope.constructionScale,
                    "image": $scope.image,
                    "industryType": 0,
                    "invest": $scope.invest,
                    "name": $scope.proName,
                    "organization": $scope.organization,
                    "projectId": 0,
                    "socialCapital": $scope.socialCapital,
                    "startTime": $scope.dt
                }
            ).then(function(res){
                console.log(res);
            })
            $uibModalInstance.close("bbb");
        }
        $scope.addPlan = function(){
            $uibModalInstance.close("aaa");
        }
        /*所在地，位置控件*/
        $(function () {
            $('#txt_city').jcity({
                urlOrData: 'lib/jquery-city/js/citydata.json',
                //animate: { showClass: 'animated flipInX', hideClass: 'animated flipOutX' },
                onChoice: function (data) {
                    console.log(data);
                }
            });
        });
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
                    $("#pic").attr("src", objUrl) ; //将图片路径存入src中，显示出图片
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
        $scope.jobList = ["能源","交通运输","水利建设","生态建设和环境保护","农业","林业","科技","保障性安居工程","医疗卫生","养老","教育","文化","体育","市政工程","政府基础设施","城镇综合开发","旅游","社会保障及其他"]
        $scope.selectJob = function(){
            $scope.jobShow = !$scope.jobShow;
        }
        $scope.selectOption = function(job){
            $scope.selected = job;
            $scope.jobShow = false;
        }
        /*建设投资*/
        /*$scope.invest = function($event){
            console.log("money",$event.target.val());

        }*/
        /*时间控件*/
        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function() {
            $scope.dt = null;
        };

        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date(),
            showWeeks: true
        };

        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };

        // Disable weekend selection
        function disabled(data) {
            var date = data.date,
                mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        }

        $scope.toggleMin = function() {
            $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
            $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
        };

        $scope.toggleMin();

        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };

        $scope.open2 = function() {
            $scope.popup2.opened = true;
        };

        $scope.setDate = function(year, month, day) {
            $scope.dt = new Date(year, month, day);
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup1 = {
            opened: false
        };

        $scope.popup2 = {
            opened: false
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 1);
        $scope.events = [
            {
                date: tomorrow,
                status: 'full'
            },
            {
                date: afterTomorrow,
                status: 'partially'
            }
        ];

        function getDayClass(data) {
            var date = data.date,
                mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0,0,0,0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        }
    }]);