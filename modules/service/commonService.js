'use strict';
angular.module('core').service('commonService', function ($http, $q, $state) {
    // var url = "http://"+dbPort+"/rest/";
    let urls = ApplicationConfiguration.urls.apiUrl;

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
        if(error != null && error != 'undefined'){
            if(error.code != 200&&error.code != undefined){
                alert(error.msg);
                if(error.code == 201){
                    setTimeout(function(){
                        $state.go("login");
                    },2000)
                }else{
                    $state.go("login");
                }
            }

        }
    }
    //通用接口营业收入查询
    this.getRate = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'rcommon/rate/'+param,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){}
        });
        return delay.promise;
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
                //getError(data);
            },
            error:function(error){

            }
        });
        return delay.promise;
    }
    //退出登录
    this.loginOut = function(){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'system/loginOut',
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                //getError(data);
            },
            error:function(error){}
        });
        return delay.promise;
    }
    //分页查询项目基本信息
    this.getProject = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            //async:false,
            data: JSON.stringify(param),
            //url: urls + 'project/all',
            url: urls + 'project/page',
            cache:false,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){}
        });
        return delay.promise;
    }
    //查询所有项目基本信息
    this.getProjectAll = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            async:false,
            data: JSON.stringify(param),
            url: urls + 'project/all',
            cache:false,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){}
        });
        return delay.promise;
    }
    //查询项目图片
    this.getProjectImg = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            data: JSON.stringify(param),
            url: urls + 'project/image',
            cache:false,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){}
        });
        return delay.promise;
    }
    //添加项目
    this.addProject = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            data: JSON.stringify(param),
            url: urls + 'project/add',
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){}
        });
        return delay.promise;
    }
    //编辑项目
    this.editProject = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            data: JSON.stringify(param),
            url: urls + 'project/update',
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //删除项目
    this.deleteProject = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "delete",
            //data: JSON.stringify(param),
            url: urls + 'project/delete/'+param,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //方案信息查询
    this.getPlan = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            async:false,
            data: JSON.stringify(param),
            url: urls + 'scheme/findScheme',
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //查询方案是否生成过数据
    this.isOrReport = function(schId){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'scheme/isOrReport/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){

            }
        });
        return delay.promise;
    }
    //判断方案是否重名
    this.repeatProject = function(proName){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'project/repeatProject/'+proName,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){

            }
        });
        return delay.promise;
    }
    //新建方案
    this.addPlan = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            data: JSON.stringify(param),
            url: urls + 'scheme/saveScheme',
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //删除方案
    this.deletePlan = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "delete",
            data: JSON.stringify(param),
            url: urls + 'scheme/delete',
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //编辑方案
    this.editPlan = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            data: JSON.stringify(param),
            url: urls + 'scheme/updateScheme',
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //复制方案
    this.schemeCopy = function(scheId,proId,scheName){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'scheme/schemeCopy/'+scheId+'/'+proId+'/'+scheName,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //方案对比
    this.schemeContrast = function(ids,id){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'scheme/schemeContrast/'+ids+'/'+id,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //方案对比导出
    this.schemeDownLoad = function(ids,name,id){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'scheme/downLoad/'+ids+'/'+name+'/'+id,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){

            }
        });
        return delay.promise;
    }
    //方案名称重复判断
    this.isEqual = function(param,proId){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'scheme/repetName/'+param+'/'+proId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //表格侧边导航栏
    this.getNav = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            //data: JSON.stringify(param),
            url: urls + 'nav/find/'+param,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //基础信息参数表查询
    this.getBasic = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            data: JSON.stringify(param),
            url: urls + 'basis/findBasis',
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //参数表建设期、合作期更改
    this.jsqEvent = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            data: JSON.stringify(param),
            url: urls + 'basis/jsqEvent',
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){

            }
        });
        return delay.promise;
    }
    //参数表运营期、合作期更改
    this.yyqEvent = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            data: JSON.stringify(param),
            url: urls + 'basis/yyqEvent',
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){

            }
        });
        return delay.promise;
    }
    this.saveBasic = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            data: JSON.stringify(param),
            url: urls + 'basis/saveBasis',
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    this.updateBasis = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            data: JSON.stringify(param),
            url: urls + 'basis/updateBasis',
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //建设投资参数表
    this.getInvest = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            //data: JSON.stringify(param),
            url: urls + 'invest/find/'+param,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //建设投资参数表更新
    this.updateInvest = function(projectId,schemeId,param){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            data: JSON.stringify(param),
            url: urls + 'invest/update/'+projectId+'/'+schemeId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //查询基础参数年限信息
    this.getPeriod = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            //data: JSON.stringify(param),
            url: urls + 'rcommon/period/'+param,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){

            }
        });
        return delay.promise;
    }

    //建设投资参数表添加行
    this.addLine = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'invest/add/'+param,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    this.deleteLine = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "delete",
            url: urls + 'invest/delete/'+param,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //总包方相关参数表查询
    this.getContractor = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            data: JSON.stringify(param),
            url: urls + 'contractor/findContractor',
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //总包方相关参数表更新
    this.updateContractor = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            data: JSON.stringify(param),
            url: urls + 'contractor/updateContractor',
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //相关收入营业分布表查询
    this.getBusiness = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'business/find/'+param,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //营业收入
    this.updateBusiness = function(proId,schId,param){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            data: JSON.stringify(param),
            url: urls + 'business/update/'+proId+'/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //相关收入收入预测表查询
    this.getIncome = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'income/find/'+param,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //收入预测增加行
    this.income_addRow = function(proId,schId){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'income/addRow/'+proId+'/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){

            }
        });
        return delay.promise;
    }
    //收入预测删除行
    this.income_delRow = function(id){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'income/delRow/'+id,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){

            }
        });
        return delay.promise;
    }
    //价格体系查询
    this.findTaxSys = function(tabId,schId){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            //data: JSON.stringify(param),
            url: urls + 'taxsys/findTaxSys/'+tabId+'/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //价格体系保存更新服务
    this.taxSys = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            data: JSON.stringify(param),
            url: urls + 'taxsys/saveOrUpdateTaxSys',
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //相关收入收入预测表更新
    this.updataTax = function(proId,schId,param){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            data: JSON.stringify(param),
            url: urls + 'income/update/'+proId+'/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //附加税金
    this.getTaxes = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'taxes/find/'+param,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //附加税金增加行
    this.taxes_addRow = function(proId,schId){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'taxes/addRow/'+proId+'/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){

            }
        });
        return delay.promise;
    }
    //附加税金删除行
    this.taxes_delRow = function(id){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'taxes/delRow/'+id,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){

            }
        });
        return delay.promise;
    }
    //附加税金表更新
    this.updataTaxes = function(proId,schId,param){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            data: JSON.stringify(param),
            url: urls + 'taxes/update/'+proId+'/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //相关收入外购原材料参数表查询
    this.getMaterials = function(param){
       var delay = $q.defer();
        $.ajax({
            type: "post",
            data: JSON.stringify(param),
            url: urls + 'materials/findMaterials',
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //保存
    this.updataMaterials = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            data: JSON.stringify(param),
            url: urls + 'materials/saveMaterials',
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //外购原材料增加行
    this.materials_addRow = function(proId,schId){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'materials/addRow/'+proId+'/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){

            }
        });
        return delay.promise;
    }
    //外购原材料删除行
    this.materials_delRow = function(id){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'materials/delRow/'+id,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){

            }
        });
        return delay.promise;
    }
    //外购原材料辅助查询
    this.getMaterialsAux = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            data: JSON.stringify(param),
            url: urls + 'materialsAux/findMaterialsAux',
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //外购原材料辅助数据保存
    this.updataMaterialsAux = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            data: JSON.stringify(param),
            url: urls + 'materialsAux/saveAllMaterialsAux',
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //查询外购燃料动力
    this.getMaterialsFuel = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            data: JSON.stringify(param),
            url: urls + 'materialsFuel/findMaterialsFuel',
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //数据保存
    this.updataMaterialsFuel = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            data: JSON.stringify(param),
            url: urls + 'materialsFuel/saveMaterialsFuel',
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //外购燃料动力增加行
    this.materialsFuel_addRow = function(fuelType,proId,schId){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'materialsFuel/addRow/'+fuelType+'/'+proId+'/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){

            }
        });
        return delay.promise;
    }
    //外购燃料动力删除行
    this.materialsFuel_delRow = function(id){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'materialsFuel/delRow/'+id,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){

            }
        });
        return delay.promise;
    }
    //工资及福利查询salary/findSalary
    this.getSalary = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            data: JSON.stringify(param),
            url: urls + 'salary/findSalary',
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //数据保存
    this.updataSalary = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            data: JSON.stringify(param),
            url: urls + 'salary/saveAllSalary',
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //工资及福利增加行
    this.salary_addRow = function(proId,schId){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'salary/addRow/'+proId+'/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){

            }
        });
        return delay.promise;
    }
    //工资及福利删除行
    this.salary_delRow = function(id){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'salary/delRow/'+id,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){

            }
        });
        return delay.promise;
    }
    //其它费用参数表查询
    this.getOtherCost = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            data: JSON.stringify(param),
            url: urls + 'otherCost/findOtherCost',
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //其它费用参数表数据保存
    this.updataOtherCost = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            data: JSON.stringify(param),
            url: urls + 'otherCost/saveAllOtherCost',
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //流动资金估算参数表查询
    this.getFlowcash = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'flowcash/find/'+param,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //流动资金估算参数表数据保存
    this.updataFlowcash = function(proId,schId,param){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            data: JSON.stringify(param),
            url: urls + 'flowcash/update/'+proId+'/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //维持运营投资表查询
    this.findInvestment = function(schId){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'investment/findInvestment/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){

            }
        });
        return delay.promise;
    }
    //维持运营投资表更新
    this.updateInvestment = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            data: JSON.stringify(param),
            url: urls + 'investment/updateInvestment',
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){

            }
        });
        return delay.promise;
    }
    //维持运营投资表增加行
    this.investment_addRow = function(proId,schId){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'investment/addRow/'+proId+'/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){

            }
        });
        return delay.promise;
    }
    //维持运营投资表删除行
    this.investment_delRow = function(id){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'investment/delRow/'+id,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){

            }
        });
        return delay.promise;
    }

    /*
    * 辅助报表
    * */

    //建设投资估算表
    this.getRinvest = function(schId){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'rinvest/get/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //外购原材料估算表
    this.getRaterials = function(schId){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'rmaterials/get/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //外购燃料动力费报表
    this.getRMaterFuels = function(proId,schId){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            url: urls + 'rmaterialsfuel/getRMaterFuels/'+proId+'/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //工资及福利
    this.getRSalary = function(schId){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            url: urls + 'rsalary/getRSalary/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //营业收入、附加税金
    this.getRincometax = function(schId){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'rincometax/find/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //流动资金
    this.getRFlowCash = function(schId,proId){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            url: urls + 'rflowCash/getRFlowCash/'+proId+'/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //项目总投资
    this.getRplanfinancing = function(schId){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'rplanfinancing/get/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //建设期利息估算表
    this.getRinterest = function(schId){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'rinterest/get/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //总包方建安支付报表
    this.gerRPlanContractor = function(schId){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            url: urls + 'rRlanContractor/getRPlanContractor/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //4-4资产分类财务辅助报表
    this.gerRassetstype = function(schId){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'rassetstype/get/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //6借款还本付息计划表
    this.gerRborrowRepay = function(schId){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'rborrowRepay/get/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //2-1总包方增值税报表
    this.gerAvtcontractor = function(schId){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'avtcontractor/get/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //4-5无形资产摊销估算表
    this.gerAmortize = function(schId){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'amortize/get/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //4总成本报表
    this.gerRTotalCost = function(schId){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'rTotalCost/get/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }

    /*
    * 财务报表
    * */

    //8利润与利润分配表
    this.gerRprofits = function(schId){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'rprofits/get/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //9投资现金流量表
    this.gerRinvestCashFlow = function(schId){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'rinvestCashFlow/get/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //10项目资本金现金流量信息
    this.gerRcapitalcashflow = function(schId){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'rcapitalcashflow/get/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //13财务计划现金流量表
    this.gerRfinancialCash = function(schId){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'rfinancialCash/get/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //14资产负债表
    this.gerRBalanceSheet = function(schId){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'rBalanceSheet/get/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //11社会资本方投资现金流量表
    this.gerRPrivateInvestFlow = function(schId){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'rPrivateInvestFlow/get/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //各年偿债能力指标汇总表
    this.gerRDebtGather = function(schId){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'rDebtGather/get/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //财务指标分析汇总表
    this.gerRFinanceGather = function(schId){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'rFinanceGather/get/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }

    //盈亏平衡点
    this.getBalance = function(proId,schId){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            url: urls + 'balance/findBalance/'+proId+'/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //盈亏平衡分析
    this.findBalanceNum = function(proId,schId){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            url: urls + 'balance/findBalanceNum/'+proId+'/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){

            }
        });
        return delay.promise;
    }
    //敏感性分析
    this.getSensitivity = function(proId,schId,rate){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            url: urls + 'sensitivity/findSensitivity/'+proId+'/'+schId+'/'+rate,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }

    /*
    * 统计基础信息填写数量
    * */
    this.findStatal = function(schId){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'tatal/findStatal/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //保存
    this.saveStatal = function(param){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            async: false,
            data: JSON.stringify(param),
            url: urls + 'tatal/saveStatal',
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }

    //备注信息查询
    this.gettableRemark = function(schId,tId){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'tableRemark/find/'+schId+'/'+tId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //备注信息更新
    this.updatetableRemark = function(projectId,schId,tId,param){
        var delay = $q.defer();
        $.ajax({
            type: "post",
            data: JSON.stringify(param),
            url: urls + 'tableRemark/update/'+projectId+'/'+schId+'/'+tId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }

    //生成报表
    this.report = function(projectId,schId){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            async: true,
            url: urls + 'rcommonreport/createreport/'+projectId+'/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                //getError(data);
            },
            error:function(error){
                
            }
        });
        return delay.promise;
    }
    //固定资产折旧估算表查询
    this.findRDepriciationx = function(schId){
        var delay = $q.defer();
        $.ajax({
            type: "get",
            url: urls + 'rDepriciationx/get/'+schId,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
                getError(data);
            },
            error:function(error){

            }
        });
        return delay.promise;
    }

});