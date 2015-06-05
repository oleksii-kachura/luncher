/**
 * Saves settings from the popup to chrome storage
 */
function saveChanges() {
    var $notification    = $('#settings-notification'),
        $numberOfItems   = $('#settings-numberOfItems'),
        autoLogin        = $('#settings-autoLogin').prop('checked'),
        login            = $('#settings-login').val(),
        password         = $('#settings-password').val(),
        actionLogFilters = $('#settings-actionLogFilters').prop('checked'),
        addDescription   = $('#settings-addDescription').prop('checked'),
        moreItems        = $('#settings-moreItems').prop('checked'),
        numberOfItems    = $numberOfItems.val();

    // validation
    if (numberOfItems <= 20 || numberOfItems > 500) {
        numberOfItems = 50;
        $numberOfItems.val(numberOfItems);
    }

    // save settings to chrome storage
    chrome.storage.local.set({
        login:            login,
        password:         password,
        autoLogin:        autoLogin,
        moreItems:        moreItems,
        numberOfItems:    numberOfItems,
        addDescription:   addDescription,
        actionLogFilters: actionLogFilters
    });

    // representation
    $notification.fadeIn(100);
    $('#settings-save').on('blur', function() { $notification.fadeOut(); });
}

// retrieve settings from chrome storage and set current state to the view of the popup
chrome.storage.local.get([
    'autoLogin', 'login', 'password', 'moreItems', 'numberOfItems', 'actionLogFilters', 'addDescription'
], function(settings) {
    $(document).ready(function() {
        $('#settings-autoLogin').prop('checked', !!settings.autoLogin);
        $("#settings-login").val(settings.login || '');
        $("#settings-password").val(settings.password || '');
        $('#settings-moreItems').prop('checked', !!settings.moreItems);
        $('#settings-numberOfItems').val(settings.numberOfItems || 50);
        $('#settings-addDescription').prop('checked', !!settings.addDescription);
        $('#settings-actionLogFilters').prop('checked', !!settings.actionLogFilters);

        $('#settings-save').click(saveChanges);
    });
});

// print to console whenever storage values change
chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (key in changes) {
        var storageChange = changes[key];
        console.log('Storage key "%s" in namespace "%s" changed.\n' +
            'Old value was "%s", new value is "%s".',
            key, namespace, storageChange.oldValue, storageChange.newValue);
    }
});