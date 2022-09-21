import React,{useState} from 'react'
import '../index.css'
import AddIcon from '@mui/icons-material/Add';
import AddTodoItem from './AddTodoItem';
import Modal from 'react-modal';


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

const UserContent = ({taskDetails}) => {
    
    const[modalIsOpen, setModalIsOpen] = useState(false)
    const closeModal = () => (
        setModalIsOpen(false)
    )
    // console.log("id", taskDetails.id)
  
  return (
    <div>UserConent
                    <div className="additem-div">
                        <h3><ul>Add A Task</ul></h3>
                        <div className="additem-btn-div">
                        <button  className="additem-btn" onClick ={ () => setModalIsOpen(true)}><AddIcon sx={{ fontSize: 40 }}/></button>
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
                    onRequestClose = {closeModal}
                    style={customStyles}>
                     <AddTodoItem  id = {taskDetails.id}/>
                    </Modal>
                    

    </div>
  )
}

export default UserContent