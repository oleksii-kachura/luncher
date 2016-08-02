'use strict';

(function($) {
    var href = location.href;

    chrome.storage.sync.get(null, makeLifeBetter);

    function makeLifeBetter(settings) {
        console.log(settings)
        $(document).ready(function() {
            settings.autoLogin && autoLogin();
            if (/luncher\.codilime\.com\/$/.test(href)) {
                removeDuplicateNumbers();
            }
            if (/luncher\.codilime\.com\/lunch\/menu\.html/.test(href)) {
                if (settings.autoOrder) {
                    autoOrder(settings);
                } else {
                    swapOrder();
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
        if (settings.orderPrefs) {
            var newSettings = $.extend({}, settings, {ordered: true});
            var regFirst = new RegExp(settings.orderPrefsFirst, 'i');
            var regSecond = new RegExp(settings.orderPrefsSecond, 'i');
            var menu = $('.control-group');
            var menuFirstMeals = menu.filter(function(i, elem) { return /ZUPA/i.test($(elem).text()); });
            var menuSecondMeals = menu.filter(function(i, elem) { return !/ZUPA/i.test($(elem).text()); });
            var firstMealCandidates = menuFirstMeals.filter(function(i, elem) { return regFirst.test($(elem).text()); });
            var secondMealCandidates = menuSecondMeals.filter(function(i, elem) { return regSecond.test($(elem).text()); });
            var random;
            var firtsMeal;
            var secondMeal;

            firtsMeal = firstMealCandidates.first();
            if (firtsMeal.length) {
                selectMeal(firtsMeal);
            } else {
                random = Math.floor(Math.random() * menuFirstMeals.length);
                selectMeal(menuFirstMeals.get(random));
            }

            secondMeal = secondMealCandidates.first();
            if (secondMeal.length) {
                selectMeal(secondMeal);
            } else {
                random = Math.floor(Math.random() * menuSecondMeals.length);
                selectMeal(menuSecondMeals.get(random));
            }

            if (prompt('Let\'s order?')) {
                // todo: ajax
                $('.form-actions button[type=submit]').click();
                chrome.storage.sync.set(newSettings);
            }
        }
    }

    function selectMeal(element) {
        element.find('label').click();
    }
})(window.$);