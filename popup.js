/**
 * popup.js
 * Logic of extension popup.
 *
 * @author Alex Kachura alex.kachura@maxymiser.com
 * @date 14 May 2015
 */

;
(function() {
    var $, defaultSettings, newSettings;

    $               = window.$;
    defaultSettings = {
        autoLogin:            false,
        sameForAll:           false,
        login:                '@maxymiser.com',
        password:             '',
        loginUS:              '@maxymiser.com',
        passwordUS:           '',
        loginDemo:            '@maxymiser.com',
        passwordDemo:         '',
        moreItems:            true,
        numberOfItems:        50,
        addDescription:       true,
        addNamePrefix:        true,
        improveCM:            true,
        omitActionDetails:    true,
        addScriptIfNo:        true,
        reorderCmpSidebar:    false,
        filterActionLog:      false,
        actionLogFiltersList: ['DATE', 'CAMPAIGN', 'ACTIONS', 'BROWSER']
    };

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
            for (key in changes) {
                var storageChange = changes[key];
                console.log('%s: %s => %s', key, storageChange.oldValue, storageChange.newValue);
            }
        });
    }

    /**
     * Show notification in popup.
     * @param {string} message
     */
    function notify(message) {
        var $notification;
        $notification = $('.notification');
        $notification.text(message).fadeIn(80);
        $('button').on('blur', function() { $notification.fadeOut(100); });
    }

    /**
     * Saves settings from the popup to chrome storage.
     */
    function saveChanges() {
        var $element, $notification, settings;

        $notification = $('.notification');
        settings      = {};

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

        // validation
        if (settings.numberOfItems <= 20 || settings.numberOfItems > 300) {
            settings.numberOfItems = 50;
        }
        if (settings.filterActionLog) {
            settings.actionLogFiltersList = [];
            $.each($('#settings-actionLogFiltersList').find('input'), function(i, checkbox) {
                $(checkbox).prop('checked') && settings.actionLogFiltersList.push($(checkbox).attr('id'));
            });
        }

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
        notify("Settings reset to default");
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
        $.each(settings.actionLogFiltersList, function(k, id) {
            $('#' + id).prop('checked', true);
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
        $('input[type=password]')
            .mouseover(function() { !this.value && (this.type = "text"); })
            .mouseout(function() { this.type = "password"; });
    }

    /**
     * Initializes logic of extension popup.
     * @param {object} settings - Data received from chrome storage.
     */
    function initPopup(settings) {
        newSettings = $.extend({}, defaultSettings, settings);
        updateStorage(newSettings);

        $(document).ready(function() {
            updateView(newSettings);
            $('.settings-save').click(saveChanges);
            $('.settings-reset').click(resetChanges);
            representationBlock();
        });
    }

    /* Run *******************************************************/

    // retrieve settings from chrome storage and launch popup logic
    chrome.storage.sync.get(null, initPopup);
})();