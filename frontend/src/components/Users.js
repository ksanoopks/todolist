import React, {useState, useEffect} from "react";
import '../index.css';
import AddIcon from '@mui/icons-material/Add';
import Modal from 'react-modal';
import AddTodoList from "./AddTodoList";
import axios from "axios";
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import AddTodoItem from "./AddTodoItem";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { red } from "@mui/material/colors";



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



const User = () => {
    const Content = (props) => {
   
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
                    <div className="user-task-table-div">
                    <table className="user-task-table">
                    <tr className="user-task-table-1st-row">
                            <th>index</th>
                            <th>task</th>
                            <th>date</th>
                        </tr>
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
            )
        }
    }
    

   const deletelist = () => {
    axios({
        method: 'get',
        url: 'http://127.0.0.1:5000/todolist',
        headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken")
          }
    }).then(resp => {
        setData(
            resp.data
           
        )
        console.log(resp.data)
    })
   }
    const [data, setData] = useState([])
    useEffect(() => {
      deletelist()

      }, [])
    const deleteClick = (id)=>{
        axios ({
            method: 'post',
                url: 'http://127.0.0.1:5000/deletetodo',
                data: {id},
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("accessToken")
                  }
        }).then(resp => {
            if(resp.data.status == true){
                deletelist()
            }
            console.log("resp", resp.data)
        })
    }

    const [response, setResponse] = useState([])
    useEffect(() => {
        axios({
            method: 'get',
            url: 'http://127.0.0.1:5000/addtodoitems',
            headers: {
                Authorization: "Bearer " + localStorage.getItem("accessToken")
              }
        }).then(resp => {
            console.log("response",resp.data)
            setResponse(
                resp.data
            )
        })
    },[])
    
   
    const[modalIsOpen, setModalIsOpen] = useState(false)
    const closeModal = () => (
        setModalIsOpen(false)
    )
    const [ content, setContent] = useState('')
    return(
        <div class = "container-fluid userpage">
        <div class="row g-0 navbar-div">
            <div class="col-sm-10 col-md-10 navbar-content">
                <div className="todoicon-div"><PlaylistAddCheckIcon color = "primary" sx={{ fontSize: 40 }}/></div>
                    <h1>Todo List</h1>
                </div>
                <div class="col-2 col-md-2 navbar-user-content"> 
                    <div className="usericon-div">
                        <div className="usericon-btn">
                            <AccountCircleIcon color = "primary" sx={{ fontSize: 30 }}/>
                        </div>

                    <div class="dropdown">
                        <button class="dropbtn"><ArrowDropDownIcon sx={{ fontSize: 30 }}/></button>
                        <div class="dropdown-content">
                            <a href="#"><PersonIcon/> <span>User</span></a>
                            <button className="logout-btn" onClick={ () => localStorage.clear()}>
                            <a href="/"><LogoutIcon/> <span>Logout</span></a></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="userpage-div">
        <div className="sidebar-div">
            <div className="sidebar-heading">
                <h2>Add a Todo List</h2>
            </div>
        <div className="modal-body">
            <Modal
            isOpen={modalIsOpen}
            ariaHideApp={false}
            onRequestClose = {closeModal}
            style={customStyles}>
                <AddTodoList/>
            </Modal>
        </div>
            <div className="addtodolist-div">
            <h3>Todo List</h3>
            <button className="addicon-btn" onClick ={ () => setModalIsOpen(true)}> <span><AddIcon color = "primary" sx={{ fontSize: 35 }}/></span></button>
        </div>
        <div className="todolist-name-div">
                <table className="todolist-ul">
                {data.map((item, key) => {
                    return(


                        <tr key = {key}>
                            <td>  <a className="todolist-name"  onClick = { () => setContent('todolist')} >{item.name} </a></td>
                            <td><label className="todolist-privacy">{item.privacy}</label></td>
                            <button className="delete-btn"onClick={()=>(deleteClick(item.id))}><DeleteForeverIcon sx={{ color: red[800] }}/></button>
                        </tr>
                    )
                })}
               
                </table>
            </div> 
    </div>
    <div className="content-div">
    <Content val = {content}/>
    </div>
    </div>

</div>
    )
}
export default User;