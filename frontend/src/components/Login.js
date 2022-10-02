import React, { useState } from "react";
import '../index.css'
import axios from 'axios'
import swal from 'sweetalert';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import HomeIcon from '@mui/icons-material/Home';


const Login = () => {
    const [values, setValues] = useState(
        Object.assign({
            email: '',
            password: '',
        })
    )
    const [errors, setErrors] = useState({})
    const handleChange = (e) => {
        const { name, value } = e.target
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
        if (email === '' && password === '') {
            axios({
                method: 'post',
                url: 'http://127.0.0.1:5000/login',
                data: values
            }).then((resp) => {
                if (resp.data.accessToken) {
                    localStorage.setItem("accessToken", resp.data.accessToken)
                }

                if (resp.data.message) {
                    swal({ text: resp.data.message, icon: "success" }).then(function () { window.location = "http://localhost:3000/users"; });
                }

            }).catch((e) => {
                if (e.response.status === 401) {
                    swal({ text: "Invalid Email or Password", icon: "error", closeModal: true })

                }

            })

        }
    }
    return (
        <div className="main-div">
            <div class="row g-0 navbar-div">
                <div class="col-sm-10 col-md-10 navbar-content">

                    <div className="todoicon-div"><PlaylistAddCheckIcon color="primary" sx={{ fontSize: 40 }} /></div>
                    <h1>Todo List</h1>
                </div>
                <div class="col-2 col-md-2 navbar-home">
                    <div><HomeIcon color="primary" sx={{ fontSize: 30 }} /></div>
                    <div className="home-navlink"><a href='/'>Home</a></div>

                </div>
            </div>
            <div className="login-div">
                <div className="login-heading">
                    <h2>Log In</h2>
                </div>
                <div className="email-div">
                    <input name="email" type="text" placeholder="Email" className="email-field" value={values.email} onChange={(e) => handleChange(e)} />
                </div>
                <div className="errormessage-div">
                    {errors.email ? <label style={{ color: 'red' }}>{errors.email}</label> : null}

                </div>
                <div className="password-div">
                    <input name="password" type="password" placeholder="Password" className="password-field" value={values.password} onChange={(e) => handleChange(e)} />
                </div>
                <div className="errormessage-div">
                    {errors.password ? <label style={{ color: 'red' }}>{errors.password}</label> : null}

                </div>
                <div className="loginbutton-div">
                    <button className="loginbutton" onClick={() => handleSubmit()}>Login</button>
                </div>
            </div>
        </div>
    )
}

export default Login;   