$(document).ready(function () {
  console.log("ready");

  // Event listener for the grammar check button click
  $('#grammarCheckClick').on('click', function (event) {
    try {
      // Clear the error-list div
      $('#error-list').empty();

      var inputLatexCode = document.getElementById('editor-text').value
      var latexInputData = { "latex_code": inputLatexCode };
      console.log("Sending LaTeX data for Grammar check:", latexInputData);

      $.ajax({
        data: JSON.stringify(latexInputData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        type: 'POST',
        url: getApiUrl('check-grammar'),
        success: function (data) {
          console.log("Grammar Check Success!!", data);

          if (data.length > 0) {
            data.forEach(function (result) {
              var errorItem = $('<div class="error-item"></div>');
              var errorDescription = $('<div class="error-description"></div>');
              var errorWord = $('<p class="error-word"></p>').text(result.result['incorrect-word']);
              var replacements = result.result.replacements;

              errorDescription.append(errorWord);

              if (replacements.length > 0) {
                var replacementsList = $('<ul class="replacements-list"></ul>');

                replacements.forEach(function (replacement) {
                  var replacementItem = $('<li class="replacement-item"></li>');
                  var replacementLink = $('<a href="#" class="replacement-link"></a>').text(replacement.value);

                  replacementLink.on('click', function (e) {
                    e.preventDefault();
                    console.log('Start replacement....');
                    console.log({editorText: document.getElementById('editor-text').value});
                    // Replace the incorrect word with the selected replacement
                    var newText = document.getElementById('editor-text').value.replace(result.result['incorrect-word'], replacement.value);
                    console.log({newText});
                    // Update the editor or perform any desired action with the modified text
                    document.getElementById('editor-text').value = newText;
                    documentObject.DocText = newText;
                    console.log({updatedEditorText: document.getElementById('editor-text').value});
                    console.log(documentObject.DocText);
                    // documentObject.DocText = document.getElementById('editor-text').value
                    // console.log(documentObject.DocText);
                    console.log('Save updated document....');
                    saveFile();
                    location.reload();
                  });

                  replacementItem.append(replacementLink);
                  replacementsList.append(replacementItem);
                });

                errorDescription.append(replacementsList);
              }

              errorItem.append(errorDescription);
              $('#error-list').append(errorItem);

              // Event listener for mouseenter event to highlight the error word
              errorDescription.on('mouseenter', function () {
                highlightWord(result.result['incorrect-word']);
              });

              // Event listener for mouseleave event to clear the highlight
              errorDescription.on('mouseleave', function () {
                clearHighlights();
              });
            });
          } else {
            console.log('No errors found!');
            var noErrorsFound = $('<p class="no-errors-found"></p>').text('No Errors Found!');
            $('#error-list').append(noErrorsFound);
          }
        },
        error: function (data) {
          console.log("Grammar Check Failed!!", data);
          // Handle the error case
        }
      });
    } catch (e) {
      console.log(e);
    }
  });

  // Rest of the code
  // ...
});


// Function to highlight a specific word in the editor
function highlightWord(word) {
  var editorText = document.getElementById('editor-text');
  var editorContent = editorText.value;
  var highlightedContent = editorContent.replace(new RegExp(word, 'g'), '<span class="highlight">' + word + '</span>');
  editorText.innerHTML = highlightedContent;
}

// Function to clear the highlights in the editor
function clearHighlights() {
  var editorText = document.getElementById('editor-text');
  editorText.innerHTML = editorText.value;
}
