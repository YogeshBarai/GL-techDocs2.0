
$(document).ready(function () {
  console.log("ready")
  $('#grammarCheckClick').on('click', function (event) {
    try {
      var historyInpData = { "Email": localStorage.getItem('email'), "PageNumber": 0 };
      console.log("Getting history for :", historyInpData)
      $.ajax({
        data: JSON.stringify(historyInpData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        type: 'POST',
        url: getApiUrl('historyGet'),
        success: function (data) {
          //In case of success the data contains the JSON
          console.log("History data !!", data)
          // $('#error-list').html('Loading ....');
          //let jsonHistory = {"items": [{"datetime":"60 mins ago", "desc": "John edited an item.", "operation":"Filename.ext"},{"datetime":"20 mins ago", "desc": "Johnny edited an item.", "operation":"SomeFilename.ext"},{"datetime":"10 mins ago", "desc": "Mary edited an item.", "operation":"OldFilename.ext"}]}
          let history = '';
          $.each(data.items, function (key, value) {
            history += '<div class="card"><div class="card-body"><table class="table table-hover"><thead><tr><th>' + value.time + '</th></tr></thead><tbody>';
            history += '<tr><td>' + value.action + ' file <b>' + value.doc_name + '</b></td></tr></tbody></table></div></div><br/>';
          });

          // $('#error-list').html(history);
        },
        error: function (data) {
          // in case of error we need to read response from data.responseJSON

          console.log("History error data !!", data)
          // $('#error-list').html(data);

        }
      });
    } catch (e) {
      console.log(e)
    }
  });
});