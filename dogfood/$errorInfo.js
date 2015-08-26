factory("$errorInfo", ['$timeout', '$window', function ($timeout, $window) {
    return {
        showError: function (msg) {
            var $info = $("<div style='display: none; background-color: red; box-shadow: 0 0 5px red;' class='info-confirm'>" + msg + "</div>");
            $("body").append($info);
            var left = $window.innerWidth / 2 - $('.info-confirm').outerWidth() / 2;
            $('.info-confirm').css({left: left + 'px'});

            $info.fadeIn(300);

            $timeout(function () {
                $info.fadeOut(500, function () {
                    $info.remove();
                })
            }, 2000);
        },
        showSuccess: function (msg) {
            var $info = $("<div style='display: none; background-color: #44cd6f; box-shadow: 0 0 5px #44cd6f;' class='info-confirm'>" + msg + "</div>");
            $("body").append($info);
            var left = $window.innerWidth / 2 - $('.info-confirm').outerWidth() / 2;
            $('.info-confirm').css({left: left + 'px'});

            $info.fadeIn(300);

            $timeout(function () {
                $info.fadeOut(500, function () {
                    $info.remove();
                })
            }, 2000);
        },

        /**
         * @param:$element HTML元素(位置) JQuery
         * @param:msg 展示的信息 String
         * @param:type 【可不填】设置tip的类型，默认是attention，可选值：'default','primary','info'  String
         **/
        showTip: function($element, msg, type){
            var style = 'overflow:visible;max-width:400px;white-space:normal;margin-left: 66px;margin-top: 4px;';

            var tClass = 'attention';
            if(type){
                tClass = type;
            }
            var $html = $('<div class="sui-tooltip ' + tClass + ' fade in bottom" style="' + style + '">' +
                          '<div class="tooltip-arrow">' +
                              '<div class="tooltip-arrow cover"></div>' +
                          '</div>' +
                          '<div class="tooltip-inner">' + msg + '</div>' +
                       '</div>');
            $($element).append($html);
            return {
                closeTip: function(){
                    $html.remove();
                }
            }
        }
    }
}]);
