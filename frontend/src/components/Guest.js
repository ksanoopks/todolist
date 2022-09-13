import React from "react";
import '../index.css'
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';

const Guest = () =>{
    return(
        <div className="main-div">
            <div className="heading-guest">
                <h1>Todo List</h1>
            </div>
            <div className="row">
                <div className="col-2 sidebar">
                    <div className="sidebar-list">
                        <h6><a className="sidebar-list-text" href="/">Home</a></h6><br></br>
                        <h6><a className="sidebar-list-text" href="/">Personal</a></h6><br></br>
                        <h6><a className="sidebar-list-text" href="/">Work</a></h6><br></br>
                    </div>
                    <div className="sidebar-bottom-content">
                        <div className="home-div">
                        <HomeIcon/>
                        <a className="home-link" href="/">Home</a>
                        </div>
                        <div className="logout-div">
                        <LogoutIcon/>
                        <a className="logout-link" href="/">Logout</a>
                        </div>
                    </div>
                </div>
                <div className="col content-bar">
                    <div className="container table-div">
                    <table className="table">
                        <tr>
                            <th>Username</th>
                            <th>Date</th>
                            <th>Todo List</th>
                        </tr>
                        <tr>
                            <td>viswajith</td>
                            <td>15/09/2022</td>
                            <td>Complete chapter 23</td>
                        </tr>
                        <tr>
                            <td>Anoop</td>
                            <td>16/09/2022</td>
                            <td>Buy apple</td>
                        </tr>
                        <tr>
                            <td>Mathew</td>
                            <td>16/09/2022</td>
                            <td>Practise english</td>
                        </tr>
                    </table>
                    </div>
                </div>
                
            </div>

        </div>
    )
}

export default Guest;
