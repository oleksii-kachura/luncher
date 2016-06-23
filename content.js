'use strict';

;
(function($) {
    var href = location.href;

    chrome.storage.sync.get(null, makeLifeBetter);

    function makeLifeBetter(settings) {
        $(document).ready(function() {
            settings.autoLogin && autoLogin();
            if (/luncher\.codilime\.com/.test(href)) {
                removeDuplicateNumbers();
            }
        });
    }

    function autoLogin() {
        if (/luncher\.codilime\.com\/login/.test(href)) {
            $('img').click();
        }
        if (/accounts\.google\.com\/AccountChooser/.test(href) && /luncher\.codilime\.com\/login/.test(document.referrer)) {
            var list = document.querySelectorAll('#gaia_loginform ol button');
            var i = 0;
            while (i < list.length) {
                if (/@codilime\.com/.test(list[i].value)) {
                    list[i].click();
                    break;
                }
                i++;
            }
        }
    }

    function removeDuplicateNumbers() {
        $('tbody tr td:nth-child(2)').each(function(i, elem) {
            var text = $(elem).text();
            $(elem).text(text.replace(/^\d+\.\s+/, ''));
        });
    }
})(window.$);