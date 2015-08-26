;
(function ($) {
		$.fn.autoFit = function() {
			var $this = $(this);
			var oldWidth = parseInt($this.css('width'));
			$this.keydown(function (event) {
				var $this = $(this);
				setTimeout(function() {
					var val = $this.val().replace(/ /g, '&nbsp');
					var fontSize = $this.css('font-size');
					var fontFamily =  $this.css('font-family');
					var padding = $this.outerWidth() - $this.width();
					var contentWidth = $('<span id="autowidthforinputtext" style="font-size: ' + fontSize + '; padding: 0 ' + padding / 2 + 'px; font-family: ' + fontFamily + '; display: block; position: absolute; visibility: hidden;">' + val + '</span>').insertAfter($this).outerWidth();
				    	var newWidth = ((contentWidth + padding) > oldWidth) ? (contentWidth + padding) : oldWidth;
					$('#autowidthforinputtext').remove();
					$this.width(newWidth + 'px');
				}, 0);
			});
			return $this;
		};
})(this['jQuery']);
