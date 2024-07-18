chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  var currentTab = tabs[0];
  
  if (currentTab.url.includes('://newtab/')) {
    var questionInput = document.getElementById('questionInput');
    questionInput.disabled = true;
    questionInput.placeholder = "Open a tab to ask a question";
  } else {
    chrome.storage.local.get([`lastQuestion_${currentTab.id}`, `lastAnswer_${currentTab.id}`], function(result) {
      if (result[`lastQuestion_${currentTab.id}`] || result[`lastAnswer_${currentTab.id}`]) {
        document.getElementById('questionInput').value = result[`lastQuestion_${currentTab.id}`] || '';
        document.getElementById('answer').innerText = result[`lastAnswer_${currentTab.id}`] || '';
      } else {
        document.getElementById('questionInput').value = '';
        document.getElementById('answer').innerText = '...';
      }
      chrome.storage.local.set({lastTabId: currentTab.id});
    });
  }
});

document.getElementById('questionInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    var question = document.getElementById('questionInput').value;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'as'}, function(response) {
        if (response && response.content) {
          console.log(response.content);
          chrome.runtime.sendMessage({question: question, content: response.content}, function(response) {
            var answer = response.answer || "Please set your OpenAI API Key in settings.";
            document.getElementById('answer').innerText = answer;
            chrome.storage.local.set({
              [`lastQuestion_${tabs[0].id}`]: question,
              [`lastAnswer_${tabs[0].id}`]: answer
            });
          });
        } else {
          document.getElementById('answer').innerText = "This website doesn't provide access to its content.";
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

document.addEventListener('DOMContentLoaded', function() {
  var settingsButton = document.getElementById('settingsButton');
  var settingsModal = document.getElementById('settingsModal');

  settingsButton.addEventListener('click', function(event) {
    event.preventDefault();
    settingsModal.style.display = 'block';
  });

  window.addEventListener('click', function(event) {
    if (event.target == settingsModal) {
      settingsModal.style.display = 'none';
    }
  });
});