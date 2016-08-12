'use strict';

(function($) {
    var href = location.href;

    chrome.storage.sync.get(null, makeLifeBetter);

    function makeLifeBetter(settings) {
        console.info('%c' + 'luncher data: ', 'color:#00A539', settings);

        $(document).ready(function() {
            settings.autoLogin && autoLogin();
            if (/luncher\.codilime\.com\/$/.test(href)) {
                removeDuplicateNumbers();
            }
            if (/luncher\.codilime\.com\/lunch\/menu\.html/.test(href)) {
                swapOrder();
                if (settings.autoOrder && !settings.ordered) {
                    autoOrder(settings);
                }
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
            $(elem).text(text.replace(/\d+\.\s+/, ''));
        });
    }

    function swapOrder() {
        $('.control-group')
            .filter(function(i, elem) {
                return /\s1\.\s/.test($(elem).text());
            })
            .last()
            .addClass('codilime-swap-order');
    }

    function autoOrder(settings) {
        var newSettings = $.extend({}, settings, {ordered: true});
        var menu = $('.control-group');
        var random;

        if (settings.orderPrefsFirst) {
            var regFirst = new RegExp(settings.orderPrefsFirst, 'i');
            var menuFirstMeals = menu.filter(function(i, elem) { return /ZUPA/i.test($(elem).text()); });
            var firstMealCandidates = menuFirstMeals.filter(function(i, elem) { return regFirst.test($(elem).text()); });
            var firstMeal;

            firstMeal = firstMealCandidates.first();
        }
        if (!firstMeal || !firstMeal.length) {
            random = Math.floor(Math.random() * menuFirstMeals.length);
            firstMeal = menuFirstMeals.get(random);
        }
        selectMeal(firstMeal);

        if (settings.orderPrefsSecond) {
            var regSecond = new RegExp(settings.orderPrefsSecond, 'i');
            var menuSecondMeals = menu.filter(function(i, elem) { return !/ZUPA/i.test($(elem).text()); });
            var secondMealCandidates = menuSecondMeals.filter(function(i, elem) { return regSecond.test($(elem).text()); });
            var secondMeal;

            secondMeal = secondMealCandidates.first();
        }
        if (!secondMeal || !secondMeal.length) {
            random = Math.floor(Math.random() * menuSecondMeals.length);
            secondMeal = menuSecondMeals.get(random);
        }
        selectMeal(secondMeal);

        setTimeout(function() {
            if (confirm('Let\'s order?\n\n- ' + $(firstMeal).text().trim() + '\n\n- ' + $(secondMeal).text().trim())) {
                // todo: ajax
                $('.form-actions button[type=submit]').click();
                chrome.storage.sync.set(newSettings);
            }
        }, 1000);
    }

    function selectMeal(element) {
        $(element).find('label').click();
    }
})(window.$);