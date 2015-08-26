directive("selector", ["$timeout", function($timeout){
    return {
        restrict: "E",
        scope: {
            selected: '=ngModel',
            selections: '=ngSelections',
            disabled: '=ngDisabled'
        },
        link: function(scope, element, attrs) {
            var timer;
            if (scope.selections != null){
                if (attrs.ngNull) {
                    if (scope.selections[0].title != attrs.ngNull) {
                        scope.selections.unshift({title: attrs.ngNull, value: ''});
                    }
                }
                selectTitle(scope.selected);
            }

            scope.$watchGroup(['selections', 'selected'], function(values) {
                var selections = values[0],
                    selected = values[1];
                if (selections != null) {
                    selectTitle(selected);
                }

            });

            function selectTitle(value) {
                if(value === '' || value === null) {
                    scope.selectedTitle = scope.selections[0].title;
                    scope.selected = scope.selections[0].value;
                } else {
                    _.forEach(scope.selections, function(selection, key){
                        if (value || value === false || value === 0) {
                            if (selection.value.toString() == value.toString()) {
                                scope.selectedTitle = selection.title;
                            }
                        }
                    });
                }
            }
            if (attrs.ngClass) {
                $('.sui-dropdown', element).addClass(attrs.ngClass);
            }

            $('.dropdown-inner', element).on('click', function (data) {
                if (!scope.disabled) {
                    $('.sui-dropdown', element).addClass('open');
                }
                if (data.target.getAttribute("role") == "menuitem") {
                    $('.sui-dropdown').removeClass('open');
                    var value = data.target.getAttribute("value");
                    selectTitle(value);
                    scope.selected = value;
                    scope.$apply();
                }
            });

            $('.sui-dropdown', element).on('mouseleave', function (data) {
                timer = $timeout(function () {
                    $('.sui-dropdown', element).removeClass('open');
                }, 400);
            });

            $('.sui-dropdown', element).on('mouseenter', function (data) {
                $timeout.cancel(timer);
            });
        },

        template: '<span class="sui-dropdown dropdown-bordered select" data-ng-class="{disabled: disabled}">' +
        '<span class="dropdown-inner inner-set">' +
        '<a id="select" role="button" href="javascript:void(0);" data-toggle="dropdown" class="dropdown-toggle">' +
        '<input type="hidden">' +
        '<i class="caret caret-set"></i>' +
        '<span>{{selectedTitle}}</span>' +
        '</a>' +
        '<ul role="menu" aria-labelledby="drop4" class="sui-dropdown-menu">' +
        '<li role="presentation" data-ng-repeat="selection in selections" data-ng-class="{active: selected==selection.value}">' +
        '<a role="menuitem" tabindex="-1" href="javaScript:void(0);" value="{{selection.value}}">{{selection.title}}</a>' +
        '</li>' +
        '</ul>' +
        '</span>' +
        '</span>'
    };
}]);
