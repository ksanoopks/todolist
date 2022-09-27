import React, {useState, useEffect} from "react";
import '../index.css';
import AddIcon from '@mui/icons-material/Add';
import Modal from 'react-modal';
import AddTodoList from "./AddTodoList";
import axios from "axios";
import { Link } from "react-router-dom";
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import AddTodoItem from "./AddTodoItem";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { red, yellow } from "@mui/material/colors";
import UserContent from "./UserContent";
import {
    MDBBtn,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
  } from 'mdb-react-ui-kit';



// const customStyles = {
//     content: {
//       top: '50%',
//       left: '50%',
//       right: 'auto',
//       bottom: 'auto',
//       marginRight: '-50%',
//       transform: 'translate(-50%, -50%)',
//       backgroundColor: "rgb(159 163 163)",
//       height: 'auto',
//       width: '30%',
//       border: '2px solid black',
//       fontSize: '70%',
      
//     },
//   };



const User = () => {
    useEffect(() => {
            axios({
                method: 'get',
                url: 'http://127.0.0.1:5000/currentuser',
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("accessToken")
                  }
            }).then(resp => {
                console.log("user" , resp.data)
                setUser(
                    resp.data
                    )
                    console.log("userrrrrr" , user)
            })
    },[])
    const [user, setUser] = useState([])
   
    const getTodoList = () => {
        axios({
            method: 'get',
            url: `http://127.0.0.1:5000/todolist`,
            headers: {
                Authorization: "Bearer " + localStorage.getItem("accessToken")
            }
            }).then(resp => {
                console.log("data",resp.data)
            setData(
                resp.data
            )
                if(resp.data.length > 0) {
                    setContent(resp.data[0])
                }
            })
   
    }
    const [data, setData] = useState([])
    useEffect(() => {
        getTodoList()
      }, [])
    const listdeleteClick = (id)=>{
        axios ({
            method: 'post',
                url: 'http://127.0.0.1:5000/deletetodo',
                data: {id},
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("accessToken")
                  }
        }).then(resp => {
            if(resp.data.status == true){
                console.log("status",resp.data.status)
                getTodoList()
            }
        })
    } 
    const [centredModal, setCentredModal] = useState(false);

    const toggleShow = () => setCentredModal(!centredModal);
   
  
    
    const [ content, setContent] = useState({})
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
                        <div class="dropdown-content dropdown-div">
                            <a ><PersonIcon/> <span>{data.user_name}</span></a>
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
            {/* <Modal
            isOpen={modalIsOpen}
            ariaHideApp={false}
            onRequestClose = {closeModal}
            style={customStyles}>
                <AddTodoList/>
            </Modal> */}
        </div>
            <div className="addtodolist-div">
            <h3>Todo List</h3>
            <button type="button" class="btn btn-light" data-mdb-ripple-color="dark"onClick={toggleShow} className="addicon-btn" ><AddIcon color = "primary" sx={{ fontSize: 35 }}/></button>

            {/* <MDBBtn onClick={toggleShow} className="addicon-btn" ><AddIcon color = "primary" sx={{ fontSize: 35 }}/></MDBBtn> */}
            {/* <button className="addicon-btn" onClick ={ () => setModalIsOpen(true)}> <span><AddIcon color = "primary" sx={{ fontSize: 35 }}/></span></button> */}
        </div>
        <div>
        

<MDBModal tabIndex='-1' show={centredModal} setShow={setCentredModal}>
  <MDBModalDialog centered>
    <MDBModalContent>
      <MDBModalHeader>
        <MDBBtn className='btn-close' color='none' onClick={toggleShow}></MDBBtn>
      </MDBModalHeader>
      <MDBModalBody>
        <AddTodoList/>
      </MDBModalBody>
      <MDBModalFooter>
      </MDBModalFooter>
    </MDBModalContent>
  </MDBModalDialog>
</MDBModal>
        </div>
        <div className="todolist-name-div">
                <table className="todolist-ul">
                {data.map((item, key) => {
                    return(
                        <tr key = {key}>
                            {/* <td><Link to = {`/users/${item.id}` }>{item.name}</Link></td> */}
                            <td> <a className= {item.id == content.id ? "selected-todolist" : "todolist-name" } onClick = { () => setContent(item)} >{item.name} </a></td>
                            <td><label className= {item.privacy == "private" ? "todolist-privacy-private" : "todolist-privacy-public"} >{item.privacy}</label></td>
                            <button className="delete-btn"onClick={()=>(listdeleteClick(item.id))}><DeleteForeverIcon sx={{ color: red[800] }}/></button>
                        </tr>
                    )
                })}
               
                </table>
            </div> 
    </div>
    <div className="content-div">
        {console.log("cc", content)}
        {content ? <UserContent todoListDetails={content}/>: null}
        
    
    </div>
    </div>

</div>
    )
}
export default User;