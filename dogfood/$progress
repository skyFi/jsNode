factory('$progress', ['$window', function ($window) {
    return {
        openProgress: function () {
            var template = $('<div class="overlay"></div>' +
                            '<div class="angular-progress">' +
                               '<div class="loading-progress"></div>' +
                               '<div style="margin-bottom: 0;" class="sui-progress progress-striped active">' +
                                  '<div class="bar"></div>' +
                               '</div>' +
                            '</div>');
            $('body').append(template);
            var left = $window.innerWidth / 2 - $('.angular-progress').outerWidth() / 2;
            $('.angular-progress').css({left: left + 'px'});

            return {

                change: function (loaded, total) {
                    var progress = 0;
                    if (total != 0) {
                        progress = Math.round(loaded * 100 / total);
                    }
                    $('.bar', template).attr('style', 'width:' + progress + '%;');
                    $('.loading-progress', template).html('上传进度：' + Math.round(loaded / 1024) + 'KB / ' + Math.round(total / 1024) + 'KB');
                },
                close: function () {
                    $(template).remove();
                }
            }
        }

    }
}]);
