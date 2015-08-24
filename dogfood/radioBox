/**
 * @param: @ngOpts radio box 主体部分:格式为‘text1::value1,text2::value2’,同一个radio的text与value之间用两个冒号，两个radio之间用逗号，text可以为HTML.
 * @param: =ngModel 选择的值:value.
 * @param: @ngName radio box 的名字，即:radio name
 * @param: =ngClass [选填]
 *
 * */

directive('radioBox', [function() {
        return {
            scope: {
                opts: '@ngOpts',
                checkedValue: '=ngModel',
                name: '@ngName'
            },
            restrict: 'E',
            template: '<span class="angular-radiobox">' +
                            '<label data-ng-repeat="opt in radioOpts" class="radio-pretty inline" data-ng-class="{\'checked\': opt.radioValue == checkedValue}">' +
                                '<input type="text" name="{{name}}" value="{{opt.radioValue}}" data-ng-model="checkedValue" data-ng-click="selectValue($event)">' +
                                '<span><div data-ng-bind-html="opt.radioText"></div></span>' +
                            '</label>' +
                        '</span>',
            link: function (scope, element, attrs) {
                if (attrs.ngClass)$('.angular-radiobox', element).addClass(attrs.ngClass);
                scope.selectValue = function ($event) {
                    if ($($event.currentTarget).attr('value') == 'true') {
                        scope.checkedValue = true;
                    } else if ($($event.currentTarget).attr('value') == 'false') {
                        scope.checkedValue = false;
                    } else {
                        scope.checkedValue = $($event.currentTarget).attr('value');
                    }
                };

                element.on('keydown', function(event) {
                    event.preventDefault();
                });
            },
            controller: ['$scope', function ($scope) {
                $scope.radioOpts = [];
                var aOpts = $scope.opts.split(',');
                _.forEach(aOpts, function (opt) {
                    $scope.radioOpts.push({radioText: opt.split("::")[0],radioValue: opt.split("::")[1]});
                });

                _.forEach($scope.radioOpts, function (opt, i) {
                    if (opt.radioValue == 'true') {
                        $scope.radioOpts[i].radioValue = true;
                    }
                    if (opt.radioValue == 'false') {
                        $scope.radioOpts[i].radioValue = false;
                    }
                });
            }]
        };
    }]);
