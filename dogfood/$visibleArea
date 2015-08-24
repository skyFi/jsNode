factory('$visibleArea', function(){
    return {
        browserVisibleAreaHeight: function(){
            var $temp = $('<div></div>'), height = 0;
            $temp.css({
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                display: 'none',
                opacity: 0
            });
            $temp.appendTo($('body'));
            height = $temp.height();
            $temp.remove();
            return height;
        }
    };
});
