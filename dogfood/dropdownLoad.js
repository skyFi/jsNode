/**
 *
 * @param isEnd 是否全部加载完全了，隐藏loading bar; [Boolean]
 * @param ngLoading(callback) 下拉到底是加载执行此加载函数; [Function] 有一个callback参数[Function]: 回调函数，在异步获取Item后调用，用于防止下拉过程中未加载完仍继续下拉加载从而多次加载。
 * @element id="loader_angularSui" ID为loader_angularSui的DOM元素，在dropdownLoad内部(一般放在底部)，用于显示拉倒底部时展示，eg: ‘<div id="loader_angularSui">下拉加载。。。</div>’. [DOM]
 *
 **/
directive('dropdownLoad', ['$parse', function ($parse) {

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            jQuery.fn.onPositionChanged = function (trigger, millis) {
                var timer = null;
                if (millis == null) millis = 100;
                var o = $(this[0]);
                if (o.length < 1) return o;

                var lastPos = null;
                var lastOff = null;
                timer = setInterval(function () {
                    if (o == null || o.length < 1) {
                        clearInterval(timer);
                        return o;
                    }
                    if (lastPos == null) lastPos = o.position();
                    if (lastOff == null) lastOff = o.offset();
                    var newPos = o.position();
                    if (lastPos.top != newPos.top || lastPos.left != newPos.left) {
                        $(this).trigger('onPositionChanged', {lastPos: lastPos, newPos: newPos});
                        if (typeof (trigger) == "function") trigger(lastPos, newPos);
                        lastPos = o.position();
                    }
                }, millis);

                return {
                    jq: o,
                    timer: timer
                };
            };
            var getter = $parse(attrs.isEnd);
            scope.isEndLoading = getter(scope);

            var $loader = $(element).find('#loader_angularSui');
            var loadFile = true;
            var timer = $loader.onPositionChanged(function (lastVal, newVal) {
                if (newVal.top <= $(element).height()) {
                    if (loadFile && (scope.isEndLoading == false || scope.isEndLoading == 'false')) {
                        $parse(attrs.ngLoading)(scope, {callback: callback});  //执行函数
                        loadFile = false;
                    }
                }
            }).timer;

            function callback() {
                loadFile = true;
            }

            $(element).on('remove', function () {
                clearInterval(timer);            //清除计时器
            });

            scope.$watch(attrs.isEnd, function (value) {
                scope.isEndLoading = value;
                if (value == true || value == 'true') {
                    $loader.addClass('hide');
                } else {
                    $loader.removeClass('hide');
                }
            });
        }
    }
}]);
