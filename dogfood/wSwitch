/**
 * @wSwitch:
 *       ngWSwitch->switch()[function].
 *       ngSize-> L/M/S [String] for switch size ,default value is M.
 *       ngModel->ngModel.
 *       transclude->
 *                  <div data-ng-open="[true value of model. String]">[true value text or some HTML]</div>
 *                  <div data-ng-close="[false value of model. String]">[false value text or some HTML]</div>
 **/
directive('wSwitch', ['$parse', '$visibleArea', '$pageContext', function ($parse, $visibleArea, $pageContext) {
    return {
        restrict: 'E',
        transclude: true,
        link: function (scope, element, attrs) {
            var size = attrs.ngSize;  //L M S
            var $switch = $('#wSwitch', element);
            var $layerSwitch = $('#layerSwitch', element);
            var $openEl = $('div[w-switch-open]', element);
            var $closeEl = $('div[w-switch-close]', element);
            /**add:悬浮开关：
             * @param:layerBtn[Boolean]
             * */
            if(attrs.layerBtn && (attrs.layerBtn == true || attrs.layerBtn == 'true')) {
                scope.isLayerBtn = true;
            } else {
                scope.isLayerBtn = false;
            }

            $openEl.addClass('switch-open');
            $closeEl.addClass('switch-close');
            $closeEl.addClass('hide');

            if (size == 'L') {
                $switch.addClass('w-switch-l');
                $layerSwitch.addClass('w-switch-l');
            }

            if (size == 'M' || size == undefined) {
                $switch.addClass('w-switch');
                $layerSwitch.addClass('w-switch');
            }

            if (size == 'S') {
                $switch.addClass('w-switch-s');
                $layerSwitch.addClass('w-switch-s');
            }

            scope.$watch(attrs.ngModel, function (newVal) {

                if (newVal !== undefined) {
                    switchStatus(newVal);
                }
            });

            scope.wSwitch = function () {

                $parse(attrs.ngWswitch)(scope);
            };

            function switchStatus(val) {

                if (val.toString() == $openEl.attr('w-switch-open')) {
                    $openEl.removeClass('hide');
                    $switch.addClass('w-switch-open-border');
                    $layerSwitch.addClass('w-switch-open-border');
                } else {
                    $openEl.addClass('hide');
                    $switch.removeClass('w-switch-open-border');
                    $layerSwitch.removeClass('w-switch-open-border');
                }

                if (val.toString() == $closeEl.attr('w-switch-close')) {
                    $closeEl.removeClass('hide');
                    $switch.addClass('w-switch-close-border');
                    $layerSwitch.addClass('w-switch-close-border');
                } else {
                    $closeEl.addClass('hide');
                    $switch.removeClass('w-switch-close-border');
                    $layerSwitch.removeClass('w-switch-close-border');
                }
            }

            if (scope.isLayerBtn) {
                $pageContext.addListener('resizeBtnLayer', resizeBtnLayer);
            }

            $(function () {
                resizeBtnLayer();
                $(window).on('scroll', resizeBtnLayer);
            });

            function resizeBtnLayer() {
                if (scope.isLayerBtn) {
                    var height = $visibleArea.browserVisibleAreaHeight() + $(window).scrollTop(),
                        baseTop = $('.hermes-main-content').offset().top,
                        top = $('.btn-layer-flag').offset().top,
                        h = $('.btn-layer').height();
                    if (height < top + h) {
                        $('.btn-layer').css({top: (height - baseTop - h) + 'px', borderBottom: '1px solid #ddd'});
                    } else {
                        $('.btn-layer').css({top: top - baseTop, borderBottom: 'none'});
                    }
                }
            }

            scope.$on('$destroy', function () {
                $pageContext.removeListener('resizeBtnLayer', resizeBtnLayer);
                $(window).unbind('scroll', resizeBtnLayer);
            });
        },
        template:

        '<div style="margin-top: 60px;" data-ng-show="isLayerBtn">' +
        '<div class="btn-layer-flag"></div>' +
        '<div class="btn-layer">' +
        '<div class="btn-layer-bg"></div>' +
        '<div class="btn-layer-content">' +
        '<span id="layerSwitch" class="w-switch" data-ng-click="wSwitch()">' +
        '<ng-transclude></ng-transclude>' +
        '</span>' +
        '</div>' +
        '</div>' +
        '</div>' +

        '<div data-ng-show="!isLayerBtn"><span id="wSwitch" class="w-switch" data-ng-click="wSwitch()">' +
        '<ng-transclude></ng-transclude>' +
        '</span></div>'
    }
}]);
