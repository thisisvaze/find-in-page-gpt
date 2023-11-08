chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  chrome.storage.sync.get(['apiKey'], function(result) {
    if (result.apiKey) {

      console.log(request.content)
    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer '+ result.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-4-1106-preview",
        messages: [
          {
            "role": "user",
            "content": request.content + " answer this question based on this information in less than 50 words. " + request.question
          }
        ],
        temperature: 0.7
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      sendResponse({answer: data['choices'][0]['message']['content']});
      return true;
    })
    .catch(error => {
      console.error('Error:', error);
      sendResponse({error: error.toString()});
      return false;
    });
      // existing fetch request
    } else {
      sendResponse({error: 'API Key is invalid. Please set your OpenAI API Key'});
      return false;
    }
  });
  
  
    return true;  // Will respond asynchronously.
  });

