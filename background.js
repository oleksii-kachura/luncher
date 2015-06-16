/**
 * Shows extension icon in the address bar for browser tabs with Maxymiser UI.
 * @param tabId - ID of the current tab.
 * @param changeInfo
 * @param tab - Current tab.
 */
function checkForValidUrl(tabId, changeInfo, tab) {
    if (/(ui61.*|demo).maxymiser.(com|org)/.test(tab.url)) {
        chrome.pageAction.show(tabId);
    }
}
chrome.tabs.onUpdated.addListener(checkForValidUrl);