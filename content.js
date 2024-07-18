console.log("content.js");

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'as') {
      console.log("content.js received message");
      sendResponse({content: document.body.innerText});
  }
});

// Notify that content.js has loaded
chrome.runtime.sendMessage({action: 'contentLoaded'});