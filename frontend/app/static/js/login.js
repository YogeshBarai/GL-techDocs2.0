
$(document).ready(function() {
    $('#email-login').on('submit', function(event) {
        loginButtonClicked();
        event.preventDefault();
     
     });
});


function saveTokenInSession(AUT, username)
{
    $.ajax({
        data:{
            authToken:AUT,
            loggedInUserName: username
        },
        type:'POST',
        url:getFrontEndUrl('saveUserToken'),
        success:function(data)
        {
            window.location.replace('/dashboard');
        }
    }

    );
}

function loginButtonClicked()
{
    loginFormData = {
        loginType : "email",
        email : $('#email-input').val(),
        password: $('#password-input').val(),
        rememberMe : $('#remember-me').prop("checked")?1:0
            };
    callLoginApi(loginFormData,"#email-login-errorMessage");
}

function callLoginApi(loginFormData,errordiv)
{
    removeAlert(errordiv);
    try{
    $.ajax({
        data : loginFormData,
           type : 'POST',
           url : getApiUrl('signin'),
           success: function(data) {
                //In case of success the data contains the JSON

                var username = data.FirstName + " " + data.LastName;
                localStorage.setItem('userToken', data.userAuthToken);
                //Saving email for further references for calling backend url.
                localStorage.setItem('email', $('#email-input').val());
                localStorage.setItem('loggedInUserName', username);
                saveTokenInSession(data.userAuthToken, username);
          },
          error:function(data) {
            // in case of error we need to read response from data.responseJSON
            showAlert(errordiv, 'alert-danger', "Login!!", getResponseMessage(data));

            
          }
        }
          );
    }
    catch(e)
    {
        console.log(e)
    }
}
var googleLoginButtonOptions=
{ theme: 'filled_blue', 
size: 'large',
width:380};

function handleGoogleAuthResponse(token) {
    var response = parseJwt(token.credential);
    console.log(response); 
    loginFormData = {
        loginType : "google",
        email : response.email,
        password: "authenticated",
        rememberMe : 0
            };
    callLoginApi(loginFormData,"#google-login-errorMessage");
    
  }

  window.onload = function () {
    google.accounts.id.initialize({
      client_id: getClientId(),
      callback: handleGoogleAuthResponse,
      prompt_parent_id:"googleLogin"
    });
   
    google.accounts.id.renderButton($('#googleLogin')[0],googleLoginButtonOptions);
    
  };