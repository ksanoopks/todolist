import React from "react";
import '../index.css'
import HomeIcon from '@mui/icons-material/Home';

const Guest = () =>{
    return(
        <div className="main-div">
            <div className="heading-guest">
                <h1>Todo List</h1>
            </div>
            <div className="row">
                <div className="col-2 sidebar">
                    <div className="sidebar-content">
                        <div className="home-div"><HomeIcon/>
                        <a className="home-link" href="/guest">Home</a>
                        </div>
                        <div className="logout-div">
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
