// Global variables.
var denylist = [];
var allowlist = [];

// Reload regexes from raw textbox.
function reloadRegexes(raw) {
  var regexes = raw.split('\n');
  for (var i = 0; i < regexes.length; ++i) {
    regexes[i] = new RegExp('^' + regexes[i] + '$');
  }
  return regexes;
}

function isBlocked(url) {
  for (var i = 0; i < allowlist.length; ++i) {
    if (url.match(allowlist[i])) {
      console.log('isBlocked', url, 'matches allowlist', allowlist[i])
      return false;
    }
  }
  for (var i = 0; i < denylist.length; ++i) {
    if (url.match(denylist[i])) {
      console.log('isBlocked', url, 'matches denylist', denylist[i])
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
  if ('denylist' in changes) {
    console.log('denylist changed:', changes['denylist']);
    denylist = reloadRegexes(changes['denylist'].newValue);
  }
  if ('allowlist' in changes) {
    console.log('allowlist changed:', changes['allowlist']);
    allowlist = reloadRegexes(changes['allowlist'].newValue);
  }
});

// Setup first set of regexes.
chrome.storage.sync.get(
  {denylist: '', allowlist: ''}, function(items) {
    reloadRegexes(items.denylist, denylist);
    reloadRegexes(items.allowlist, allowlist);
  });

