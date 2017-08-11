// 'use strict';
/**
 * component
 */

angular.module('core').controller('componentCtrl', ['$scope', '$http','$rootScope','$uibModal','commonService','$timeout','$compile','$state',"$stateParams",
    function ($scope, $http,$rootScope,$uibModal,commonService,$timeout,$compile,$state,$stateParams) {
        var pageSize = ApplicationConfiguration.pagesize.pageSize;
        $scope.pageSize = pageSize;
        // console.log(pageSize)

        var siderbarArr = [];//菜单项
        var filterCount = 1;//筛选开关
        var dumpVal;//分页器跳转框的值
        var showBtn = 0;//控制筛选条件控制按钮是否显示
        var textFilter = '';//筛选条件生成筛选标签的内容
        var idFilter = null;//筛选条件生成筛选标签的内容id
        $scope.menusArr = [];//菜单数组
        $scope.data = {};
        $scope.data.componentList = [];//组件展示数组
        $scope.isType = true;
        $scope.isStyle = true;
        $scope.isBrand = false;
        $scope.isSType = false;
        $scope.isBlock = false;
        $scope.isTypes = false;
        $scope.isUpload = false;
        $scope.isAduit = false;

        $scope.slideListId=0;//接口滑动判断

        /*
        * 获取当前登录用户权限码
        * */
        commonService.getPermis().then(function(data){
            var arr = data.data;
            if(arr == '' || arr == undefined || arr == null){
                $(".component-base .main-siderbar").hide();
                $(".container-fluid").css({"marginLeft":"10px"});
                $(".pagination").css({"marginLeft":"60px"});
            }
            var orgShow = BzCloudComp.GetEpType();
            if(orgShow == 2 && arr != ""){
                $scope.orgShow = true;
            }
            arr = arr.split(";");
            for(var i=0;i<arr.length;i++){
                if(arr[i] == "30002001"){
                    $scope.isUpload = true;
                }
                if(arr[i] == "30002003"){
                    //console.log(arr[i]);
                    $scope.isAduit = true;
                }
            }
        })

        //大类、风格、品牌数据实时刷新
        var brandsNum = 0;
        var styleNum = 0;
        function getTypeStyle(){
            var param = {
                "scope": $scope.scope,
                "orgId":$scope.orgId,
                "compClassId": $scope.compClassId,
                "subClassId": $scope.subClassId,
                "typeIds": $scope.typeIds,
                "styleIds": $scope.styleIds,
                "brandIds":  $scope.brandIds,
                "componentDisplayName": $scope.componentDisplayName
            }
            commonService.getComTypeStyle(param).then(function (data) {
                var list = data.data;
                $scope.pubList = list.compClassInfos;
                var sList = [];
                var types = [];
                if(list.compClassInfos!=undefined && list.compClassInfos!=null && list.compClassInfos.length!=0){
                    if($scope.compClassId == null){
                        $scope.typeList = list.compClassInfos;
                    }
                    if(list.compClassInfos[0].compClassName == null){
                        $scope.isType = false;
                        let type = list.compClassInfos[0].subClassInfo;
                        angular.forEach(type, function(value,index){
                            if(value.parentId == null){
                                sList.push(value);
                                //小类
                                $scope.sTypeList = sList;
                            } else {
                                types.push(value);
                                $scope.types = types;
                            }
                        })
                        updataTypes();
                        if($scope.compClassId != null && $scope.subClassId == null && $scope.sTypeList.length != 0){
                            $scope.isSType = true;
                            $scope.isTypes = false;
                        }else{
                            $scope.isSType = false;
                        }
                        if($scope.compClassId != null && $scope.subClassId != null && $scope.typeIds == null && $scope.sTypeList.length != 0){
                            $scope.isTypes = true;
                        }else{
                            $scope.isTypes = false;
                        }
                    }else{
                        $scope.isType = true;
                        $scope.isSType = false;
                        $scope.isTypes = false;
                    }
                }else{
                    $scope.isType = false;
                    $scope.isSType = false;
                    $scope.isTypes = false;
                }
                if(list.brands == undefined || list.brands == null || list.brands.length == 0){
                    $scope.isBrand=false;
                    $scope.filterDown=false;
                    brandsNum=1;
                }else{
                    $scope.isBrand=true;
                    $scope.filterDown=true;
                    brandsNum=0;
                    $scope.brandsList = list.brands;
                }
                if(list.styles == undefined || list.styles == null ||  list.styles.length == 0){
                    $scope.isStyle=false;
                    styleNum=1;
                }else{
                    styleNum=0;
                    $scope.isStyle=true;
                    $scope.styleList = list.styles;
                }
                filterDown();
            })
        }

        //类型实时刷新
        function updataTypes(){
            var typesList=[];
            if($scope.types&&$scope.types.length>0){
                for(var i=0;i<$scope.types.length;i++){
                    for(var j=0;j<$scope.sTypeList.length;j++){
                        if(($scope.sTypeList[j].subClassId == $scope.subClassId) && ($scope.types[i].parentId == $scope.sTypeList[j].subClassId)){
                            typesList.push($scope.types[i]);
                        }
                    }
                }
            }
            $scope.typesList = typesList;
        }

        $scope.filterDown = true;
        //判断更多选项是否出现
        function filterDown(){
            $timeout(function(){
                var length = $(".filter-infoList").length;
                if(length > 2){
                    $(".filter-down").addClass('activeShow');
                    $('.filter-down').find('.moreSelect').html("更多选项");
                    $scope.filterDown = true;
                    $scope.isBrand = false;
                }else{
                    $scope.filterDown = false;
                }
                checkMoreBtn();
            },0.1)
        }
        $scope.scope = 1;
        $scope.orgId = null;
        $scope.compClassId = null;
        $scope.subClassId = null;
        $scope.typeIds = null;
        $scope.styleIds = null;
        $scope.brandIds = null;
        $scope.componentDisplayName = null;
        //云构件库构件信息获取
        function getCom(){
            //显示加载中
            layer.load(2, {shade: false});
            if($(".component-base .component-info h4").length >= 0){
                $(".component-base .component-info h4").remove();
            }
            $scope.currentPage = 1;
            commonService.about({
                "scope": $scope.scope,
                "orgId":$scope.orgId,
                "compClassId": null,
                "subClassId": null,
                "typeIds": null,
                "styleIds": null,
                "brandIds": null,
                "componentDisplayName": null,
                "currentPage": 1,
                "pageSize": pageSize
            }).then(function(data){
                 //关
                setTimeout(function(){
                    layer.closeAll('loading');
                },10);
                var list = data.data.itemList;
                $scope.data.componentList = data.data.itemList;
                var temp = "<h4 style='margin: 15% 0 0 43%;'>没有找到相关构件</h4>";
                if($scope.data.componentList.length == 0){
                    $(".component-base .pagination").hide();
                    $(".component-base .component-info").append(temp);
                }else{
                    $(".component-base .pagination").show();
                }
                componentListUpdata();
                defaultImg($scope.data.componentList);
                //console.log($scope.data.componentList);
                $scope.bigTotalItems = data.data.totalRowCount;
            },function(){
                //
            })
            //初次请求保存大类,小类(小类见下)
            var param = {
                "scope": $scope.scope,
                "orgId":$scope.orgId,
                "compClassId": null,
                "subClassId": null,
                "typeIds": null,
                "styleIds": null,
                "brandIds":  null,
                "componentDisplayName": $scope.componentDisplayName,
            }
            commonService.getComTypeStyle(param).then(function(data){
                var list = data.data;
                if(list.compClassInfos == undefined || list.compClassInfos == null || list.compClassInfos.length == 0){
                    $scope.isType = false;
                }else{
                    $scope.typeList = list.compClassInfos;
                    $scope.larList = list.compClassInfos;
                }
                if(list.brands == undefined || list.brands == null || list.brands.length == 0){
                    $scope.isBrand=false;
                    $scope.filterDown=false;
                    brandsNum=1;
                }else{
                    $scope.isBrand=true;
                    $scope.filterDown=true;
                    brandsNum=0;
                    $scope.brandsList = list.brands;
                }
                if(list.styles == undefined || list.styles == null || list.styles.length == 0){
                    $scope.isStyle=false;
                    styleNum=1;
                }else{
                    styleNum=0;
                    $scope.isStyle=true;
                    $scope.styleList = list.styles;
                }
                filterDown();
            })
        }
        if($stateParams.name == null){
            
                getCom();
                $scope.scope = 1;
            
            
        }

        //更多按钮单行不显示
        function checkMoreBtn(once){
            $timeout(function(){
                let _obj=$('.component-filter .filter-more');
                let _flag=0;
                $(_obj).each(function(){
                    let _eleSpan = "";
                    let _eleList=$(this).parents('.filter-infoList');
                    let _eleCondition=$(this).parents('.filter-condition');
                    let _ele=$(this).parents('.filter-tool').siblings('.filter-ele');
                    _eleSpan=$(this).parents('.filter-tool').siblings('.filter-ele').find('span');
                    let _eleCheck=$(_ele).find('.check-box').css('display');
                    var con = $(_ele)[0].childElementCount;
                    var width = $(_eleCondition).width()-186;
                    if(_eleSpan.length<1){
                        _flag=1;
                    }else{
                        if(($(_eleSpan).width()+12)*$(_eleSpan).length<width||_eleCheck!='none'){
                            $(this).hide();
                        }else{
                            $(this).css('display','inline-block');
                        }

                    }
                })
                if(!$scope.$$phase) {
                    $scope.$apply();
                }

                if(_flag&&!once){
                    setTimeout(function(){
                        checkMoreBtn(true);
                    },10)
                }
            },0.1)
        }

        $(window).on('resize',function(){
            checkMoreBtn();
        })


        //构建列表状态更新
        window.componentListUpdata=function componentListUpdata(){
                //console.log($scope.data.componentList)
                $scope.data.componentList.map(function(val){
                    // console.log(val.subClassName,val.guid,val.md5,val.epId,val.originEpId,val.lastestClientVersion)
                    var status = BzCloudComp.GetCompType(val.subClassName,val.guid,val.md5,val.epId-0,val.originEpId-0,val.lastestClientVersion,val.componentId);
                    // console.log(status)
                    if(status == 0){//下载
                        val.staBtnLoad=true;
                        //右上角已下载
                        val.statusLable=false;
                        //更新按钮
                        val.staBtnData=false;
                    }else if(status == 1){//更新
                        val.staBtnData=true;
                        val.staBtnApply=false;
                        val.statusLable=false;
                        val.staBtnLoad=false;
                    }else if(status == 2){//应用
                        val.staBtnApply=true;
                        val.statusLable=true;
                    }else if(status == 3){
                        val.staBtnVerson=true;
                        val.statusVerson=true;
                    }else if (status < 0){
                        val.proContiner=true;
                    }

                })
                if(!$scope.$$phase) {
                    $scope.$apply();
                }

        }

        $scope.$on('listrepeatFinish', function () {
            $timeout(function(){
                //更多按钮单行不显示
                checkMoreBtn();
                componentListUpdata();
                $('.filter-infoList ').css({'min-height': '40px', 'overflow-x': 'hidden', 'overflow-y': 'auto'});
                $('.filter-infoList .filter-tool').map(function (i, val) {
                    //checkMore多选按钮
                    $('.component-filter').off('click','.checkMore');
                    $('.component-filter').on('click','.checkMore',function () {
                        let _type=$(this).attr('data-type')+'_moreBtn';
                        let _switch=$(this).attr('data-switch');
                        switch(_switch){
                            case 'off':
                                $(".check-box").hide();
                                $(".filter-infoList").css({'border': 'none'});
                                $(".filter-infoList .filter-ele").css({'max-height': '40px', 'overflow': 'hidden'});
                                $(".selectTitle").css({'height': '40px','background':''});
                                $(".btns-item").css({'display': 'none'});
                                $(".checkMore").attr('data-switch','off');
                                $(".filter-infoList .filter-ele").children().find(".check-box input").prop('checked',false);
                                $(".filter-more").addClass("showMore");
                                $(".filter-infoList .filter-more").find('.glyphicon-menu-up').css({'transform': 'rotate(180deg)'});
                                $(".filter-infoList .filter-more").find(".moreBtn").text("更多");
                                $scope.brand_moreBtn=null;
                                $scope.style_moreBtn=null;
                                $scope.types_moreBtn=null;
                                checkMoreBtn();

                                $(this).parent().parent().find('.check-box').show();
                                $(this).parent().parent().find('.btns-item').css({'display': 'block'});
                                $(this).attr('data-switch','on');
                                $(this).siblings('.filter-more').hide();
                                $(this).parent().parent().find('.btn-ok').hide();//确定按钮隐藏
                                $scope[_type]=_switch;

                                //展开
                                $(this).siblings('.filter-more').parent().parent().parent().find('.filter-ele').css({'max-height': '120px', 'overflow-y': 'auto'});
                                var height = $(this).parent().parent().parent().height();
                                $(this).parent().parent().siblings(".selectTitle").css({"height":height,"background":"lightgoldenrodyellow"});
                                $(this).parent().parent().parent().css({"border": "1px solid rgba(231, 179, 37, 0.31)"});
                                break;
                            case 'on':
                                $(this).parent().parent().find('.check-box').hide();
                                $(this).parent().parent().parent().find(".filter-ele").css({'max-height': '40px', 'overflow': 'hidden'});
                                $(this).parent().parent().parent().css({"border": "none"});
                                $(this).parent().parent().find('.btns-item').css({'display': 'none'});
                                $(this).attr('data-switch','off');
                                checkMoreBtn();
                                $scope[_type]=_switch;
                                $(this).parent().parent().siblings(".selectTitle").css({'height': '40px','background':''});
                                break;
                        }
                    })
                });
                //是否选中筛选多选框 选中的话可以提交
                $('.component-filter').off('click','.filter-infoList .check-box input');
                $('.component-filter').on('click','.filter-infoList .check-box input',function (event) {
                    showBtn = 0;
                    var i = 0;
                    var arr = [];
                    var idArr=[];
                    $(this).parents('.filter-condition').find('.check-box').map(function (i, val) {
                        if ($(val).find('input[type="checkbox"]').prop('checked') == true) {
                            var _id =$(this).parent().children('i').attr('data-id');
                            textFilter = ($(this).parent().children('i').text());
                            arr.push(textFilter);
                            idArr.push(_id);
                            i = 1;
                            showBtn = i;
                        }
                    });
                    arr = arr.join(",");
                    idArr = idArr.join(",");

                    $(this).parents('.filter-condition').find('.btn-ok').off().click(function () {
                        $(this).parent().siblings(".filter-ele").children().find(".check-box").hide();
                        $(this).parent().siblings(".filter-ele").children().find(".check-box input").prop('checked',false);
                        $(this).parent().siblings(".filter-tool").find('.checkMore').attr('data-switch','off');
                        $(this).parent().hide();

                        isShow();
                        let _type=$(this).attr('data-type');

                        switch(_type){
                            case 'brand':
                                //$scope.isBrand=false;
                                $scope.brandIds=idArr;
                                setBlank(arr,'selectBrand');
                                closeStatus('isBrands');
                                isShow();
                            break;
                            case 'style':
                                //$scope.isStyle=false;
                                $scope.styleIds=idArr;
                                setBlank(arr,'selectStyle');
                                closeStatus('isStyle');
                                isShow();
                            break;
                            case 'types':
                                $scope.typeIds=idArr;
                                //$scope.isTypes=false;
                                setBlank(arr,'selectTypes');
                                closeStatus('isTypes');
                                isShow();
                            break;
                        }

                        object = {
                            "scope": $scope.scope,
                            "orgId":$scope.orgId,
                            "compClassId": $scope.compClassId,
                            "subClassId": $scope.subClassId,
                            "typeIds": $scope.typeIds,
                            "styleIds": $scope.styleIds,
                            "brandIds":  $scope.brandIds,
                            "componentDisplayName": $scope.componentDisplayName,
                            "currentPage": 1,
                            "pageSize": pageSize
                        }
                        getAboutList(object);
                    })

                    if (showBtn == 0) {
                        $(this).parent().parent().parent().siblings().find('.btn-ok').hide();
                    } else {
                        $(this).parent().parent().parent().siblings().find('.btn-ok').show();
                    }
                });

                //filter-more更多按钮点击切换
                $('.component-filter').off('click','.filter-more').on('click','.filter-more',function () {
                    if ($(this).hasClass('showMore')) {
                        $(this).parent().parent().parent().find('.filter-ele').css({'max-height': '120px', 'overflow-y': 'auto'});
                        $(this).find('.glyphicon-menu-up').css({'transform': 'rotate(0deg)'});
                        $(this).find(".moreBtn").text("收起");
                        $(this).removeClass("showMore");
                    } else {
                        $(this).parent().parent().parent().find('.filter-ele').css({'max-height': '40px', 'overflow': 'hidden'});
                        $(this).find('.glyphicon-menu-up').css({'transform': 'rotate(180deg)'});
                        $(this).find(".moreBtn").text("更多");
                        $(this).addClass("showMore");
                    }
                });
                // });
                //  取消选择的时候条件清空
                $('.component-filter').off('click','.filter-infoList .btn-cancel')
                $('.component-filter').on('click','.filter-infoList .btn-cancel',function () {
                    $(this).parent().siblings(".filter-ele").css({'max-height': '40px', 'overflow': 'hidden'});
                    $(this).parent().parent().parent().css({"border": "none"});
                    $(this).parent().parent().siblings(".selectTitle").css({'height': '40px','background':''});
                    $(this).parent().siblings(".filter-ele").children().find(".check-box").hide();
                    $(this).parent().siblings(".filter-ele").children().find(".check-box input").prop('checked',false);
                    $(this).parent().siblings(".filter-tool").find('.checkMore').attr('data-switch','off');
                    $(this).parent().hide();
                    checkMoreBtn();
                    let _type=$(this).attr('data-type');
                    switch(_type){
                        case 'brand':
                            //$scope.isBrand=false;
                            $scope.brand_moreBtn=undefined;
                        break;
                        case 'style':
                            //$scope.isStyle=false;
                            $scope.style_moreBtn=undefined;
                        break;
                        case 'types':
                            //$scope.isTypes=false;
                            $scope.types_moreBtn=undefined;
                        break;
                    }

                    $(this).parent().siblings().find('.check-box').hide();
                    $(this).parent().css({'display': 'none'});
                    $(this).parent().siblings().find('input[type="checkbox"]').prop('checked', '');
                    $(this).siblings('.btn-ok').hide();
                    $(this).parent().parent().siblings(".selectTitle").css({"height":'40px',"background":""});
                    $(this).parent().parent().parent().css({"border": "none"});
                    $scope.$apply();
                });
            }, 10)
        })

        /*
         * 左侧树结构
         * */
        var zNodes;
        var setting = {
            view: {
                showIcon: false,
                showLine: false
            },
            data: {
                simpleData: {
                    enable: true,
                    idKey: "orgId",
                    pIdKey: "parentId"
                },
                key: {
                    name: "orgName"
                }
            },
            callback:{
                onClick:function zTreeOnClick(event, treeId, treeNode){
                    clearMore();
                    $scope.data.componentList = [];
                    $scope.bigTotalItems = [];
                    sorceClick();
                    $scope.scope = null;
                    var ids=[];
                    ids=getChildren(ids,treeNode);
                    $scope.$apply();
                    ids = ids.toString(ids);
                    $scope.orgId = ids;

                    //清空
                    $scope.compClassId=null;
                    $scope.subClassId=null;
                    $scope.typeIds=null;
                    $scope.styleIds=null;
                    $scope.brandIds=null;

                    object = {
                        "scope": null,
                        "orgId":ids,
                        "compClassId": $scope.compClassId,
                        "subClassId": $scope.subClassId,
                        "typeIds":  $scope.typeIds,
                        "styleIds": $scope.styleIds,
                        "brandIds": $scope.brandIds,
                        "componentDisplayName": $scope.componentDisplayName,
                        "currentPage": 1,
                        "pageSize": pageSize
                    }
                    getAboutList(object);
                }
            }
        };
        var arrCompany=[];//企业库所有节点orgId
        commonService.getComponent().then(function (data) {
            zNodes = data.data;
            $.fn.zTree.init($(".component-base .ztree"), setting, zNodes);
            var treeObj = $.fn.zTree.getZTreeObj("sourceTree");
            treeObj.expandAll(true);
            $("#sourceTree_1_span").css({'color': 'white','background':'rgb(73, 144, 226)'});
            var rootNode = treeObj.getNodes();
            var rootNodes = treeObj.transformToArray(rootNode);
            for(var i=0;i<rootNodes.length;i++){
                arrCompany.push(rootNodes[i].orgId); //获取每个节点的id
            }
            arrCompany = arrCompany.toString(arrCompany);
            //判断路由传参，跳转是否为企业库
            if($stateParams.name == 1){
                $(".component-base .source>li.btnActive").removeClass("btnActive");
                $(".component-base .source>li:nth-child(2)").addClass("btnActive");
                $(".component-base .source>li:nth-child(2) ul").show();
                var text = $("#sourceTree_1_span").text();
                $('.filter-status .filter-ele div').eq(0).html(text).attr("title", text);
                $scope.orgId = arrCompany;

                //清空
                $scope.scope = null;
                $scope.compClassId=null;
                $scope.subClassId=null;
                $scope.typeIds=null;
                $scope.styleIds=null;
                $scope.brandIds=null;
                $scope.componentDisplayName=null;
                getCom();
            }
            //菜单选项
            var menusText;
            $('.main-siderbar ul:not(.line) .node_name').off('click');
            $('.main-siderbar ul:not(.line) .node_name').on('click',function () {
                $scope.isType = true;
                $scope.isSType = false;
                $scope.isTypes = false;
                //$scope.isStyle = true;
                $scope.compClassId=null;
                $scope.subClassId=null;
                $scope.typeIds=null;
                $scope.styleIds=null;
                $scope.brandIds=null;

                var nodes = treeObj.getSelectedNodes();
                if ($(this).text() != '' && $(this).text() != undefined) {
                    menusText = $(this).text();//选中的当前项的内容
                }
                $('.filter-status .filter-ele div').eq(0).html(menusText).attr("title", menusText)//把值改变到筛选条件的路径监听框
                $('li').css({'background': '', 'color': '#333'});//初始化样式
                $('li span').css({'background': '', 'color': '#333'});//初始化样式
                $(this).parent().children().find('span').css({'background': '', 'color': '#333'});//隐藏父元素的选中样式
                $(this).css({'color': 'white','background':'rgb(73, 144, 226)'});//选中样式
                $scope.$apply();
            });
        });

        function getChildren(ids,treeNode){
            ids.push(treeNode.orgId);
            if (treeNode.isParent){
                for(var obj in treeNode.children){
                    getChildren(ids,treeNode.children[obj]);
                }
            }
            return ids;
        }

        //切换收起全部已展开标签项
        function clearMore(){
            checkMoreBtn();
            $(".check-box").hide();
            $(".filter-infoList").css({'border': 'none'});
            $(".filter-infoList .filter-ele").css({'max-height': '40px', 'overflow': 'hidden'});
            $(".selectTitle").css({'height': '40px','background':''});
            $(".btns-item").css({'display': 'none'});
            $(".checkMore").attr('data-switch','off');
            $(".filter-infoList .filter-ele").children().find(".check-box input").prop('checked',false);
            $(".filter-more").addClass("showMore");
            $(".filter-infoList .filter-more").find('.glyphicon-menu-up').css({'transform': 'rotate(180deg)'});
            $(".filter-infoList .filter-more").find(".moreBtn").text("更多");
            $(".filter-down").addClass('activeShow');
            $('.filter-down').find('.moreSelect').html("更多选项");
            $scope.brand_moreBtn=null;
            $scope.style_moreBtn=null;
            $scope.types_moreBtn=null;
            //checkMoreBtn();
        }

        $scope.public = function($event){
            $($event.target).parent().children("ul").show();
            $(".component-base .source>li.btnActive").removeClass("btnActive");
            $($event.target).parent().addClass("btnActive");
            $('.filter-status .filter-ele div').eq(0).html("公共库").attr("title", "公共库");
            $(".component-base .source>li:nth-child(2)>ul").hide();
            //切换移除所有展开条件
            clearMore();
            sorceClick();
            $scope.scope = 1;
            $scope.orgId = null;
            $scope.isType = true;
            $scope.isSType = false;
            $scope.isTypes = false;
            $scope.isStyle = true;
            $scope.compClassId=null;
            $scope.subClassId=null;
            $scope.typeIds=null;
            $scope.styleIds=null;
            $scope.brandIds=null;
            $scope.currentPage = 1;
            let object = {
                        "scope": $scope.scope,
                        "orgId":$scope.orgId,
                        "compClassId": $scope.compClassId,
                        "subClassId": $scope.subClassId,
                        "typeIds":  $scope.typeIds,
                        "styleIds": $scope.styleIds,
                        "brandIds": $scope.brandIds,
                        "componentDisplayName": $scope.componentDisplayName,
                        "currentPage": $scope.currentPage,
                        "pageSize": pageSize
                    }
            // getCom();

            if($scope.componentDisplayName==''){
                $scope.isBlock=false;
            }
            getAboutList(object);
        }

        $scope.company = function($event){
            $($event.target).parent().children("ul").show();
            $(".component-base .source>li.btnActive").removeClass("btnActive");
            $($event.target).parent().addClass("btnActive");
            var text = $("#sourceTree_1_span").text();
            $('.filter-status .filter-ele div').eq(0).html(text).attr("title", text);
            clearMore();
            sorceClick();
            $scope.scope = null;
            $scope.isType = true;
            $scope.isSType = false;
            $scope.isTypes = false;
            $scope.isStyle = true;
            $scope.compClassId=null;
            $scope.subClassId=null;
            $scope.typeIds=null;
            $scope.styleIds=null;
            $scope.brandIds=null;
            $scope.orgId = arrCompany;
            $scope.currentPage = 1;
            let object = {
                        "scope": $scope.scope,
                        "orgId":$scope.orgId,
                        "compClassId": $scope.compClassId,
                        "subClassId": $scope.subClassId,
                        "typeIds":  $scope.typeIds,
                        "styleIds": $scope.styleIds,
                        "brandIds": $scope.brandIds,
                        "componentDisplayName": $scope.componentDisplayName,
                        "currentPage": $scope.currentPage,
                        "pageSize": pageSize
                    }

            if($scope.componentDisplayName==''){
                $scope.isBlock=false;
            }
            getAboutList(object);
            // getCom();
        }

        $scope.source = function(){
            clearMore();
            sorceClick();
            $scope.isType = true;
            $scope.isSType = false;
            $scope.isTypes = false;
            $scope.isStyle = true;
            $scope.compClassId=null;
            $scope.subClassId=null;
            $scope.typeIds=null;
            $scope.styleIds=null;
            $scope.brandIds=null;
            let object = {
                        "scope": $scope.scope,
                        "orgId":$scope.orgId,
                        "compClassId": $scope.compClassId,
                        "subClassId": $scope.subClassId,
                        "typeIds":  $scope.typeIds,
                        "styleIds": $scope.styleIds,
                        "brandIds": $scope.brandIds,
                        "componentDisplayName": $scope.componentDisplayName,
                        "currentPage": $scope.currentPage,
                        "pageSize": pageSize
                    }

            if($scope.componentDisplayName==''){
                $scope.isBlock=false;
            }
            getAboutList(object);
            // getCom();
        }


        /*
         * 点击构件来源移除除搜索外的条件
         * */
        function sorceClick() {
            $('.ltype').prev().remove();
            $('.ltype').remove();
            $('.stype').prev().remove();
            $('.stype').remove();
            $('.selectType').prev().remove();
            $('.selectType').remove();
            if ($scope.componentDisplayName == null) {
                $scope.isBlock = false;
            } else {
                $scope.isBlock = true;
            }
        }
        /*
         * 分页器
         * */
        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
            console.log(pageNo)
        };
        $scope.pageChanged = function (pageNo) {
            // $scope.currentPage = pageNo;
            // console.log($scope.currentPage)
            $scope.data.componentList = [];
            object = {
                "scope": $scope.scope,
                "orgId":$scope.orgId,
                "compClassId": $scope.compClassId,
                "subClassId": $scope.subClassId,
                "typeIds":  $scope.typeIds,
                "styleIds": $scope.styleIds,
                "brandIds": $scope.brandIds,
                "componentDisplayName": $scope.componentDisplayName,
                "currentPage": pageNo,
                "pageSize": pageSize
            }
            getAboutList(object,"page");
        };
        //分页大小限制号码。
        $scope.maxSize = 5;
        //所有页面中的项目总数

        //默认图
        function defaultImg(arr){
            arr.map((item)=>{
                if(item.attachmentInfo.length==0){
                    item.attachmentInfo[0]={};
                    item.attachmentInfo[0].displayUrl='imgs/placeholder.png'
                }
            })
        }

        /*分页器跳转
         * params  value
         * return currentPage
         * */
        function getDumpVal() {
            dumpVal = $('.dump-inp input').val();
            return dumpVal;
        }

        /*分页器跳转
         * params  value
         * return currentPage
         * */
        //$scope.setPage(getDumpVal());
        $scope.getDumpOk = function (e,numPages) {
            if(e&&e.keyCode!=13&&e.keyCode!=10){
                return false;
            }
            var page = parseInt(getDumpVal());
            if(page>numPages){
                alert('查询页码超出范围，请重新输入');
                $('.dump-inp input').val("");
                return false;
            }
            $scope.setPage(getDumpVal());
            object = {
                "scope": $scope.scope,
                "orgId":$scope.orgId,
                "compClassId": $scope.compClassId,
                "subClassId": $scope.subClassId,
                "typeIds":  $scope.typeIds,
                "styleIds": $scope.styleIds,
                "brandIds": $scope.brandIds,
                "componentDisplayName": $scope.componentDisplayName,
                "currentPage": page,
                "pageSize": pageSize
            }
            getAboutList(object,"page");
            $('.dump-inp input').val("");
        };

        //封装搜索函数
        var object;
        function getAboutList(object,changePage,callback){
            $scope.data.componentList = "";
            if(changePage != "page"){
                getTypeStyle();
                $scope.currentPage = 1;
            }
            if($(".component-base .component-info h4").length >= 0){
                $(".component-base .component-info h4").remove();
            }
            $scope.slideListId++;
            let _slideListId=$scope.slideListId;
            //显示加载中
            layer.load(2, {shade: false});
            commonService.about(object).then(function(data){
                $scope.data.componentList = [];
                //滑动窗口判断,防止旧请求覆盖新请求
                if(_slideListId<$scope.slideListId){
                    console.log('This XHR id:',_slideListId)
                    console.log('Global XHR id:',$scope.slideListId)
                    return false;
                }

                //关
                setTimeout(function(){
                    layer.closeAll('loading');
                },10);

                $scope.data.componentList = data.data.itemList;
                defaultImg($scope.data.componentList);
                $scope.bigTotalItems = data.data.totalRowCount;
                console.log(data.data)
                componentListUpdata();
                var temp = "<h4 style='margin: 15% 0 0 43%;'>没有找到相关构件</h4>";
                if($scope.data.componentList.length == 0){
                    $(".component-base .pagination").hide();
                    $(".component-base .component-info").append(temp);
                }else{
                    $(".component-base .pagination").show();
                }

                if(typeof callback =='function'){
                    callback();
                }
            });
        }
        /*
         * 条件标签样式及切换
         * */
        function setFilterStyle(obj) {
            obj.on('mouseenter', function () {
                $(this).children().not('.filter-closeStatus').css({'color': '#E5383C', 'border-color': '#E5383C'});
                $(this).children().find('.glyphicon-menu-down').css({'transform': 'rotate(180deg)'});
                // $(this).not('.filter-closeStatus').find('.filter-trigger').css({'height': '33px', 'border-bottom': '0', 'background': '#fff'});
                $(this).not('.addSearch,.selectTypes,.selectStyle,.selectBrand').find('.filter-trigger').css({'height': '33px', 'border-bottom': '0', 'background': '#fff'});
                $(this).find('.switch-filter').show();
                var searchText;
                if($(".addSearch ")){
                    searchText = $(".addSearch").text();
                } else {
                    searchText = "";
                }
                $('.switchFilter').off('click');
                $('.switchFilter').on('click',function () {
                    var _parentLtype=$(this).parents('.ltype');//大类
                    var _parentStype=$(this).parents('.stype');//小类
                    var text = $(this).text();
                    var id = $(this).attr("data-id");
                    sType(id);
                    $(this).parent().siblings().children('span').text(text);
                    $scope.styleIds = null;
                    $scope.brandIds = null;
                    $scope.typeIds = null;
                    if(_parentLtype.length>0){
                        $scope.compClassId=parseInt(id);
                        $scope.subClassId=null;
                        $('.stype').prev().remove();
                        $('.stype').remove();
                        $('.selectType').prev().remove();
                        $('.selectType').remove();
                        object = {
                            "scope": $scope.scope,
                            "orgId":null,
                            "compClassId": $scope.compClassId,
                            "subClassId": $scope.subClassId,
                            "typeIds":  $scope.typeIds,
                            "styleIds": $scope.styleIds,
                            "brandIds": $scope.brandIds,
                            "componentDisplayName": $scope.componentDisplayName,
                            "currentPage": 1,
                            "pageSize": pageSize
                        }
                    }

                    if(_parentStype.length>0){
                        $scope.subClassId=parseInt(id);
                        $scope.typeIds=null;
                        $('.selectType').prev().remove();
                        $('.selectType').remove();
                        object = {
                            "scope": $scope.scope,
                            "orgId":null,
                            "compClassId": $scope.compClassId,
                            "subClassId": $scope.subClassId,
                            "typeIds":  $scope.typeIds,
                            "styleIds": $scope.styleIds,
                            "brandIds": $scope.brandIds,
                            "componentDisplayName": $scope.componentDisplayName,
                            "currentPage": 1,
                            "pageSize": pageSize
                        }
                    }

                    getAboutList(object);
                })
            });
            obj.on('mouseleave', function () {
                $(this).children().css({'color': '', 'border-color': ''});
                $(this).children().find('.glyphicon-menu-down').css({'transform': ''});
                $(this).find('.filter-trigger').css({'height': '30px', 'border-bottom': '1px solid #c9c9c9', 'background': ''});
                $(this).find('.switch-filter').hide();
            })
        }

        /*
         * 搜索关键字生成条件标签
         * */
        $scope.search = function (e,searchText) {
            if(e&&e.keyCode!=13){
                return false;
            }
            if(searchText == '' || searchText == undefined||(object&&object.componentDisplayName==searchText)/*已存在搜索*/){
                return;
            } else {
                $('.addSearch').prev('.glyphicon').remove();//删除原有搜索条件DOM
                $('.addSearch').remove();//删除原有搜索条件DOM
                closeStatus('isSearch');
                $scope.componentDisplayName=searchText;
                object = {
                    "scope": $scope.scope,
                    "orgId":$scope.orgId,
                    "compClassId": $scope.compClassId,
                    "subClassId": $scope.subClassId,
                    "typeIds":  $scope.typeIds,
                    "styleIds": $scope.styleIds,
                    "brandIds": $scope.brandIds,
                    "componentDisplayName": $scope.componentDisplayName,
                    "currentPage": 1,
                    "pageSize": pageSize
                }
                getAboutList(object);
                var html = '<b class="glyphicon glyphicon-menu-right addSearchIcon"></b><div class="type-filter addSearch"><div class="filter-trigger filter-closeStatus" title='+searchText+'><span>' + searchText + '</span><b class="icon-close"></b></div>';
                var template = angular.element(html);
                var pagination = $compile(template)($scope);

                if($('.addSearchIcon').length>0){
                    angular.element($('.addSearchIcon').before(pagination));
                }else{
                    angular.element($('.filter-status .filter-ele').append(pagination));
                }

                closeStatus('isSearch');
                isShow();
                componentListUpdata();
            }
        }
        /*
         * 筛选条件（无下拉功能）生成条件标签
         * params function
         * */
        function setBlank(textFilter,type) {
            var html = '<b class="glyphicon glyphicon-menu-right"></b><div class="type-filter selectType '+type+'"><div class="filter-trigger filter-closeStatus"  title='+textFilter+'><span>' + textFilter + '</span><b class="icon-close"></b></div>';
            var template = angular.element(html);
            var pagination = $compile(template)($scope);
            if($('.addSearchIcon').length>0){
                angular.element($('.addSearchIcon').before(pagination));
            }else{
                angular.element($('.filter-status .filter-ele').append(pagination));
            }
        }

        /*
         * 关闭筛选条件
         * */
        function closeStatus(callback) {
            $('.filter-closeStatus').off('click').on('click',function () {
                $(this).parent().prev().remove();
                $(this).parent().remove();
                isShow();

                //type
                let _type=$(this).parent();
                if($(_type).hasClass('selectTypes')){
                    _type='isTypes'
                }
                if($(_type).hasClass('addSearch')){
                    _type='isSearch'
                }
                if($(_type).hasClass('selectStyle')){
                    _type='isStyle'
                }
                if($(_type).hasClass('selectBrand')){
                    _type='isBrands'
                }
                switch (_type){
                    case 'isTypes' :
                        $scope.typeIds=null;
                        $scope.isTypes = true;
                        $scope.types_moreBtn=null;
                        break;
                    case 'isStyle' :
                        $scope.styleIds=null;
                        $scope.isStyle = true;
                        $scope.style_moreBtn=null;
                        break;
                    case 'isBrands' :
                        $scope.brandIds=null;
                        $scope.brand_moreBtn=null;
                        $scope.isBrand = true;
                        //$('.filter-brand.filter-infoList').removeClass('ng-hide');
                        $('.filter-down.activeShow').removeClass('activeShow');
                        $scope.$apply();
                        break;
                    case 'isSearch' :
                        $scope.componentDisplayName=null;
                        break;
                }

                object = {
                    "scope": $scope.scope,
                    "orgId":$scope.orgId,
                    "compClassId": $scope.compClassId,
                    "subClassId": $scope.subClassId,
                    "typeIds":  $scope.typeIds,
                    "styleIds": $scope.styleIds,
                    "brandIds": $scope.brandIds,
                    "componentDisplayName": $scope.componentDisplayName,
                    "currentPage": 1,
                    "pageSize": pageSize
                }
                getAboutList(object);
                //callback
                if(typeof callback=='function'){
                    callback();
                }
            })
        }

        //筛选品牌
        $scope.isBrandFilter = function (event) {
            //多选状态下为勾选
            if($scope.brand_moreBtn=='off'){
                let _obj=$(event.target).parent('span.ng-scope')||$(event.target);
                $(_obj).find('.check-box input').click();
                return;
            }
            if (event.target.nodeName == 'I' || event.target.nodeName == 'I') {
                textFilter = $(event.target).text();
                idFilter = $(event.target).attr("data-id");
                if($('.addSearchIcon').length>0){
                    $('.addSearchIcon').before('<b class="glyphicon glyphicon-menu-right"></b><div class="type-filter selectType selectBrand"><div class="filter-trigger filter-closeStatus"  title='+textFilter+'><span>' + textFilter + '</span><b class="icon-close"></b></div>');
                }else{
                    $('.filter-status .filter-ele').append('<b class="glyphicon glyphicon-menu-right"></b><div class="type-filter selectType selectBrand"><div class="filter-trigger filter-closeStatus"  title='+textFilter+'><span>' + textFilter + '</span><b class="icon-close"></b></div>');
                }
                //$scope.isBrand = false;
                $scope.brandIds=idFilter;
                object = {
                    "scope": $scope.scope,
                    "orgId":$scope.orgId,
                    "compClassId": $scope.compClassId,
                    "subClassId": $scope.subClassId,
                    "typeIds":  $scope.typeIds,
                    "styleIds": $scope.styleIds,
                    "brandIds": $scope.brandIds,
                    "componentDisplayName": $scope.componentDisplayName,
                    "currentPage": 1,
                    "pageSize": pageSize
                }
                getAboutList(object);
            }
            closeStatus('isBrands');
            isShow();

        };

        //筛选风格
        $scope.isStyleFilter = function (event) {
            //多选状态下为勾选
            if($scope.style_moreBtn=='off'){
                let _obj=$(event.target).parent('span.ng-scope')||$(event.target);
                $(_obj).find('.check-box input').click();
                return;
            }

            if (event.target.nodeName == 'I' || event.target.nodeName == 'I') {
                let _text = $(event.target).text();
                textFilter = $(event.target).attr('data-id');
                if($('.addSearchIcon').length>0){
                    $('.addSearchIcon').before('<b class="glyphicon glyphicon-menu-right"></b><div class="type-filter selectType selectStyle"><div class="filter-trigger filter-closeStatus" title='+_text+'><span>' + _text + '</span><b class="icon-close"></b></div>');
                }else{
                    $('.filter-status .filter-ele').append('<b class="glyphicon glyphicon-menu-right"></b><div class="type-filter selectType selectStyle"><div class="filter-trigger filter-closeStatus" title='+_text+'><span>' + _text + '</span><b class="icon-close"></b></div>');
                }

                //$scope.isStyle = false;
                $scope.styleIds = textFilter;
                object = {
                    "scope": $scope.scope,
                    "orgId":$scope.orgId,
                    "compClassId": $scope.compClassId,
                    "subClassId": $scope.subClassId,
                    "typeIds":  $scope.typeIds,
                    "styleIds": $scope.styleIds,
                    "brandIds": $scope.brandIds,
                    "componentDisplayName": $scope.componentDisplayName,
                    "currentPage": 1,
                    "pageSize": pageSize
                }
                getAboutList(object);
            }
            isShow();
            closeStatus('isStyle');

        };
        //筛选大类
        $scope.isTypeFilter = function (event) {
            if(event.target.nodeName=='SPAN' || event.target.nodeName=='span'){
                textFilter = $(event.target).not('input[type="checkbox"]').text();
                idFilter = $(event.target).not('input[type="checkbox"]').attr("data-id");
                var typeList = $scope.typeList;
                var html = '<b class="glyphicon glyphicon-menu-right"></b><div class="type-filter ltype"><div class="filter-trigger "><span>' + textFilter + '</span> <b class="glyphicon glyphicon-menu-down"></b> </div><div class="switch-filter" ><div class="switchFilter" style="cursor: pointer" ng-repeat="item in larList" data-id="{{item.compClassId}}">{{item.compClassName}}</div></div></div>'
                var template = angular.element(html);
                var pagination = $compile(template)($scope);
                angular.element($('.filter-status .filter-first-ele').after(pagination));

                $scope.compClassId=parseInt(idFilter);
                $scope.subClassId=null;
                $scope.typeIds=null;
                object = {
                    "scope": $scope.scope,
                    "orgId":$scope.orgId,
                    "compClassId": $scope.compClassId,
                    "subClassId": $scope.subClassId,
                    "typeIds":  $scope.typeIds,
                    "styleIds": $scope.styleIds,
                    "brandIds": $scope.brandIds,
                    "componentDisplayName": $scope.componentDisplayName,
                    "currentPage": 1,
                    "pageSize": pageSize
                }
                getAboutList(object);
                //显示小类
                sType(idFilter);
                $scope.isType = false;
                $scope.isSType = true;
                setFilterStyle($('.component-base .filter-status .filter-ele .type-filter'));//筛选条件切换
            }
            isShow();
            //filterDown();
        };
        //初次请求保存公共库小类，获取切换数据
        function sType(idFilter) {
            var list = $scope.larList;
            var sList = [];
            var types = [];
            angular.forEach(list, function (value, index) {
                if (value.compClassId == parseInt(idFilter)) {
                    angular.forEach(value.subClassInfo,function(values, indexs){
                        if(values.parentId == null){
                            sList.push(values);
                            //小类
                            $scope.smaList = sList;
                        } else {
                            types.push(values);
                            //$scope.types = types;
                        }
                    })
                }
            })
        }

        //筛选小类
        $scope.isSTypeFilter = function (even) {
            if (event.target.nodeName == 'SPAN' || event.target.nodeName == 'span') {
                textFilter = $(event.target).not('input[type="checkbox"]').text();
                idFilter = $(event.target).not('input[type="checkbox"]').attr("data-id");
                $scope.subClassId = parseInt(idFilter);
                var sTypeList = $scope.sTypeList;
                var html = '<b class="glyphicon glyphicon-menu-right"></b><div class="type-filter stype"><div class="filter-trigger "><span>' + textFilter + '</span> <b class="glyphicon glyphicon-menu-down"></b> </div><div class="switch-filter" ><div class="switchFilter" style="cursor: pointer" ng-repeat="item in smaList" data-id="{{item.subClassId}}">{{item.subClassName}}</div></div></div>'
                var template = angular.element(html);
                var pagination = $compile(template)($scope);
                // angular.element($('.filter-status .filter-ele').append(pagination));
                angular.element($('.filter-status .ltype').after(pagination));
                //$scope.subClassId = idFilter;
                $scope.typeIds=null;
                object = {
                    "scope": $scope.scope,
                    "orgId":$scope.orgId,
                    "compClassId": $scope.compClassId,
                    "subClassId": $scope.subClassId,
                    "typeIds":  $scope.typeIds,
                    "styleIds": $scope.styleIds,
                    "brandIds": $scope.brandIds,
                    "componentDisplayName": $scope.componentDisplayName,
                    "currentPage": 1,
                    "pageSize": pageSize
                }
                getAboutList(object);
                $scope.isSType = false;
                $scope.isTypes = true;
                setFilterStyle($('.component-base .filter-status .filter-ele .type-filter'));//筛选条件切换
            }
            isShow();
        }

        //筛选类型 isTypes typesList
        $scope.seltypes = function(name,id){
            //多选状态下为勾选
            if($scope.types_moreBtn=='off'){
                let _obj=$(event.target).parent('span.ng-scope')||$(event.target);
                $(_obj).find('.check-box input').click();
                return;
            }

            if($('.addSearchIcon').length>0){
                $('.addSearchIcon').before('<b class="glyphicon glyphicon-menu-right"></b><div class="type-filter selectType selectTypes"><div class="filter-trigger filter-closeStatus" title='+name+'><span>' + name + '</span><b class="icon-close"></b></div>');
            }else{
                $('.filter-status .filter-ele').append('<b class="glyphicon glyphicon-menu-right"></b><div class="type-filter selectType selectTypes"><div class="filter-trigger filter-closeStatus" title='+name+'><span>' + name + '</span><b class="icon-close"></b></div>');
            }
            $scope.isTypes = false;
            $scope.typeIds=id.toString();
            object = {
                "scope": $scope.scope,
                "orgId":$scope.orgId,
                "compClassId": $scope.compClassId,
                "subClassId": $scope.subClassId,
                "typeIds":  $scope.typeIds,
                "styleIds": $scope.styleIds,
                "brandIds": $scope.brandIds,
                "componentDisplayName": $scope.componentDisplayName,
                "currentPage": 1,
                "pageSize": pageSize
            }
            getAboutList(object);
            isShow();
            //filterDown();
            closeStatus('isTypes');
        }

        //清空筛选显隐
        function isShow() {
            if ($('.type-filter').length == 0) {
                $scope.isBlock = false;
            } else {
                $scope.isBlock = true;
            }
        }

        //清空筛选
        $scope.cancelFilter = function () {
            $('.type-filter').remove();
            $('.filter-status .filter-ele>b').remove();
            $scope.isBlock = false;
            $scope.isSType = false;
            $scope.isTypes = false;

            $scope.compClassId=null;
            $scope.subClassId=null;
            $scope.typeIds=null;
            $scope.styleIds=null;
            $scope.brandIds=null;
            $scope.componentDisplayName=null;
            $scope.searchText = null;

            object = {
                "scope": $scope.scope,
                "orgId":$scope.orgId,
                "compClassId": null,
                "subClassId": null,
                "typeIds": null,
                "styleIds": null,
                "brandIds": null,
                "componentDisplayName": null,
                "currentPage": 1,
                "pageSize": pageSize
            }

            /*$('.filter-down.activeShow').addClass('activeShow');
            $('.filter-down').find('.moreSelect').html("更多选项");*/
            getAboutList(object);
            checkMoreBtn();
            //$scope.filterDown = true;


            //清除多选
            $('.filter-condition').find('.check-box').hide();
            $('.filter-condition').find('.check-box input').prop('checked',false);
            $('.filter-condition').find('.btns-item').css({'display':'none'});
            $('.checkMore').attr('data-switch','off');
            $scope.style_moreBtn=null;
            $scope.brand_moreBtn=null;
            $scope.types_moreBtn=null;
            //filterDown();
        };

        /*
         * .filter-down更多选项
         * */
        $('.component-list').off('click','.filter-down');
        $('.component-list').on('click','.filter-down',function(){
            if(brandsNum == 0){
                if($(this).hasClass('activeShow')){
                    $scope.isBrand = true;
                    $('.filter-down').find('.moreSelect').html("收起");
                    $(this).removeClass("activeShow");
                }else{
                    $scope.isBrand = false;
                    $('.filter-down').find('.moreSelect').html("更多选项");
                    $(this).addClass("activeShow");
                }
                $scope.$apply();
                checkMoreBtn();
            }

        });
        /*
        * 初始化模态框
        * 初始化参数配置
        * */
        $scope.componetModal = function (componentId,epId,obj) {
            var scope;
            if(epId == -2){
                scope = 1
            }else{
                scope = null
            }
            $scope.items = {
                "scope": scope,
                "componentId":componentId
            }
            var modalInstance = $uibModal.open({
                windowClass: 'component-modal',
                backdrop: 'static',
                animation: false,
                size: 'lg',
                templateUrl: 'template/core/modal.html',
                controller: 'modalCtrl',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                console.log(selectedItem)
                if(selectedItem != "" && selectedItem != undefined){
                    obj.proContiner = true;
                }
            }, function (selectedItem) {
                console.log(selectedItem);
            })
        };

        /*
        * 上传构件
        * */
        $scope.uploadCom = function() {
            var modalInstance = $uibModal.open({
                windowClass: 'uploadCom-modal',
                backdrop: 'static',
                animation: false,
                size: 'lg',
                templateUrl: 'template/component/uploadCom.html',
                controller: 'uploadComCtrl',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }

            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            });
        }
        /*
         * 返回顶部
         * */
        $(".return-top img").hover(function(){
            $(".return-top .textTop").css("display","block");
        },function(){
            $(".return-top .textTop").css("display","none");
        });
        $('.return-top').click(function() {
            $('.component-list').animate({ scrollTop: 0 }, 500);
        })
        $scope.reTop = function(){
            $('.componet-base-main').animate({ scrollTop: 0 }, 500);
        }

        /*
        * 构件应用、下载、更新
        * */
        //应用
        $scope.apply = function(subClassName,guid,epId,originEpId){
            BzCloudComp.UseComp(subClassName,guid,epId,originEpId);
        }
        //下载
        $scope.down = function(componentId,epId,originEpId,epName,originEpName,subClassName,guid,md5,lastestClientVersion,$event,obj){
            obj.proContiner=true;
            //$($event.target).parent().parent().prev('.preview-model').find('.proContiner').show();
            BzCloudComp.DownloadComp(componentId,epId,originEpId,epName,originEpName);
            var status = BzCloudComp.GetCompType(subClassName, guid, md5, epId, originEpId,lastestClientVersion);
        }

        //心跳
        commonService.heartBeat();

    }]);

