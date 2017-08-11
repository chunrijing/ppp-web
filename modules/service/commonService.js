'use strict';

angular.module('core').service('commonService', function ($http, $q) {

    // var url = "http://"+dbPort+"/rest/";
    var count = 0;
    //var urls = ApplicationConfiguration.urls.apiUrl+"/rs/";
    let urls = "http://192.168.3.156:8080/ppp/rs/";

    /**
     * [testApi get-jquery-版本]
     * @param  {[type]} param [description]
     * @return {[type]}       [description]
     */
    this.testApi = function(param){
        // param = JSON.stringify(param);
        var delay = $q.defer();
        $.ajax({
            type: "GET",
            url: url+'feedback/problem/attach/'+param,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
            },
            error:function(error){
                delay.reject(JSON.parse(error.responseText));
            }
        });
        return delay.promise;
    }

    //正常情况下getData
    this.getData = function(){
        var delay = $q.defer();
        var url_join = 'json/data.json';
        $http.get(url_join,{'withCredentials':true}).then(function(data){   
            delay.resolve(data);
        },function(error){
            delay.resolve(error)
        });
        return delay.promise;
    }

    //正常情况下postData
    this.postData = function(params){
        var delay = $q.defer();
        var url_join = url + 'function/analysis/functionList';
        $http.post(url_join,params,{'withCredentials':true}).then(function(data){
            delay.resolve(data);
        },function(error){
            delay.reject(error);
        })
        return delay.promise;
    }

    //获取后台数据503错误解决示例getData
    this.getData = function (params) {
        var delay = $q.defer();
        var url_join = 'json/data.json';
        $http.get(url_join,{transformRequest: angular.identity}).then(function(data){
            delay.resolve(data);
        },function(error){
            delay.reject(error);
        })
        return delay.promise;
    }
    //获取后台数据503错误解决示例postData
    this.postData = function(obj){
        var delay = $q.defer();
        var url_join = url+"rs/trends/projectTrends";
        $http.post(url_join,obj,{transformRequest: angular.identity}).then(function(data){
            delay.resolve(data);
        },function(error){
            delay.resolve(error);
        });
        return delay.promise;
    }
    //封装截获函数
    function getError(error){
        if(error != null || error != 'undefined'){
            /*if(error.status == 500){
                var data = error.responseJSON.infoCode;
                switch(data){
                    case "1007":
                        if(count < 1)
                        {
                            BzCloudComp.CloseUI();
                            ++count;
                        }
                        break;
                    default :  break;
                }
            }*/

        }
    }

    //登录
    this.login = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            data: JSON.stringify(param),
            url: urls + 'system/loginIn',
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
            },
            error:function(error){

            }
        });
        return delay.promise;
    }
    //退出登录
    this.loginOut = function(){

    }
    this.addProject = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            data: JSON.stringify(param),
            url: urls + 'project/add',
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
            },
            error:function(error){

            }
        });
        return delay.promise;
    }
});