window.onload = function() {
    console.log("Page fully loaded");
    var input = document.getElementById('questionInput');
    if (input) {
      console.log("Input element found");
      input.focus();
    } else {
      console.log("Input element not found");
    }
  };