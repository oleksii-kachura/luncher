/**
 * popup.js
 * Logic of extension popup.
 *
 * @author Alex Kachura alex.kachura@maxymiser.com
 * @date 14 May 2015
 */

;
(function() {
    var $, defaultSettings;

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
        filterActionLog:      false,
        actionLogFiltersList: ['DATE', 'CAMPAIGN', 'ACTIONS', 'BROWSER']
    };

    /**
     * Updates chrome storage.
     * @param {object} settings - Can be up to 512 properties.
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

        // representation
        $notification.fadeIn(100);
        $('.settings-save').on('blur', function() { $notification.fadeOut(); });
    }

    function resetChanges() {
        updateStorage(defaultSettings);
        updateView(defaultSettings);
    }

    function adjustPopupHeight() {
        var popupHeight = $('.wrapper').height();
        $('html').height(popupHeight);
        $('body').height(popupHeight);
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

    /* Run */
    // retrieve settings from chrome storage and show it to user
    chrome.storage.sync.get(null, function(settings) { $(document).ready(function() {
        if ($.isEmptyObject(settings)) {
            updateStorage(defaultSettings);
            settings = defaultSettings;
        }
        updateView(settings);

        $('.settings-save').click(saveChanges);
        $('.settings-reset').click(resetChanges);

        //representation
        adjustPopupHeight();
        $('input[type=checkbox], .settings-reset').click(adjustPopupHeight);
        $('input[type=password]')
            .mouseover(function() { !this.value && (this.type = "text"); })
            .mouseout(function() { this.type = "password"; });
    }); });
})();