import React, {useState} from 'react';
import axios from "axios";
import '../index.css'

const AddTodoList = () => {
    const [values, setValues] = useState(
        Object.assign({
            name: '',
            privacy: '',
        })
    )
    const [errors,setErrors] = useState({})
    const handleChange = (e) => {
        const{name, value} = e.target
        setValues({
            ...values,
            [name]:value
        })
    }

    const handleSubmit = () => {
        console.log("dddd", values)
        let name = '';
        let privacy = '';
        const nameFormat = /^[A-Za-z]+/
        
        if(values.name == ''){
            name ='Add a Todo List'
        }
        if(values.name && !nameFormat.test(values.name)){
            name= "Invalid Name"
         }
        if(values.privacy == '') {
            privacy = 'select any options'
        }

        setErrors({
            name,
            privacy,
        })
        if(errors.name == "" && errors.privacy == ""){
            axios({
                method: 'post',
                url: 'http://127.0.0.1:5000/addtodolist',
                data: values
            }).then((resp) => {
                console.log(resp.data)
                alert(resp.data.message)
                window.location.href= '/users'
            })
        }
    }
  return (
    <div className="modal-main">
                        <div className="todolist-heading">
                            <h2>Add a Todo List</h2>
                        </div>
                        <div className="addtodo-div">
                            <input className="addtodo-field" 
                                   name= "name" 
                                   type ="text" 
                                   placeholder="Todo List Name"
                                   value = {values.name}
                                   onChange={(e) => handleChange(e)}/>
                        </div>
                        <div className='errormessage-div'>
                            {errors.name ? <label style={{color:'red'}}>{errors.name}</label> : null}
                        </div>
                        <div className="radio-btn-div">
                            <label className='privacy-label'>
                                Privacy:
                            </label>
                        <input type="checkbox" 
                               name="privacy" 
                               value= "private"
                               onChange={(e) => handleChange(e)} 
                               className= "radiobtn-field"/>Private
                        <input type="checkbox" 
                               name="privacy" 
                               value = "public"
                               onChange={(e) => handleChange(e)} 
                               className= "radiobtn-field"
                               />Public
                        </div>
                        <div className='errormessage-div'>
                            {errors.privacy ? <label style={{color:'red'}}>{errors.privacy}</label> : null}
                        </div>
                        <div className="todobtn-div">
                            <button className="addbutton-todolist" onClick={ () => handleSubmit()}>Add</button>
                        </div>
                    </div>
  )
}

export default AddTodoList