from flask import render_template, request, url_for,session 
from flask import make_response, redirect
from app import app
from cryptography.fernet import Fernet



'''Login Authorization Wrapper'''
#def login_required(function): 
#    def wrapper(*args, **kwargs):
#        return function(*args, **kwargs) if session.get('user') else abort(401)
#    return wrapper

key = Fernet.generate_key()

def encrypt_username(username):
    f = Fernet(key)

    # Encrypt the username
    encrypted_username = f.encrypt(username.encode('utf-8'))

    # Return the encrypted username as a string
    return encrypted_username.decode('utf-8')

def decrypt_username(encrypted_username):
    f = Fernet(key)

    # Decrypt the encrypted username
    decrypted_username = f.decrypt(encrypted_username.encode('utf-8'))

    # Return the decrypted username as a string
    return decrypted_username.decode('utf-8')



@app.context_processor
def inject_user():
    isAuthenticated = False
    username = None
    # Check if the user is authenticated based on session
    if 'username' in session:
        isAuthenticated = True
        username = decrypt_username(session.get('username'))
    return dict(isAuthenticated=isAuthenticated, username=username)

def login_required(f):
    
   def wrap(*args, **kwargs):
      if  session.get('user') :
         return f(*args, **kwargs)
      else:
         return redirect(url_for('login'))
   wrap.__name__ = f.__name__
   return wrap

@app.route('/')
def home():
   return render_template('home-page/home.html')



@app.route('/register')
def register():
   return '<h1>Redirected to Register Page</h1>'



@app.route('/login', methods=['GET', 'POST'])
def login():
   if request.method != 'POST':
      return render_template('login/login.html') 



@app.route('/forgotpassword')
def forgot_password():
   return render_template('forgotpassword/forgotpassword.html')

@app.route('/password_reset')
def reset_password():
   return render_template('forgotpassword/resetpassword.html')

@app.route('/logout')
def logout():
   # session.clear()
   [session.pop(key) for key in list(session.keys())]
   return redirect('/')


@app.route('/dashboard')
@login_required
def dashboard():
   return render_template('user-dashboard/dashboard.html')

@app.route('/registration')
def registration():
   return render_template('user-registration/registration.html')

@app.route('/doregistration', methods=['GET', 'POST'])
def doregistration():
   if request.method != 'POST':
       return render_template('user-registration/registration.html')

   if request.form['register'] == 'google':
      print(request.form['register'])
   else:
      print(request.form['register'])

   return render_template('user-registration/registration.html')


@app.route('/latex-editor/<id>', methods=['GET'])
# @login_required
def latexEditor(id=0):
   args = request.args
   return render_template('latex-editor/editor.html',doc_id=id,params=args)

@app.route('/plans')
def plans():
   return render_template('plans-and-subscriptions/pricing.html')

@app.route('/profile')
@login_required
def profile():
   return render_template('profile/profile.html')

@app.route('/saveUserToken',methods=['POST'])
def saveToken():
   session['user'] = request.form['authToken']
   session['username'] = encrypt_username(request.form['username'])
   return  make_response({'status':True}, 200)

@app.route('/clearSession',methods=['POST'])
@login_required
def clearSession():
   [session.pop(key) for key in list(session.keys())]
   return  make_response({'status':True}, 200)

@app.route('/features/premium-features')
def premium_features():
   return render_template('Features/premium-features.html')

@app.route('/features/forgroups')
def group():
   return render_template('Features/forgroups.html')

@app.route('/features/forpublisher')
def publisher():
   return render_template('Features/forpublisher.html')

@app.route('/features/forteaching')
def teaching():
   return render_template('Features/forteaching.html')

@app.route('/features/foruniversity')
def university():
   return render_template('Features/foruniversity.html')

@app.route('/features/forwriting')
def writing():
   return render_template('Features/forwriting.html')

@app.route('/faq')
def faq():
   return render_template('faq/faq.html')

@app.route('/payments/summary')
def payments_summary():
   return render_template('payments/summary.html')

@app.route('/user_plans')
def user_plans():
   return render_template('plans-and-subscriptions/user-plan.html')

@app.route('/history')
# @login_required
def latexHistory():
   return render_template('latex-history/history.html')
