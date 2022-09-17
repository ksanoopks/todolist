import React, {useState, useEffect} from "react";
import '../index.css';
import AddIcon from '@mui/icons-material/Add';
import Modal from 'react-modal';
import AddTodoList from "./AddTodoList";
import axios from "axios";
import AddTodoItem from "./AddTodoItem";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';



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
                            <div className="todolist-name-div">
                                <li className="todolist-name" key = {key}>{item.name}</li>
                               
                            </div>
                                
                        )
                    })}
                    </ul>
                </div> 
        </div>
        <div className="col content-div">

        </div>
    </div>

</div>
    )
}
export default User;