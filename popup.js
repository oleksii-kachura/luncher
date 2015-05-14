chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (key in changes) {
        var storageChange = changes[key];
        console.log('Storage key "%s" in namespace "%s" changed.\n' +
            'Old value was "%s", new value is "%s".',
            key, namespace, storageChange.oldValue, storageChange.newValue);
    }
});

function saveChanges() {
    var login = $('#settings-login').val(),
        password = $('#settings-password').val(),
        autologin = $('#settings-autologin').prop('checked');
    chrome.storage.local.set({
        login: login,
        password: password,
        autologin: autologin
    });
}

$(document).ready(function() {
    chrome.storage.local.get('autologin', function (result) {
        if (result.autologin) {
            $('#settings-autologin').prop('checked', true);
        }

        chrome.storage.local.get('login', function (result) {
            $("#settings-login").val(result.login);
        });
        chrome.storage.local.get('password', function (result) {
            $("#settings-password").val(result.password);
        });
    });

    $('#settings-save').click(saveChanges);
});