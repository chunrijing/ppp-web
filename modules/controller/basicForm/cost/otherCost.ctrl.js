angular.module("core").controller('otherCostCtrl', ['$scope', '$http','commonService','$uibModal','$window','$compile','$interval',
    function ($scope, $http, commonService,$uibModal,$window,$compile,$interval) {
        let info = $window.sessionStorage.getItem("info").split(",");
        $scope.projectId = parseInt(info[0]);
        $scope.schemeId = parseInt(info[1]);

        commonService.getOtherCost(
            {
                "projectId": $scope.projectId,
                "schemeId": $scope.schemeId
            }
        ).then((res)=> {
            res.result.map((item, index)=> {
                let itemValue = item.itemValue==null?"":item.itemValue;
                let itemValues = item.itemValue==null?"":item.itemValue.toFixed(2);
                let html = `<tr ng-click="click($event)">
                    <td width="10%">${item.defaultNum}</td>
                    <td width="45%">${item.itemName}</td>
                    <td width="45%"><input type="number" min="0" max="100" set-focus value="${itemValues}" data-num="${itemValue}"></td>
                </tr>`
                let temp = $compile(html)($scope);
                angular.element($(".otherCost .body tbody")).append(temp);
            })
            $(".otherCost .body tr:nth-child(2) td:last-child input").removeAttr("max");
        })

    }]);