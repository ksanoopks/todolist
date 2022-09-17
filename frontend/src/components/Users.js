import React, {useState, useEffect} from "react";
import '../index.css';
import AddIcon from '@mui/icons-material/Add';
import Modal from 'react-modal';
import AddTodoList from "./AddTodoList";
import axios from "axios";
import AddTodoItem from "./AddTodoItem";




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
      border: 'solid',
      fontSize: '70%',
    },
  };
const Content = (props) => {
    const[modalIsOpen, setModalIsOpen] = useState(false)
    const closeModal = () => (
        setModalIsOpen(false)
    )
    if(props.val == 'todolist'){
        return(
            <div>
                <div className="additem-div">
                    <h3><ul>Add A Task</ul></h3>
                    <div className="additem-btn-div">
                    <button onClick ={ () => setModalIsOpen(true)} className="additem-btn"><AddIcon sx={{ fontSize: 40 }}/></button>
                </div>
                <Modal
                isOpen={modalIsOpen}
                onRequestClose = {closeModal}
                style={customStyles}>
                 <AddTodoItem/>
                </Modal>
                </div>
            </div>
        )
    }
}
const User = () => {
   
    const [data, setData] = useState([])
    useEffect(() => {
        axios({
            method: 'get',
            url: 'http://127.0.0.1:5000/addtodolist'
        }).then(resp => {
            console.log("data",resp.data)
            setData(
                resp.data
            )
        })
      }, [])

    const [response, setResponse] = useState([])
    useEffect(() => {
        axios({
            method: 'get',
            url: 'http://127.0.0.1:5000/addtodoitems'
        }).then(resp => {
            console.log("response",resp.data)
            setResponse(
                resp.data
            )
        })
    }

    )
   
    const[modalIsOpen, setModalIsOpen] = useState(false)
    const closeModal = () => (
        setModalIsOpen(false)
    )
    const [ content, setContent] = useState('')
    return(
<div className="container-fluid main-div">
    <div className="heading-div">
        <h1>Todo List</h1>
    </div>
    <div className="row">
        <div className="col-2 sidebar-div">
            <div className="sidebarcontent-div">
                <div><h3>Todo List</h3>
                </div>
                <div className="modal-body">
                <Modal
                isOpen={modalIsOpen}
                ariaHideApp={false}
                onRequestClose = {closeModal}
                style={customStyles}>
                    <AddTodoList/>
                </Modal>
                <button onClick ={ () => setModalIsOpen(true)} className="addicon-btn" ><AddIcon sx={{ fontSize: 40 }}/></button>
                </div> 
                </div>
                <div>
                <ul>
                    {data.map((item, key) => {
                        return(
                            <div>
                                <a className="todolist-name" key = {key} onClick = { () => setContent('todolist')} >{item.name} </a>
                            </div>
                                
                        )
                    })}
                    </ul>
                </div> 
        </div>
        <div className="col content-div">
            <Content val = {content}/>
            <div className="user-task-table-div">
                <table className="user-task-table">
                    {response.map((task,key)=>{
                    return(<tr className="user-task-table-content">
                            <td>{key}</td>
                            <td>{task.name}</td>
                            <td>{task.date}</td>
                            <td>{task.status}</td>
                        </tr>)})
                    } 
                               
                </table>
            </div>

        </div>
    </div>

</div>
    )
}
export default User;