angular.module('core').directive('repeatFinish',function($timeout){
    return {
        link: function(scope,element,attr){
            if(scope.$last == true){
                scope.$emit('listrepeatFinish');
            }
        }
    }
})
angular.module('core').directive('ngrepeatFinish',function($timeout){
    return {
        link: function(scope,element,attr){
            if(scope.$last == true){
                scope.$emit('nglistrepeatFinish');
            }
        }
    }
})
angular.module('core').directive('onFinishRenderFilters', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        link: function(scope,element,attr) {
            if (scope.$last === true) {
                var finishFunc=scope.$parent[attr.onFinishRenderFilters];
                if(finishFunc)
                {
                    finishFunc();
                }
            }
        }
    };
}])

angular.module('core').directive('ngFocus', [function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            ctrl.$focused = false;
            element.bind('focus', function(evt) {
                $(element).removeClass("focused");
                /*let type = $(element).attr("ng-model");
                let optrationa = $(".basicForm .optrationa").find("input").val();
                if(type=="obj.playbackPeriod"){
                    if(optrationa==""){
                        $(element).addClass("focused");
                        $(".basicForm .prompt").show();
                    }else{
                        $(element).removeClass("focused");
                        $(".basicForm .prompt").hide();
                    }
                }*/
                let val = $(element).val();
                if(val.length ==1){
                    $(element).val(val.replace(/[^1-9]/g,''));
                }
                scope.$apply(function() {ctrl.$focused = true;});
            }).bind('blur', function(evt) {
                let type = $(element).attr("ng-model");

                let min = parseInt($(element).attr("min"));
                let max = parseInt($(element).attr("max"));
                let num = $(element).val();
                let optrationa = $(".basicForm .optrationa").find("input").val();
                if(num==""){
                    if(type=="obj.periodOptrationa"||type=="obj.periodConstruction"){
                        $(element).addClass("focused");
                    }
                    return
                }else{
                    let minOp = $(".basicForm .option").attr("min");
                    let maxOp = $(".basicForm .option").attr("max");
                    let numOp = $(".basicForm .option").val();
                    if(num<0){
                        $(element).addClass("focused");
                        return
                    }
                    if((min<=parseInt(num)&&parseInt(num)<=max)){
                        $(element).removeClass("focused");
                        if(type=="obj.periodOptrationa"||type=="obj.periodConstruction"){
                            if($(element).val()==""){
                                $(element).addClass("focused");
                            }
                            /*let periodConstruction = $(element).parents("tr").prev().find("input").val();
                            let periodOptrationa = $(element).val();
                            if(parseFloat(periodOptrationa)<=parseFloat(periodConstruction)){
                                $(element).addClass("focused");
                                $(element).parents("tr").find("p").show();
                            }else{
                                $(element).removeClass("focused");
                                $(element).parents("tr").find("p").hide();
                            }*/
                        }
                        /*if(type=="obj.periodConstruction"){
                            let periodOptrationa = $(element).parents("tr").prev().find("input").val();
                            let periodConstruction= $(element).val();
                            if(periodOptrationa<=periodConstruction){
                                $(element).addClass("focused");
                            }else{
                                $(element).removeClass("focused");
                            }
                        }*/
                        //$(".basicForm .promptTitle").hide();
                    }else{
                        if(type=="obj.playbackPeriod"){
                            $(".basicForm .prompt").hide();
                            if(max==""||isNaN(max)){
                                $(".basicForm .prompt").show();
                            }else{
                                if(max<=num){
                                    $(element).addClass("focused");
                                    $(".basicForm .promptTitle").show();
                                }else{
                                    $(element).removeClass("focused");
                                    $(".basicForm .promptTitle").hide();
                                }
                            }
                        }else{
                            $(element).addClass("focused");
                        }
                    }

                }
                scope.$apply(function() {ctrl.$focused = false;});
            });
        }
    }
}]);
angular.module('core').directive('setFocus', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, ctrl) {
            //ctrl.$focused = false;
            element.bind('focus', function(evt) {
                $(element).removeClass("focused");
                let val = $(element).val();
                if(val.length ==1&&$(element).attr("type")=='number'){
                    $(element).val(val.replace(/[^(\d)]/g,''));
                }else{
                    //$(element).val(val.replace(/\D/g,''));
                }
            }).bind('blur', function(evt) {
                if($(element).attr("readonly")=="readonly"){
                    return
                }
                let min = parseInt($(element).attr("min"));
                let max = parseInt($(element).attr("max"));
                let optrationa = $(element).val();
                if($(element).attr("readonly")==undefined){
                    if(optrationa==""){
                        $(element).attr("data-num","")
                    }else{
                        $(element).attr("data-num",optrationa);
                        $(element).removeClass("focused");
                        if($(element).attr("type")=="number"){
                            let num = parseFloat(optrationa).toFixed(2);
                            $(element).val(num);
                            if($(element).parent().hasClass("amount")){
                                let nums = parseFloat(optrationa);
                                $(element).val(nums);
                                $(element).attr("data-num",nums)
                            }
                        }
                        if((isNaN(min)||isNaN(max))){
                            if(min>parseInt(optrationa)||parseInt(optrationa)>max){
                                $(element).addClass("focused");
                            }
                        }else{
                            if((min<=parseFloat(optrationa))&&parseFloat(optrationa)<=max || max==undefined){
                                if($(element).hasClass("focused")){

                                }else{
                                    $(element).removeClass("focused");
                                }
                            
                            }else{
                                $(element).addClass("focused");
                            }
                        }
                        if($(element).parent("td").attr("name")=='addTd'){
                            let tds = $(element).parents("tr").find("td[name='addTd']");
                            let total = 0;
                            for(let i=0;i<tds.length;i++){
                                let num=$(tds[i]).find("input").attr("data-num");
                                num=num==undefined?0:parseFloat(num);
                                total+=num;
                            }

                            if(total!=100){
                                $(element).addClass("focused");
                            }else{
                                if($(element).hasClass("focused")){

                                }else{
                                    $(element).parents("tr").find("td[name='addTd'] input").removeClass("focused");
                                }
                            }
                        }
                        if($(element).parents("tr").attr("defaultNum")=="4"||$(element).parents("tr").attr("defaultNum")=="9"){
                            let _this = $(element).parents("tr").find("td input");
                            let num = _this.attr("data-num");
                            if(num!=""&&!_this.hasClass("focused")){
                                let _num = 100-parseFloat(num);
                                $(element).parents("tr").next().find("td input").val(_num.toFixed(2)).attr("data-num",_num);
                            }
                        }
                    }
                }
            });
        }
    }
}]);
