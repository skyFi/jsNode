;
(function ($) {
    var methods = {
        init: function (options) {
            var settings = $.extend(true, {}, $.fn.autoFit.defaults, options);
            var $this = $(this);

            $this.keydown(methods.fit);

            methods.fit.call(this, null);

            return $this;
        },

        fit: function (event) {
            var $this = $(this);

            var val = $this.val().replace(' ', '-');
            var fontSize = $this.css('font-size');
            var padding = $this.outerWidth() - $this.width();
            var contentWidth = $('<span id="autowidthforinputtext" style="font-size: ' + fontSize + '; padding: 0 ' + padding / 2 + 'px; display: inline-block; position: absolute; visibility: hidden;">' + val + '</span>').insertAfter($this).outerWidth();
            $('#autowidthforinputtext').remove();
            $this.width((contentWidth + padding) + 'px');

            return $this;
        }
    };

    $.fn.autoFit = function (options) {
        if (typeof options == 'string' && methods[options] && typeof methods[options] === 'function') {
            return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof options === 'object' || !options) {
            // Default to 'init'
            return this.each(function (i, element) {
                methods.init.apply(this, [options]);
            });
        } else {
            $.error('Method ' + options + ' does not exist on jquery.auto-fit.');
            return null;
        }
    };

    $.fn.autoFit.defaults = {};

})(this['jQuery']);
