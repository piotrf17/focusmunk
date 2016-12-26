// Saves options to chrome.storage.sync.
function save_options() {
  var regexes = document.getElementById('regexes').value;
  console.log(regexes);
  chrome.storage.sync.set({
    regexes: regexes,
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
    regexes: '',
  }, function(items) {
    document.getElementById('regexes').value = items.regexes;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
