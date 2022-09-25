import React, { useEffect, useState } from 'react'
import '../index.css'
import AddIcon from '@mui/icons-material/Add';
import AddTodoItem from './AddTodoItem';
import Modal from 'react-modal';
import axios from 'axios';
import { FormatUnderlined } from '@mui/icons-material';


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

const UserContent = ({ taskDetails }) => {
  const [tasks, setTasks] = useState()
  // const id = taskDetails.id
  // console.log("id", id)

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const closeModal = () => (
    setModalIsOpen(false)
  )
  // console.log("id", taskDetails.id)

  useEffect(() => {
    console.log('hits')
    console.log('dfdf', taskDetails)
    if (taskDetails && taskDetails.id) {
      axios({
        method: 'get',
        url: `http://127.0.0.1:5000/viewtodoitems?id=${taskDetails.id}`,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken")
        }
      }).then(resp => {
        console.log("tasks", resp.data)
        setTasks(
          resp.data
        )
      })

    }
  }, [taskDetails])
  const finishClick = (id)=>{
    axios ({
        method: 'post',
            url: 'http://127.0.0.1:5000/finishedtask',
            data: {id},
            headers: {
                Authorization: "Bearer " + localStorage.getItem("accessToken")
              }
    }).then(resp => {
        if(resp.data.status == true){
            
        }
    })
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
          <td><h1>{taskDetails.name}</h1></td>

        </tr>
      </table>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}>
        <AddTodoItem id={taskDetails.id} />
      </Modal>
      <div className='table-wrapper'>
      <table className="table">
  <thead>
    <tr>
      <th >Date</th>
      <th >Task Name</th>
      {/* <th >Status</th> */}
      <th >Action</th>
    </tr>
  </thead>
  {tasks && tasks.map((item, key) => {
          if(item.status=="on progress" || item.status=="On progress"){
            return(
              <tr style={{backgroundColor:"Highlight"}} key={key}>
              <td>{item.date}</td>
              <td>{item.name}</td>
              {/* <td>{item.status}</td> */}
              {/* <td><button onClick={()=>(finishClick(item.id))}>Done</button></td> */}
              {/* <td><button onClick={()=>(TaskDeleteClick(item.id))}>Delete</button></td> */}
              <button  class="btn btn-success" onClick={()=>(finishClick(item.id))}>Finish</button>
              </tr>
            )
          }
          else{return(
            <tr style ={{textDecoration:"line-through", backgroundColor:"#45B39D" }} key={key}>
            <td>{item.date}</td>
            <td>{item.name}</td>
            {/* <td>{item.status}</td> */}
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