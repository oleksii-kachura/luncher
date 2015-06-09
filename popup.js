/**
 * popup.js
 * Logic of extension popup.
 *
 * @author Alex Kachura alex.kachura@maxymiser.com
 * @date 14 May 2015
 */

;
(function() {
    var $ = window.$;

    /**
     * Removes all data saved in chrome storage.
     */
    function clearStorage() {
        chrome.storage.local.get(null, function(settings) {
            $.each(settings, function(k) { chrome.storage.local.remove(k); })
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
        var $notification    = $('.settings-notification'),
            $numberOfItems   = $('#settings-numberOfItems'),
            autoLogin        = $('#settings-autoLogin').prop('checked'),
            login            = $('#settings-login').val(),
            password         = $('#settings-password').val(),
            addDescription   = $('#settings-addDescription').prop('checked'),
            addNamePrefix    = $('#settings-addNamePrefix').prop('checked'),
            improveCM        = $('#settings-improveCM').prop('checked'),
            moreItems        = $('#settings-moreItems').prop('checked'),
            numberOfItems    = $numberOfItems.val(),
            filterActionLog  = $('#settings-filterActionLog').prop('checked'),
            actionLogFilters = [];

        // validation
        if (numberOfItems <= 20 || numberOfItems > 500) {
            numberOfItems = 50;
            $numberOfItems.val(numberOfItems);
        }
        if (filterActionLog) {
            $.each($('#settings-actionLogFiltersList').find('input'), function(i, checkbox) {
                $(checkbox).prop('checked') && actionLogFilters.push($(checkbox).attr('id'));
            });
        } else {
            // set default values
            actionLogFilters = ['DATE', 'CAMPAIGN', 'ACTIONS', 'BROWSER'];
        }

        // save settings to chrome storage
        chrome.storage.local.set({
            login:            login,
            password:         password,
            autoLogin:        autoLogin,
            addDescription:   addDescription,
            addNamePrefix:    addNamePrefix,
            improveCM:        improveCM,
            moreItems:        moreItems,
            numberOfItems:    numberOfItems,
            filterActionLog:  filterActionLog,
            actionLogFilters: actionLogFilters
        });

        // representation
        $notification.fadeIn(100);
        $('.settings-save').on('blur', function() { $notification.fadeOut(); });
    }

    /**
     * Synchronizes view of the popup with the current state of settings in chrome storage.
     */
    function syncView(settings) {
        $('#settings-autoLogin').prop('checked', settings.autoLogin);
        $("#settings-login").val(settings.login);
        $("#settings-password").val(settings.password);
        $('#settings-moreItems').prop('checked', settings.moreItems);
        $('#settings-numberOfItems').val(settings.numberOfItems || 50);
        $('#settings-addDescription').prop('checked', settings.addDescription);
        $('#settings-addNamePrefix').prop('checked', settings.addNamePrefix);
        $('#settings-improveCM').prop('checked', settings.improveCM);
        $('#settings-filterActionLog').prop('checked', settings.filterActionLog);
        $.each(settings.actionLogFilters, function(i, id) { $($('#' + id).prop('checked', true)); });
    }

    // retrieve settings from chrome storage and show it to user
    chrome.storage.local.get(null, function(settings) {
        console.log(settings);
        $(document).ready(function() {
            !$.isEmptyObject(settings) && syncView(settings);
            $('.settings-save').click(saveChanges);
        });
    });

    //listenToChanges();
    //clearStorage();
})();