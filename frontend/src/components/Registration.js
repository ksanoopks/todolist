import React, { useState } from "react";
import '../index.css';

const Register = () => {
    const [values, setValues] = useState(
        Object.assign({
            name: "",
            email: "",
            password: "" ,
            confirmPassword :""


        })
    )
     const [errors, setErrors] = useState({})
     const handleChange = (e) =>{
        const {name, value} =e.target
        setValues({
            ...values,
            [name]: value,

        })
        console.log(value)
     }

     const handleSubmit=() =>{
        let name, email, password,confirmPassword;
        const emailFormat = /\S+@\S+\.\S+/;
        if (values.name ===""){
            name = "Enter your Name"
        }

        if (values.name && values.name.length<3){
            name ="Name must be more than 3 characters "
        }

        if (values.email === ""){
            email = "Enter your Email"
        }

        if (values.email && !emailFormat.test(values.email)) {
            email = 'Invalid email'
        }

        if(values.password === ''){
            password = "Enter your Email"
        }

        


        setErrors({
            name,
            email,
            password,
            confirmPassword
        })
        
        
     }



    return(
        <div className=" container main-div">
            <div className="heading-div">
                <h1>Todo List</h1>
            </div>
                <div className="register-div">
                    <div className="register-heading">
                        <h2>Register</h2>
                    </div>
                    <div className="email-div">
                        <input name ="name" 
                               type ="text" 
                               placeholder="Name" 
                               className="email-field"
                               value={values.name}
                            onChange={(e)=> handleChange(e)}
                            />
                            <div>{errors.name? <label style={{color:'red'}}>{errors.name}</label>: null}</div>
                    </div>
                    <div className="email-div">
                        <input name ="email" type ="text" placeholder="Email" className="email-field" value={values.email} onChange={(e)=> handleChange(e)}/>
                        <div>{errors.email? <label style={{color :'red'}}>{errors.email}</label>:null}</div>
                    </div>
                    <div className="email-div">
                        <input name ="password" type ="password" placeholder="Password" className="email-field"/>
                    </div>
                    <div className="password-div">
                        <input name= "confirmPassword" type ="password" placeholder="Confirm Password" className="password-field"/>
                    </div>
                    <div className="registerbutton-div">
                        <button className="registerbutton" onClick={()=> handleSubmit()}>Register</button>
                    </div>
                    
                    
                </div>
        </div>
    )
}
export default Register;   