console.log("content.js");

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'as') {
        console.log("content.js");
      sendResponse({content: document.body.innerText});
    }
  });
