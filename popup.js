  document.getElementById('questionInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        // Trigger the form submission
        var question = document.getElementById('questionInput').value;
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {action: 'as'}, function(response) {
            
            if (response && response.content) {
                console.log(response.content);
              chrome.runtime.sendMessage({question: question, content: response.content}, function(response) {
                document.getElementById('answer').innerText = response.answer;
              });
            } else {
              document.getElementById('answer').innerText= "Set you OpenAI API Key"
              console.error('No response from content script');
            }
          });
        });
        
    }

    
    
});

document.getElementById('settingsButton').addEventListener('click', function() {
  document.getElementById('settingsModal').style.display = "block";
});

document.getElementById('settingsForm').addEventListener('submit', function(e) {
  e.preventDefault();
  var apiKey = document.getElementById('apiKey').value;
  chrome.storage.sync.set({apiKey: apiKey}, function() {
    //console.log('API Key is set to ' + apiKey);
  });
  document.getElementById('settingsModal').style.display = "none"; // Add this line
});
chrome.storage.sync.get(['apiKey'], function(result) {
  //console.log('API Key is ' + result.apiKey);
  document.getElementById('apiKey').value = result.apiKey;
});