// Saves options to chrome.storage.sync.
function save_options() {
  var denylist = document.getElementById('denylist').value;
  var allowlist = document.getElementById('allowlist').value;
  chrome.storage.sync.set({
    denylist: denylist,
    allowlist: allowlist,
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 1500);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    denylist: '',
    allowlist: '',
  }, function(items) {
    document.getElementById('denylist').value = items.denylist;
    document.getElementById('allowlist').value = items.allowlist;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
