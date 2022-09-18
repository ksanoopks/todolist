import React, {useState} from 'react';
import axios from "axios";
import '../index.css';

const AddTodoItem = () => {
    const [values, setValues] = useState(
        Object.assign({
            name: '',
            date: '',
        })
    )
    const [errors, setErrors] = useState({})
    const handleChange = (e) => {
        const{name, value} = e.target
        setValues({
            ...values,
            [name]:value,
        })

    }

    const handleSubmit = () => {
        let name = '';
        let date = '';
        const nameFormat = /^[A-Za-z]+/
        if(values.name == ''){
            name ='Add a Todo List'
        }
        if(values.name && !nameFormat.test(values.name)){
            name= "Invalid Name"
         }
        if(values.date == ''){
            date = 'Select a date'
        }
        setErrors({
            name,
            date,
        })
        if(name == "" && date == ""){
            axios({
                method: 'post',
                url: 'http://127.0.0.1:5000/addtodoitems',
                data: values,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("accessToken")
                  }
            }).then((resp) => {
                console.log(resp.data)
                alert(resp.data.message)
                window.location.href= '/users'
            })
        }
    }
    
    return(
            <div className="modal-main">
                        <div className="todolist-heading">
                            <h2>Add a Todo Item</h2>
                        </div>
                        <div className="addtodo-div">
                            <input className="addtodo-field" 
                                   name= "name" 
                                   type ="text" 
                                   value = {values.name}
                                   onChange = {(e) => {handleChange(e)}}
                                   placeholder="Add a task"
                                  />
                        </div>
                        <div className='errormessage-div'>
                            {errors.name ? <label style={{color:'red'}}>{errors.name}</label> : null}
                        </div>
                        <div className='addtodo-div'>
                            <input type = "date" 
                                   name = "date" 
                                   placeholder='Date' 
                                   value = {values.date} 
                                   onChange = {(e) => {handleChange(e)}} 
                                   className='date-field'/>
                        </div>
                        <div className='errormessage-div'>
                            {errors.date ? <label style={{color:'red'}}>{errors.date}</label> : null}
                        </div>
                        <div className="todobtn-div">
                            <button className="addbutton-todolist" onClick={() => handleSubmit()}>Add</button>
                        </div>
                    </div>
    )
}
export default AddTodoItem;