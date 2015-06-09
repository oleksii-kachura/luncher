/**
 * Shows extension icon in the address bar while browsing Maxymiser UI site
 * @param tabId
 * @param changeInfo
 * @param tab
 */
function checkForValidUrl(tabId, changeInfo, tab) {
    if (/(ui61.*.maxymiser.com)|(demo.maxymiser.org)/.test(tab.url)) {
        chrome.pageAction.show(tabId);
    }
}
chrome.tabs.onUpdated.addListener(checkForValidUrl);