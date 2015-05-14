$(document).ready(function() {
    if (/Auth.Login/.test(location.pathname)) {
        $('#Login').val('');
        $('#Password').val('');
        $('#Login[type=submit]').click();
    }
    if (/CampaignBuilder.*DomainLocations.Add/.test(location.pathname)) {
        $('#IsOverlay').click();
    }
    if (/Admin.*ActionLog/.test(location.pathname)) {
        setTimeout(function() {
            $('#VISITOR').click();
            $('#IP').click();
            $('#COUNTRY').click();
            $('#CAMPAIGN').click();
            $('#bApply').click()
        }, 500);
    }
});