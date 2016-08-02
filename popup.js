'use strict';

(function($) {
    var defaultSettings = {
        autoOpen: true,
        autoLogin: false,
        autoOrder: false,
        orderPrefsFirst: '',
        orderPrefsSecond: '',
        ordered: false
    };

    // retrieve settings from chrome storage and initiate popup
    chrome.storage.sync.get(null, initPopup);

    /**
     * Initializes logic of extension popup.
     * @param {object} settings - Data received from chrome storage.
     */
    function initPopup(settings) {
        var newSettings = $.extend({}, defaultSettings, settings);
        updateStorage(newSettings);

        $(document).ready(function() {
            updateView(newSettings);
            $('.settings-save').click(saveChanges);
            $('.settings-reset').click(resetChanges);
            representationBlock();
        });
    }

    /**
     * Updates chrome storage.
     * @param {object} settings - Can include up to 512 properties.
     */
    function updateStorage(settings) {
        chrome.storage.sync.set(settings);
    }

    /**
     * Removes all data saved in chrome storage.
     */
    function clearStorage() {
        chrome.storage.sync.get(null, function(settings) {
            $.each(settings, function(k) { chrome.storage.sync.remove(k); })
        });
    }

    /**
     * Prints to console whenever storage values change.
     */
    function listenToChanges() {
        chrome.storage.onChanged.addListener(function(changes) {
            for (var key in changes) {
                var storageChange = changes[key];
                console.log('%s: %s => %s', key, storageChange.oldValue, storageChange.newValue);
            }
        });
    }

    /**
     * Show notification in popup.
     * @param {string} message
     * @param {string} color - CSS property color, green by default.
     */
    function notify(message, color) {
        var $notification;
        $notification = $('.notification');
        $notification.css({color: color || '#00C665'}).text(message).fadeIn(80);
        $('button').on('blur', function() { $notification.fadeOut(100); });
    }

    /**
     * Saves settings from the popup to chrome storage.
     */
    function saveChanges() {
        var $element;
        var settings = {};

        $.each(defaultSettings, function(key, value) {
            $element = $('#settings-' + key);
            if ($element.length) {
                settings[key] = typeof value === 'boolean'
                    ? $element.prop('checked')
                    : $element.val()
            } else {
                settings[key] = value;
            }
        });

        updateStorage(settings);
        updateView(settings);
        notify("Settings saved!");
    }

    /**
     * Reset settings to default.
     */
    function resetChanges() {
        updateStorage(defaultSettings);
        updateView(defaultSettings);
        notify("Settings reset to default", 'orange');
    }

    /**
     * Synchronizes view of the popup with the current state of settings in chrome storage.
     * @param {object} settings - Stored settings.
     */
    function updateView(settings) {
        var $element;
        $.each(settings, function(key, value) {
            $element = $('#settings-' + key);
            if ($element.length) {
                typeof value === 'boolean'
                    ? $element.prop('checked', value)
                    : $element.val(value)
            }
        });
    }

    /**
     * Adjusts height of the extension popup.
     */
    function adjustPopupHeight() {
        var popupHeight = $('.wrapper').height();
        $('html').height(popupHeight);
        $('body').height(popupHeight);
    }

    /**
     * Improves user experience.
     */
    function representationBlock() {
        adjustPopupHeight();
        $('input[type=checkbox], .settings-reset').click(adjustPopupHeight);
    }
})(window.$);