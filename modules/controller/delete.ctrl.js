angular.module('core').controller('deleteModalCtrl', ['$scope', 'items', '$uibModalInstance','commonService',
    function ($scope,items,$uibModalInstance,commonService) {
        $scope.cancel = function(){
            $uibModalInstance.dismiss('');
        }
        $scope.ok = function(){
            if(items.str == "pro"){
                commonService.deleteProject(items.ids).then(function(res){
                    $uibModalInstance.close("");
                })
            }else{
                let list = [];
                items.ids.map((value)=>{
                    list.push({"schemeId": parseInt(value)})
                })
                commonService.deletePlan(list).then((res)=>{
                    $uibModalInstance.dismiss("deletePlan");
                })
            }
        }

    }]);