import React , {useState} from "react";
import '../index.css'
import axios from 'axios'


const Login = () => {
    const [values, setValues] = useState(
        Object.assign({
            email:'',
            password: '',
        })
    )
    const [errors, setErrors] = useState({})
    const handleChange = (e) => {
        const {name, value} = e.target
        setValues({
            ...values,
            [name]: value,
        })
    }
    const handleSubmit = () => {
        let email = ''
        let password = ''
        const emailFormat = /\S+@\S+\.\S+/
        if (values.email === '') {
            email = 'Enter your Email'
          }
          if (values.email && !emailFormat.test(values.email)) {
            email = 'Invalid email'
          }
      
          if (values.password === '') {
            password = 'Enter your Password'
          }
      
          setErrors({
            email,
            password,
          });
          if( email==='' && password===''){ 
            axios({
                method: 'post',
                url: 'http://127.0.0.1:5000/login',
                data: values
            }).then((resp) => {
                console.log(resp)
                if(resp.data.accessToken){
                    localStorage.setItem("accessToken", resp.data.accessToken)
                }
               
                if(resp.data.status == true){
                    window.location.href='/users'
                    console.log("login done")
                }
                else if(resp.data.error){
                    alert (resp.data.error)
                    window.location.href='/'
                    console.log("login error")
                }

                
            })
            
         }
    }
    return(
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
                               value={values.email}
                               onChange={(e) => handleChange(e)}
                               />
                    </div>
                    <div className="errormessage-div">
                    {errors.email ? <label style={{color:'red'}}>{errors.email}</label> :null}

                    </div>
                    <div className="password-div">
                        <input name= "password" 
                               type ="password" 
                               placeholder="Password" 
                               className="password-field"
                               value={values.password}
                               onChange={(e) => handleChange(e)}
                              />
                    </div>
                    <div className="errormessage-div">
                    {errors.password ? <label style={{color:'red'}}>{errors.password}</label> :null}

                    </div>
                    <div className="loginbutton-div">
                        <button className="loginbutton" onClick={() => handleSubmit()}>Login</button>
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
export default Login;   