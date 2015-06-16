/**
 * Shows extension icon in the address bar.
 * @param tabId - ID of the current tab.
 */
function showExtensionIcon(tabId) {
    chrome.pageAction.show(tabId);
}
chrome.tabs.onUpdated.addListener(showExtensionIcon);