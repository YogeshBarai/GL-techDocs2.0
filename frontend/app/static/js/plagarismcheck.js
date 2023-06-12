function plagarismcheck(chart){
    try {  
        var inputLatexCode = document.getElementById('editor-text').value
        var latexInputData = { "latex_code": inputLatexCode };
        console.log("Sending LaTeX data for plagiarism check:", latexInputData);
  
        $.ajax({
          data: JSON.stringify(latexInputData),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          type: 'POST',
          url: getApiUrl('check-plagiarism'),
          success: function (data) {
            console.log("Plagarism Check Success!!", data);
            const ctx2 = document.getElementById('plagarism-value');
            value = data.score*100;
            value = value.toFixed(2);
            ctx2.innerHTML=value;
            chart.data.datasets[0].data[0]=value;
            chart.data.datasets[0].data[1]=100-value;
            chart.update();
          },
          error: function (data) {
            console.log("plagarism Check Failed!!", data);
            const ctx2 = document.getElementById('plagarism-value');
            value = 0;
            ctx2.innerHTML=value;
            chart.data.datasets[0].data[0]=value;
            chart.data.datasets[0].data[1]=100-value;
            chart.update();
          }
        });
      } catch (e) {
        console.log(e);
      }
      
}
