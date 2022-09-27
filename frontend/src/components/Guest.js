import React, { useState, useEffect } from "react";
import '../index.css'
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from "axios";
import { textAlign } from "@mui/system";
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PersonIcon from '@mui/icons-material/Person';

const Guest = () => {

    const [data, setData] = useState([])
    useEffect(() => {
        axios({
            method: 'get',
            url: 'http://127.0.0.1:5000/guest'
        }).then(resp => {
            console.log(resp.data)
            setData(resp.data)
            console.log("data", data)

        })
    }, [])

    return (
        <div class="container-fluid userpage">
            <div class="row g-0 navbar-div">
                <div class="col-sm-10 col-md-10 navbar-content">
                    <div className="todoicon-div"><PlaylistAddCheckIcon color="primary" sx={{ fontSize: 40 }} /></div>
                    <h1>Todo List</h1>
                </div>
                <div class="col-2 col-md-2 navbar-user-content">
                    <div className="usericon-div">
                        <div className="usericon-btn">
                            <AccountCircleIcon color="primary" sx={{ fontSize: 30 }} />
                        </div>

                        <div class="dropdown">
                            <button class="dropbtn"><ArrowDropDownIcon sx={{ fontSize: 30 }} /></button>
                            <div class="dropdown-content dropdown-div">
                                <a ><PersonIcon /> <span>Guest</span></a>

                                <button className="logout-btn" onClick={() => localStorage.clear()}>
                                    <a href="/"><LogoutIcon /> <span>Logout</span></a></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="userpage-div">
                <div className="sidebar-div">
                    <div className="guest-heading-div"><h3>Guest</h3></div>
                    <div className="addtodolist-div">
                        <h4> Welcome to Todo List</h4>
                    </div>
                    <div className="guestsidebar">
                        <p> Guest users can only  view <br /> public lists.</p>
                    </div>
                    <div className="guest-register-div">
                        <p> You can register as a user <br /> and add todolists.</p>

                        <div className="guest-register-link-div"><a className="guest-register-link" href="/register">Register</a></div>
                    </div>
                </div>
                <div className="content-div">
                <center><h1>Public TodoLists</h1></center>
                    <div className="container table-div">
                        <table className="guest-table">
                            <tr>
                                <th>Todo List</th>
                                <th>User name</th>
                                <th>Tasks</th>

                            </tr>
                            {console.log(data)}
                            {data.map((todolist) =>

                                <tr>
                                    <td>{todolist.name}</td>
                                    <td>{todolist.username}</td>
                                    <td><ul>{todolist.tasks.map((item, index) => {
                                        return (<ul>{item}</ul>)
                                    })}</ul></td>
                                </tr>

                            )}
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Guest;
