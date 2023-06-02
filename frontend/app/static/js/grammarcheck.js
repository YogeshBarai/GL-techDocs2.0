$(document).ready(function () {
  console.log("ready");

  // Event listener for the grammar check button click
  $('#grammarCheckClick').on('click', function (event) {
    try {
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

          // Clear the error list initially
          $('#error-list').html('');

          // Build the HTML for each grammar check result
          data.forEach(function (result) {
            var errorItem = $('<div class="error-item"></div>');
            var errorDescription = $('<div class="error-description"></div>');
            var errorWord = $('<p></p>').text(result.result['incorrect-word']);
            var replacements = result.result.replacements;

            errorDescription.append(errorWord);

            if (replacements.length > 0) {
              var replacementsList = $('<ul></ul>');

              replacements.forEach(function (replacement) {
                var replacementItem = $('<li></li>');
                var replacementLink = $('<a href="#" class="replacement-link"></a>').text(replacement.value);

                replacementLink.on('click', function (e) {
                  e.preventDefault();
                  // Replace the incorrect word with the selected replacement
                  var newText = result.originalText.replace(result.result['incorrect-word'], replacement.value);
                  // Update the editor or perform any desired action with the modified text
                  document.getElementById('editor-text').value = newText;
                });

                replacementItem.append(replacementLink);
                replacementsList.append(replacementItem);
              });

              errorDescription.append(replacementsList);
            }

            var changeButton = $('<button class="btn btn-outline-secondary btn-sm">Change</button>');
            changeButton.on('click', function () {
              // Replace the incorrect word with the first replacement
              var newText = inputLatexCode.replace(result.result['incorrect-word'], replacements[0].value);
              // Update the editor or perform any desired action with the modified text
              document.getElementById('editor-text').value = newText;
            });

            errorItem.append(errorDescription);
            errorItem.append(changeButton);
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
