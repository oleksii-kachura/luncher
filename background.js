'use strict';

(function() {
    var orderPage = 'http://luncher.codilime.com/lunch/menu.html';

    chrome.storage.sync.get(null, makeLifeBetter);
    chrome.tabs.onUpdated.addListener(activateIcon);
    
    function makeLifeBetter(settings) {
        var hours = (new Date()).getHours();

        if (settings.autoOpen && !settings.ordered && hours < 11) {
            chrome.tabs.create({url: orderPage});
        }
        if (hours >= 11) {
            var newSettings = $.extend({}, settings, {ordered: false});
            chrome.storage.sync.set(newSettings);
        }
    }
    
    /**
     * Shows extension icon as active.
     * @param tabId - ID of the current tab.
     * @param changeInfo
     * @param tab - Current tab.
     */
    function activateIcon(tabId, changeInfo, tab) {
        if (/luncher.codilime.com/.test(tab.url)) {
            chrome.pageAction.show(tabId);
        }
    }
})();