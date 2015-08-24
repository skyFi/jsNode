
directive('float', ['$visibleArea', function($visibleArea) {
    return {
        restrict: 'E',
        transclude: true,
        link: function (scope, element, attrs) {
            var timer = null;
            var $layer = $('.angular-layer', element);
            var $layerFlag = $('.angular-layer-flag', element);
            jQuery.fn.onPositionChanged = function (trigger, millis) {
                if (millis == null) millis = 100;
                var o = $(this[0]);
                if (o.length < 1) return o;

                var lastPos = o.offset();
                timer = setInterval(function () {
                    if (o == null || o.length < 1) {
                        return o;
                    }
                    var newPos = o.offset();
                    if (lastPos.top != newPos.top || lastPos.left != newPos.left) {
                        $(this).trigger('onPositionChanged', {lastPos: lastPos, newPos: newPos});
                        if (typeof (trigger) == "function") trigger(lastPos, newPos);
                        lastPos = o.offset();
                    }
                }, millis);

                return {
                    jq: o,
                    timer: timer
                };
            };
            if (attrs.ngHeight) {
                $layer.css({height: attrs.ngHeight + 'px'});
                $layerFlag.css({height: attrs.ngHeight + 'px'});
            }

            var left = $layerFlag.offset().left;
            var width = $layerFlag.width();
            $layer.css({left: left + 'px', width: width + 'px'});
            $('#angular-float').css({marginTop: $layerFlag.height() +'px'});

            $(function () {
                resizeLayer();
                $(window).on('scroll', resizeLayer);
                $(window).on('resize', resizeLayer);
                timer = $layerFlag.onPositionChanged(function (lastVal, newVal) {
                    if (lastVal.top != newVal.top) {
                        resizeLayer();
                    }
                }).timer;
            });

            function resizeLayer() {
                var height = $visibleArea.browserVisibleAreaHeight() + $(window).scrollTop(),
                    scrollTop = $(window).scrollTop(),
                    scrollLeft = $(window).scrollLeft(),
                    top = $layerFlag.offset().top,
                    h = $layer.height(),
                    width = $layerFlag.width(),
                    left = $layerFlag.offset().left;
                $layer.css({left: left - scrollLeft + 'px', width: width + 'px'});
                if (height < top + h) {
                    $layer.css({top: (height - scrollTop - h) + 'px', left: left - scrollLeft, borderBottom: '1px solid #ddd'});
                } else {
                    $layer.css({top: top - scrollTop, left: left - scrollLeft, borderBottom: 'none'});
                }
            }

            scope.$on('$destroy', function () {
                $(window).unbind('scroll', resizeLayer);
                clearInterval(timer);
            });

        },
        template: '<div id="angular-float">' +
                     '<div class="angular-layer-flag"></div>' +
                     '<div class="angular-layer">' +
                         '<div class="angular-layer-bg"></div>' +
                         '<div class="angular-layer-content">' +
                             '<ng-transclude></ng-transclude>' +
                         '</div>' +
                     '</div>' +
                  '</div>'
    }

}]);
