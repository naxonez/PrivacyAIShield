document.addEventListener('DOMContentLoaded', function() {
  const toggleButton = document.getElementById('toggle');
  const statusDiv = document.getElementById('status');
  
  chrome.storage.local.get(['blockingEnabled'], function(result) {
    const isEnabled = result.blockingEnabled !== false;
    updateUI(isEnabled);
  });
  
  toggleButton.addEventListener('click', function() {
    chrome.storage.local.get(['blockingEnabled'], function(result) {
      const currentState = result.blockingEnabled !== false;
      const newState = !currentState;
      
      chrome.storage.local.set({blockingEnabled: newState}, function() {
        updateUI(newState);
        
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, {
              action: "toggleBlocking",
              enabled: newState
            });
          }
        });
      });
    });
  });
  
  function updateUI(isEnabled) {
    if (isEnabled) {
      statusDiv.textContent = 'Protección ACTIVADA';
      statusDiv.className = 'status enabled';
      toggleButton.textContent = 'Desactivar Protección';
      toggleButton.className = 'disable-btn';
    } else {
      statusDiv.textContent = 'Protección DESACTIVADA';
      statusDiv.className = 'status disabled';
      toggleButton.textContent = 'Activar Protección';
      toggleButton.className = 'enable-btn';
    }
  }
});
