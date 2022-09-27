import React, { useEffect, useState } from 'react'
import '../index.css'
import AddIcon from '@mui/icons-material/Add';
import AddTodoItem from './AddTodoItem';
import Modal from 'react-modal';
import axios from 'axios';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {red} from "@mui/material/colors";



const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: "rgb(159 163 163)",
    height: 'auto',
    width: '30%',
    border: '2px solid black',
    fontSize: '70%',

  },
};

const UserContent = ({ todoListDetails }) => {

  const [tasks, setTasks] = useState()


  const [modalIsOpen, setModalIsOpen] = useState(false)
  const closeModal = () => (
    setModalIsOpen(false)
  )

  useEffect(() => {    
    if (todoListDetails && todoListDetails.id) {
     
      getTask()

    }
  }, [todoListDetails])
  const finishClick = (id)=>{
    axios ({
        method: 'patch',
            url: 'http://127.0.0.1:5000/task',
            data: {id},
            headers: {
                Authorization: "Bearer " + localStorage.getItem("accessToken")
              }
    }).then(resp => {
        if(resp.data.status == true){
          getTask()
            
  
        }
    })
} 


  const getTask = () => {
    axios({
      method:'get',
      url: `http://127.0.0.1:5000/task?id=${todoListDetails.id}`,
      headers:{Authorization: "Bearer " + localStorage.getItem("accessToken")}
    }).then(
      resp => {
        console.log("resptasks",resp.data)

        setTasks(resp.data)
        
      }
    )
  }
 

  const deletetask = (id) => {
    axios({
      method:'delete',
      url:'http://127.0.0.1:5000/task',
      data:{id},
      headers:{Authorization: "Bearer " + localStorage.getItem("accessToken")}
    }).then(
      resp => {
        console.log("true",resp.data.name)
        if (resp.data.status == true){
          getTask()
        }
      }
    )
  }
  const getDate = (dateString) => {
    let date = new Date(dateString)
    return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
  }

  return (
    <div className='align-items-center justify-content-center'>
      <div className="additem-div">
        <h3><ul>Add A Task</ul></h3>
        <div className="additem-btn-div">
          <button className="additem-btn" onClick={() => setModalIsOpen(true)}><AddIcon sx={{ fontSize: 40 }} /></button>
        </div>
      </div>
      <table>
        
        <tr>
          <td><h1>{todoListDetails.name}</h1></td>

        </tr>
      </table>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}>
        <AddTodoItem id={todoListDetails.id} />
      </Modal>

 <div className='table'>
 <table className="table">
<thead className='thead-dark'>
<tr>
 
 <th >Task Name</th>
 <th >Date</th>
 {/* <th >Status</th> */}
 <th >Action</th>
</tr>
</thead>
{tasks && tasks.map((item, key) => {
  // console.log("tasks",tasks)
  // console.log("date",new Date(item.date).toLocaleString().split(","))
     if(item.status=="on progress"){
       return(
        
         <tr style={{backgroundColor:"Highlight"}} key={key}>
         <td>{item.name}</td>
         <td>{new Date(item.date).toLocaleString().split(",")[0]} </td>
         
         
         <button  class="btn btn-danger" onClick={()=>(deletetask(item.id))}>Delete</button>
         <button  class="btn btn-success" onClick={()=>(finishClick(item.id))}>Finish</button>
         </tr>
       )
     }
     else if(item.status=="Finished"){
      return(
        <tr style ={{textDecoration:"line-through", backgroundColor:"#45B39D" }} key={key}>
       <td>{item.name}</td>
       <td>{new Date(item.date).toLocaleString().split(",")[0]} </td>
       <td>Finished</td>
       
       </tr>
        
        
      )
    }
     else{return(
      <tr style={{backgroundColor:"orange"}} key={key}>
        <td>{item.name}</td>
        <td>{new Date(item.date).toLocaleString().split(",")[0]} </td>
        
        
        <button  class="btn btn-danger" onClick={()=>(deletetask(item.id))}>Delete</button>
        <button  class="btn btn-success" onClick={()=>(finishClick(item.id))}>Finish</button>
        </tr> 
     )}

     console.log("hi amoop")
     // return (

     //       <tr key={key}>
           
         

     //     </tr>
     
     // )
   })}
</table>
   
 
 </div>
      
     
    </div>
  )
}

export default UserContent

