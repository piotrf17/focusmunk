// Global variables.
var regexes = [];

// Reload regexes from raw textbox.
function reloadRegexes(raw) {
  regexes = raw.split('\n');
  for (var i = 0; i < regexes.length; ++i) {
    regexes[i] = new RegExp('^' + regexes[i] + '$');
  }
}

function isBlocked(url) {
  for (var i = 0; i < regexes.length; ++i) {
    if (url.match(regexes[i])) {
      return true;
    }
  }
  return false;
}

// Listen for page loading updates.
chrome.tabs.onUpdated.addListener(function(tabId, change, tab) {
  if (change.status == 'loading' && typeof change.url != 'undefined') {
    if (isBlocked(change.url)) {
      chrome.tabs.update(tabId, {url: chrome.extension.getURL('blocked.html')});
    }
  }
});

// Listen for updates to the regex list.
chrome.storage.onChanged.addListener(function(changes, namespace) {
  if ('regexes' in changes) {
    console.log('regexes changed:', changes['regexes']);
    reloadRegexes(changes['regexes'].newValue);
  }
});

// Setup first set of regexes.
chrome.storage.sync.get(
  {regexes: ''}, function(items) { reloadRegexes(items.regexes); });

