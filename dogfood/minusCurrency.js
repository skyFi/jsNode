filter('minusCurrency',
    ['$filter', '$locale',
        function (filter, locale) {
            var currencyFilter = filter('currency');
            var formats = locale.NUMBER_FORMATS;
            formats.CURRENCY_SYM = "￥";
            formats.PATTERNS[1].negPre = '\u00A4-';
            formats.PATTERNS[1].negSuf = '';
            return function (amount, currencySymbol) {
                return currencyFilter(amount, currencySymbol);
            };
        }]);
