// Reload regexes from raw textbox.
function reloadRegexes(raw) {
  var regexes = raw.split('\n');
  for (var i = 0; i < regexes.length; ++i) {
    regexes[i] = new RegExp('^' + regexes[i] + '$');
  }
  return regexes;
}

// Global variables, these will be loaded at first startup of the
// service worker.
let allowlist;
let denylist;
let starting = chrome.storage.sync.get().then(data => {
  console.log(data);
  denylist = reloadRegexes(data.denylist);
  allowlist = reloadRegexes(data.allowlist);
  console.log('Initial denylist: ', denylist);
  console.log('Initial allowlist: ', allowlist);
  starting = null;
});

// Listen for updates to the global variables.
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
chrome.tabs.onUpdated.addListener(async function(tabId, change, tab) {
  if (change.status == 'loading' && typeof change.url != 'undefined') {
    // Wait for allow/deny lists, if we're starting up.
    if (starting) await starting;

    if (isBlocked(change.url)) {
      chrome.tabs.update(tabId, {url: 'blocked.html'});
    }
  }
});
