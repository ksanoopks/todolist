import React from 'react';
import '../index.css'

function Login() {
  return (
    <div className="main-div">
    <div className="heading-div">
        <h1>Todo List</h1>
    </div>
        <div className="login-div">
            <div className="login-heading">
                <h2>Log In</h2>
            </div>
            <div className="email-div">
                <input name ="email" 
                       type ="text" 
                       placeholder="Email" 
                       className="email-field"
                       />
            </div>
           
            <div className="password-div">
                <input name= "password" 
                       type ="password" 
                       placeholder="Password" 
                       className="password-field"
                      />
            </div>
            <div className="errormessage-div">

            </div>
            <div className="loginbutton-div">
                <button className="loginbutton" >Login</button>
            </div>
            <div className="signup-div">
                <a className="signup-link" href="/register">Sign Up?</a>
            </div>
            <div className="guest-div">
                <a className="guest-link" href="/guest">Sign in as Guest</a>
            </div>
        </div>
</div>
  )
}

export default Login