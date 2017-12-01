angular.module('core').controller('loginCtrl', ['$scope', '$http','$rootScope','$uibModal','commonService','$timeout','$compile','$state',"$stateParams","$interval","$window",
    function ($scope, $http,$rootScope,$uibModal,commonService,$timeout,$compile,$state,$stateParams,$interval,$window) {
        //删除保存的报表信息
        $window.sessionStorage.removeItem("finaceId");
        $window.sessionStorage.removeItem("finaceName");
        /*头部*/
        let slideId = 0;
        $scope.loingOut = ()=>{
            slideId++;
            let _slideId=slideId;
            commonService.loginOut().then((res)=>{
                if(_slideId<slideId){
                    return false;
                }
                $state.go('login',{str: "loginOut"});
                $interval.cancel(window.interval);
                $scope.userName = "";
            })
        }

        let height = $(document).height();
        $(".loginPage .back").height(height*0.6);
        $(".loginPage header").css("marginTop","5%");

        $scope.login={
            "chk":"",
            "auto":"",
            "user_name":"",
            "user_pwd":""
        };
        //$scope.login.chk = true;
        //$scope.login.auto = true;
        $scope.error = false;
        function set(){
            let login_auto = localStorage.getItem("loginAuto");
            let rem_pwd = localStorage.getItem("rem_pwd");
            $scope.userName = localStorage.getItem("userName");
            console.log();
            if(login_auto!=null && rem_pwd!=null){
                if($stateParams.str=="loginOut"){
                    sessionStorage.setItem("loginAuto",false);
                    $scope.login.auto = false;
                }else{
                    $scope.login.auto = eval(login_auto.toLowerCase());
                }
                $scope.login.chk = eval(rem_pwd.toLowerCase());
                if($scope.login.chk==true){
                    $scope.login.user_name=localStorage.getItem("userName");
                    $scope.login.user_pwd=localStorage.getItem("userPass");
                    if($scope.login.auto==true){
                        commonService.login(
                            {
                                "uname": $scope.login.user_name,
                                "upwd": $scope.login.user_pwd
                            }
                        ).then(function(res){
                            if(res.result!=null){
                                $state.go('project');
                            }
                        })
                    }
                }
            }else{
                $scope.login.user_name=localStorage.getItem("userName");
                $scope.login.user_pwd="";
            }
        }
        set();
        $scope.loginIn =()=> {
            let userName = $scope.login.user_name;
            let rem_pwd =$scope.login.chk;
            let loginAuto = $scope.login.auto;
            let userPass = $scope.login.user_pwd;
            commonService.login(
                {
                    "uname": userName,
                    "upwd": userPass
                }
            ).then(function(res){
                if(res.success==false){
                    if(res.code != 200&&res.code != undefined){
                        $scope.error=true;
                        $scope.msg=res.msg;
                    }
                    return;
                }
                $state.go('project');
                $scope.userName = userName;
                //添加localstorage
                localStorage.setItem("rem_pwd",rem_pwd);
                localStorage.setItem("loginAuto",loginAuto);
                localStorage.setItem("userName",userName);
                if(rem_pwd==true) {
                    localStorage.setItem("userPass",userPass);
                } else {
                    localStorage.removeItem("userPass");
                }
            })
        }

        function getLoginMsg(error){
            if(error != null && error != 'undefined'){
                if(error.code != 200&&error.code != undefined){
                    $scope.msg = error.msg;
                }

            }
        }
    }]);