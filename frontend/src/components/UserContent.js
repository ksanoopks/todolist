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

const UserContent = ({ taskDetails }) => {
  const [tasks, setTasks] = useState()
  console.log("tasks",tasks)

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const closeModal = () => (
    setModalIsOpen(false)
  )
  // let id = data.id
  // console.log("id", taskDetails.id)

  useEffect(() => {    
    console.log('taskDeatails', taskDetails)
    if (taskDetails && taskDetails.id) {
      axios({
        method: 'get',
        url: `http://127.0.0.1:5000/viewtodoitems?id=${taskDetails.id}`,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken")
        }
      }).then(resp => {
        console.log("data",resp.data)
        console.log("tasks",resp.data.tasks)
        setTasks(
          resp.data
        )
      })
      getTask()

    }
  }, [taskDetails])


  const getTask = () => {
    axios({
      method:'get',
      url: `http://127.0.0.1:5000/viewtodoitems?id=${taskDetails.id}`,
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
      method:'post',
      url:'http://127.0.0.1:5000/deletetask',
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

  return (
    <div>UserConent
      <div className="additem-div">
        <h3><ul>Add A Task</ul></h3>
        <div className="additem-btn-div">
          <button className="additem-btn" onClick={() => setModalIsOpen(true)}><AddIcon sx={{ fontSize: 40 }} /></button>
        </div>
      </div>
      <table>
        <tr>
          <th>name</th>
        </tr>
        <tr>
          <td>{taskDetails.name}</td>

        </tr>
      </table>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}>
        <AddTodoItem id={taskDetails.id} />
      </Modal>
      <div>
      <table >
              <tr >
                <th>date</th>
                <th>Name</th>
              </tr>
        {tasks && tasks.map((item, key) => {
          return (

              <tr key={key}>
                <td>{item.date}</td>
                <td>{item.name}</td>
                <td>{item.status}</td>
                <button className="delete-btn" onClick={()=>(deletetask(item.id))}><DeleteForeverIcon sx={{ color: red[800] }}/></button>
              </tr>
          )
        })}
          </table>
      </div>
    </div>
  )
}

export default UserContent