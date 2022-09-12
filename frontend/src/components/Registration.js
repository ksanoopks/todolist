import React from "react";
import '../index.css';

const Register = () => {
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
                        <input name ="text" type ="text" placeholder="Name" className="email-field"/>
                    </div>
                    <div className="email-div">
                        <input name ="email" type ="text" placeholder="Email" className="email-field"/>
                    </div>
                    <div className="email-div">
                        <input name ="email" type ="text" placeholder="Password" className="email-field"/>
                    </div>
                    <div className="password-div">
                        <input name= "password" type ="password" placeholder="Confirm Password" className="password-field"/>
                    </div>
                    <div className="registerbutton-div">
                        <button className="registerbutton" >Register</button>
                    </div>
                    
                    
                </div>
        </div>
    )
}
export default Register;   