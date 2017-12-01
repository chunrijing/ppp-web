angular.module('core').controller('contrastModalCtrl', ['$scope', '$http','items', '$rootScope','$uibModalInstance','commonService','$timeout','$compile','$state',"$stateParams",
    function ($scope, $http,items,$rootScope,$uibModalInstance,commonService,$timeout,$compile,$state,$stateParams) {
        let urls = ApplicationConfiguration.urls.apiUrl;
        $scope.scheList = items;
        let ids = [];
        let names = [];
        items.map((v,i)=>{
            names.push(v.name);
            $scope.names = names;
            if(i==0){
                $scope.baseName = v.name;
                $scope.baseId = v.id;
            }else{
                ids.push(v.id);
            }
            $scope.schIds = ids.join(",");
        })
        getDate(ids.join(","),$scope.baseId);
        function getDate(ids,id){
            commonService.schemeContrast(ids,id).then((res)=>{
                if(res.success==true){
                    $(".contrastModal .tableAuto tbody").empty();
                    for(let i=0;i<res.result.length;i++){
                        let html = `<tr></tr>`;
                        let temp = $compile(html)($scope);
                        angular.element($(".contrastModal .tableAuto tbody").append(temp));
                    }
                    let trs = $(".contrastModal .tableAuto tr");
                    res.result.map((value,index)=>{
                        for(let i=0;i<value.length;i++){
                            let _value=value[i]==null?"":value[i];
                            let values=value[i]==null?"":(typeof value[i]=="number"?value[i].toFixed(2):value[i]);
                            let html = `<td class="dataNum"><input readonly="readonly" value="${values}" data-num="${_value}"></td>`;
                            let temp = $compile(html)($scope);
                            angular.element($(trs[index])).append(temp);
                        }
                    })
                    $(".contrastModal .tableAuto tr td:first-child").removeClass("dataNum");
                    $(".contrastModal .tableAuto tr td:nth-child(2)").removeClass("dataNum");
                }
                let height = $(document).height();
                $(".contrastModal .autoCon").height(height*0.6);
                $(".contrastModal .tableAuto tr").map((i,v)=>{
                    let baseNum;
                    $(v).find(".dataNum").map((index,value)=>{
                        let num = $(value).find("input").attr("data-num");
                        num = num==""?"":parseFloat(num);
                        if(index==0){
                            baseNum=num;
                        }else{
                            if(num>baseNum&&num!=0){
                                $(value).addClass("maxNum")
                            }else if(num<baseNum&&num!=0){
                                $(value).addClass("minNum")
                            }
                        }
                    })
                })
            })
        }

        $scope.select = (name,id)=>{
            let changeids = [];
            let changeName = [];
            $scope.baseId = id;
            $scope.baseName = name;
            $(".contrastModal .seleName").hide();
            items.map((v,i)=>{
                if(v.id!=id){
                    changeids.push(v.id);
                    changeName.push(v.name);
                }
            })
            changeName.splice(0,0,name);
            $scope.names = changeName;
            $scope.schIds = changeids.join(",");
            getDate(changeids.join(","),id);
        }

        $scope.showHide = ($event)=>{
            $($event.target).siblings("div").toggle();
        }
        $("body").click(function (e) {
            if (!$(e.target).closest(".glyphicon").length) {
                $(".contrastModal .seleName").hide();
            }
        });

        $scope.cancel = ()=>{
            $uibModalInstance.dismiss('');
        }
        $scope.export = ()=>{
            window.location.href=urls+"scheme/downLoad/"+$scope.schIds+'/'+$scope.names.join(",")+'/'+$scope.baseId;
            $uibModalInstance.dismiss('');
        }

    }]);