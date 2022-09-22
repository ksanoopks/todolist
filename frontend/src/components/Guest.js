import React ,{useState, useEffect} from "react";
import '../index.css'
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from "axios";

const Guest = () =>{

    const [data, setData] = useState([])
    useEffect(() => {
        axios({
            method: 'get',
            url: 'http://127.0.0.1:5000/guest'
        }).then(resp => {
            setData(resp.data)
            console.log("data",resp.data[0].name)
            
        })
      }, [])
   
    const[modalIsOpen, setModalIsOpen] = useState(false)
    const closeModal = () => (
        setModalIsOpen(false)
    )
    return(
        <div className="main-div">
            <div className="heading-guest">
                <h1>Todo List</h1>
            </div>
            <div className="row">
                <div className="col-2 sidebar">
                    <div className="sidebar-list">
                        <h6><a className="sidebar-list-text" href="/">User</a></h6><br></br>
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
                            <th>Todo List</th>
                            <th>User name</th>
                            <th>Task name</th>
                            
                            </tr>
                        {data.map((item, index) => {
                        return(
                            // <h1>{item.name}</h1>
                          
                        <tr key ={index}>
                            <td>{item.name}</td>
                            <td>{item.username}</td>
                            <td>{item.task}</td>
                        
                            
                        
                            
                        </tr>
                        
                        

                   
                        )
                    })}
                     </table>
                    </div>
                </div>
                
            </div>

        </div>
    )
}

export default Guest;
