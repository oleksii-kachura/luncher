/**
 * Shows extension icon in the address bar while browsing Maxymiser UI site
 * @param tabId
 * @param changeInfo
 * @param tab
 */
function checkForValidUrl(tabId, changeInfo, tab) {
    if (tab.url.indexOf('ui61.maxymiser.com') + 1) {
        chrome.pageAction.show(tabId);
    }
}
chrome.tabs.onUpdated.addListener(checkForValidUrl);