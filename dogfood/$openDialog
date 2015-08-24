/* format: option[object]: {'template': [String],
 *                          'controller': [Function],
 *                          'controllerAs': [String],
 *                          'title': [String],
 *                          'closeIcon': [Boolean] for close icon,
 *                          'flash': [Number]} for $timeout,
 *                          'param':{params for dialog}
 *
 *  'template','controller','controllerAs' is required in this service!
 * */

factory("$openDialog", ["$controller", "$compile", "$q", "$rootScope", "$window", "$timeout",
    function ($controller, $compile, $q, $rootScope, $window, $timeout) {
        return {
            openDialog: function (option) {
                var self = this;
                var deferred = $q.defer();
                var scope = $rootScope.$new(true);
                if (option.params) {
                    scope = angular.extend(scope, option.params);
                }

                var template = _.isString(option.template) ? option.template : '';
                var isCloseIcon = _.isBoolean(option.closeIcon) ? option.closeIcon : false;
                var haveTitle = _.isString(option.title) ? option.title : '';

                var $dialog,
                    titleEl = '',
                    icon = '';

                if (isCloseIcon) {
                    icon = '<i class="sui-icon icon-touch-error"></i>';
                    titleEl = '<span class="open-dialog-close">' + icon + '</span><h4 class="open-dialog-title"><span>' + haveTitle + '</span></h4>';
                }
                if (haveTitle) {
                    titleEl = '<span class="open-dialog-close">' + icon + '</span><div class="open-dialog-title open-dialog-have-title open-dialog-title-border"><span>' + haveTitle + '</span></div>';
                }
                if (!isCloseIcon && !haveTitle && !option.flash) {
                    titleEl = '<span class="open-dialog-close"></span><div class="open-dialog-title open-dialog-have-title open-dialog-title-border"><span></span></div>';
                }

                if (template) {
                    $dialog = $('<div class="overlay"></div><div class="open-dialog">' + titleEl + template + '</div>');
                } else {
                    deferred.reject('Template is required');
                }

                if ($dialog) {
                    if ($('.open-dialog').length != 0) {
                        $('.open-dialog:first').addClass('mask');

                        //$('.open-dialog:first').addClass('z-index-initial');
                        //$('.overlay:first').attr('style', 'z-index: initial;');

                        $('.open-dialog:first').addClass('z-index');
                        $('.overlay:first').attr('style', 'z-index: 15;');
                    }
                    var modalDomEl = $compile($dialog)(scope);
                    $("body").append(modalDomEl);

                    var left = $window.innerWidth / 2 - $('.open-dialog').outerWidth() / 2;
                    var top = $window.innerHeight / 2 - $('.open-dialog').outerHeight() / 2;
                    $('.open-dialog').attr("style", "left:" + left + "px;top:" + top + 'px;');

                    angular.element($window).bind('resize', resizeWindow);

                    if ($('.open-dialog').length > 1) {
                        left = $window.innerWidth / 2 - $('.open-dialog').not('.mask').outerWidth() / 2;
                        top = $window.innerHeight / 2 - $('.open-dialog').not('.mask').outerHeight() / 2;
                        $('.open-dialog').not('.mask').attr("style", "left:" + left + "px;top:" + top + 'px;');
                    }
                    $("body").children().not('.open-dialog').addClass('mask');
                }

                if (_.isFunction(option.controller)) {
                    var params = option.params || {};

                    var ctrl = option.controller;
                    if (option.controllerAs) {
                        scope[option.controllerAs] = ctrl;
                        ctrl = option.controllerAs + ' as ' + option.controllerAs;
                    }

                    $controller(ctrl, {$scope: scope, params: params, deferred: deferred});
                } else {
                    deferred.reject('Controller is required');
                }


                if (isCloseIcon) {
                    $('.open-dialog-close').on('click', function () {
                        deferred.reject();
                    });
                }

                $dialog.draggable( {handle: $('.open-dialog-title').not('.open-dialog-close')});
                $(document).on('keydown', cancelMove);

                //flash:
                if (/^[0-9]*$/.test(option.flash)) {
                    $('.open-dialog').not('.mask').attr("style", "left:" + ($window.innerWidth / 2 - $('.open-dialog').not('.mask').outerWidth() / 2) + "px;top:" + ($window.innerHeight / 2 - $('.open-dialog').not('.mask').outerHeight() / 2) + "px;");
                    $timeout(function () {
                        destroyDialog();
                    }, option.flash);
                } else if (option.flash) {
                    console.log("'Flash' must be a Number for timeout!!");
                }

                function resizeWindow() {
                    var left, top;
                    left = $window.innerWidth / 2 - $('.open-dialog').outerWidth() / 2;
                    top = $window.innerHeight / 2 - $('.open-dialog').outerHeight() / 2;
                    $('.open-dialog').attr("style", "left:" + left + "px;top:" + top + 'px;');
                    $('.open-dialog').not('.mask').attr("style", "left:" + ($window.innerWidth / 2 - $('.open-dialog').not('.mask').outerWidth() / 2) + "px;top:" + top + 'px;');
                }

                function cancelMove(event) {
                    if (event.keyCode == 27) {   //->'ESC'
                        deferred.reject();
                    }
                }

                function destroyDialog() {
                    $dialog.remove();
                    scope.$destroy();
                    if ($('.open-dialog').length != 0) {
                        $('.open-dialog:last').removeClass('mask');
                    }
                    if ($('.open-dialog').length == 0) {
                        $("body").children().not('.open-dialog').removeClass('mask');
                    }
                    $(document).off('keydown', '', cancelMove);
                    angular.element($window).unbind('resize', resizeWindow);
                }

                return deferred.promise.then(function (resolve) {
                    destroyDialog();
                    return resolve;
                }, function (reject) {
                    destroyDialog();
                    return $q.reject(reject);
                });
            }

        };
    }]);
