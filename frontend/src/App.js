import React from 'react';
import './App.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Register from './components/Registration';
import Login from './components/Login';
import Guest from './components/Guest';
import Users from './components/Users'
import AddTodoList from './components/AddTodoList';
import AddTodoItem from './components/AddTodoItem';
import UserContent from './components/UserContent';
import Home from './components/Home';


const App = () => {
  return (
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Home/> }/>
    <Route path="/login" element={<Login/> }/>
    <Route path="/register" element={<Register/> }/>
    <Route path="/guest" element={<Guest/> }/>
    <Route path ='/users/:userName' element={<Users/>}/>
      <Route path='/users/:userName/todolists/:todolistName'  element ={<Users/>}/>
    
    

   
   
    <Route path="/todolistss" element={<AddTodoList/>}/>
    <Route path="/todoitems" element={<AddTodoItem/>}/>

      </Routes>
    </BrowserRouter>
  );
};

export default App;
