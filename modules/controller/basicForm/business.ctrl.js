angular.module("core").controller('businessCtrl', ['$scope', '$http','commonService','$uibModal','$window','$compile','$interval',
    function ($scope, $http, commonService,$uibModal,$window,$compile,$interval) {
        let info = $window.sessionStorage.getItem("info").split(",");
        $scope.projectId = parseInt(info[0]);
        $scope.schemeId = parseInt(info[1]);
        commonService.getPeriod($scope.schemeId).then((res)=>{
            $scope.periodOptrationa = res.result.periodOptrationa;
            if($scope.periodOptrationa<=15){
                $scope.yearCount = false;
            }else{
                $scope.yearCount = true;
            }
            commonService.getBusiness($scope.schemeId).then((res)=> {
                $scope.list = res.result;
                getTbale();
            })
        })

        function getChange(){
            $(".business input").change(function() {
                window.businessChange=true;
            });
        }

        function getTbale(){
            let html,htmls,html_s;
            if($scope.list.length!=$scope.periodOptrationa){
                $scope.list = null;
                if($scope.periodOptrationa<=15){
                    for(let i=0;i<$scope.periodOptrationa;i++){
                        html = `<th>${i+1}</th>`;
                        htmls = `<td ><input type="number" min="0" max="100" yearNum=${i+1} set-focus data-num="100" value="100.00"></td>`;
                        html_s = `<td><input type="number" min="0" data-num="0" value="0.00" yearNum=${i+1} set-focus></td>`
                        let temp = $compile(html)($scope);
                        let temps = $compile(htmls)($scope);
                        let temp_s = $compile(html_s)($scope);
                        angular.element($(".business .topTable .year")).append(temp);
                        angular.element($(".business .topTable .rate")).append(temps);
                        angular.element($(".business .topTable .pay")).append(temp_s);
                    }
                    for(let i=$scope.periodOptrationa+1;i<16;i++){
                        html = `<th style="background: #f0f0f0">${i}</th>`;
                        htmls = `<td style="background: #f0f0f0"></td>`;
                        html_s = `<td style="background: #f0f0f0"></td>`
                        let temp = $compile(html)($scope);
                        let temps = $compile(htmls)($scope);
                        let temp_s = $compile(html_s)($scope);
                        angular.element($(".business .topTable .year")).append(temp);
                        angular.element($(".business .topTable .rate")).append(temps);
                        angular.element($(".business .topTable .pay")).append(temp_s);
                    }
                }else{
                    for(let i=1;i<16;i++){
                        html = `<th>${i}</th>`;
                        htmls = `<td ><input type="number" min="0" max="100" yearNum=${i} step="0.01" set-focus data-num="100" value="100.00"></td>`;
                        html_s = `<td><input type="number" min="0" yearNum=${i} step="0.01" data-num="0" value="0.00" set-focus></td>`
                        let temp = $compile(html)($scope);
                        let temps = $compile(htmls)($scope);
                        let temp_s = $compile(html_s)($scope);
                        angular.element($(".business .topTable .year")).append(temp);
                        angular.element($(".business .topTable .rate")).append(temps);
                        angular.element($(".business .topTable .pay")).append(temp_s);
                    }
                    for(let i=16;i<$scope.periodOptrationa+1;i++){
                        html = `<th>${i}</th>`;
                        htmls = `<td ><input type="number" min="0" max="100" yearNum=${i} step="0.01" set-focus data-num="100" value="100.00"></td>`;
                        html_s = `<td><input type="number" min="0" yearNum=${i} step="0.01" data-num="0" value="0.00" set-focus></td>`
                        let temp = $compile(html)($scope);
                        let temps = $compile(htmls)($scope);
                        let temp_s = $compile(html_s)($scope);
                        angular.element($(".business .bottomTable .year")).append(temp);
                        angular.element($(".business .bottomTable .rate")).append(temps);
                        angular.element($(".business .bottomTable .pay")).append(temp_s);
                    }
                    for(let i=$scope.periodOptrationa+1;i<31;i++){
                        html = `<th style="background: #f0f0f0">${i}</th>`;
                        htmls = `<td style="background: #f0f0f0"></td>`;
                        html_s = `<td style="background: #f0f0f0"></td>`
                        let temp = $compile(html)($scope);
                        let temps = $compile(htmls)($scope);
                        let temp_s = $compile(html_s)($scope);
                        angular.element($(".business .bottomTable .year")).append(temp);
                        angular.element($(".business .bottomTable .rate")).append(temps);
                        angular.element($(".business .bottomTable .pay")).append(temp_s);
                    }
                }
            }else{
                if($scope.periodOptrationa<=15){
                    $scope.list.map((item)=>{
                        html = `<th>${item.yearNum}</th>`;
                        htmls = `<td ><input type="number" min="0" max="100" yearNum=${item.yearNum} set-focus data-num=${item.optrationalCode} value=${item.optrationalCode.toFixed(2)}></td>`;
                        html_s = `<td><input type="number" min="0" yearNum=${item.yearNum} set-focus data-num=${item.subsidizeRevenue} value=${item.subsidizeRevenue.toFixed(2)}></td>`
                        let temp = $compile(html)($scope);
                        let temps = $compile(htmls)($scope);
                        let temp_s = $compile(html_s)($scope);
                        angular.element($(".business .topTable .year")).append(temp);
                        angular.element($(".business .topTable .rate")).append(temps);
                        angular.element($(".business .topTable .pay")).append(temp_s);
                    })
                    for(let i=$scope.periodOptrationa+1;i<=15;i++){
                        html = `<th>${i}</th>`;
                        htmls = `<td  style="background: #f0f0f0"></td>`;
                        html_s = `<td style="background: #f0f0f0"></td>`
                        let temp = $compile(html)($scope);
                        let temps = $compile(htmls)($scope);
                        let temp_s = $compile(html_s)($scope);
                        angular.element($(".business .topTable .year")).append(temp);
                        angular.element($(".business .topTable .rate")).append(temps);
                        angular.element($(".business .topTable .pay")).append(temp_s);
                    }
                }else{
                    let topList = $scope.list.slice(0,15);
                    let count= $scope.list.length;
                    let botList = $scope.list.slice(15,count);
                    topList.map((item)=>{
                        html = `<th>${item.yearNum}</th>`;
                        htmls = `<td ><input type="number" min="0" max="100" yearNum=${item.yearNum} set-focus data-num=${item.optrationalCode} value=${item.optrationalCode.toFixed(2)}></td>`;
                        html_s = `<td><input type="number" min="0" yearNum=${item.yearNum} set-focus data-num=${item.subsidizeRevenue} value=${item.subsidizeRevenue.toFixed(2)}></td>`
                        let temp = $compile(html)($scope);
                        let temps = $compile(htmls)($scope);
                        let temp_s = $compile(html_s)($scope);
                        angular.element($(".business .topTable .year")).append(temp);
                        angular.element($(".business .topTable .rate")).append(temps);
                        angular.element($(".business .topTable .pay")).append(temp_s);
                    })
                    botList.map((item)=>{
                        html = `<th>${item.yearNum}</th>`;
                        htmls = `<td ><input type="number" min="0" max="100" yearNum=${item.yearNum} set-focus data-num=${item.optrationalCode} value=${item.optrationalCode.toFixed(2)}></td>`;
                        html_s = `<td><input type="number" min="0" yearNum=${item.yearNum} set-focus data-num=${item.subsidizeRevenue} value=${item.subsidizeRevenue.toFixed(2)}></td>`
                        let temp = $compile(html)($scope);
                        let temps = $compile(htmls)($scope);
                        let temp_s = $compile(html_s)($scope);
                        angular.element($(".business .bottomTable .year")).append(temp);
                        angular.element($(".business .bottomTable .rate")).append(temps);
                        angular.element($(".business .bottomTable .pay")).append(temp_s);
                    })
                    for(let i=$scope.periodOptrationa+1;i<=30;i++){
                        html = `<th style="background: #f0f0f0">${i}</th>`;
                        htmls = `<td style="background: #f0f0f0"></td>`;
                        html_s = `<td style="background: #f0f0f0"></td>`
                        let temp = $compile(html)($scope);
                        let temps = $compile(htmls)($scope);
                        let temp_s = $compile(html_s)($scope);
                        angular.element($(".business .bottomTable .year")).append(temp);
                        angular.element($(".business .bottomTable .rate")).append(temps);
                        angular.element($(".business .bottomTable .pay")).append(temp_s);
                    }
                }
            }

            getChange();
        }

    }]);