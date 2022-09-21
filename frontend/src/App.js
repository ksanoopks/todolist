import React from 'react';
import './App.css';
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



const App= () => {
  return (
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Login/> }/>
    <Route path="/register" element={<Register/> }/>
    <Route path="/guest" element={<Guest/> }/>
    <Route path='/users' element ={<Users/>}/>
        
    
    <Route path="/todolists" element={<AddTodoList/>}/>
    <Route path="/todoitems" element={<AddTodoItem/>}/>


    </Routes>
  </BrowserRouter>
  );
};

export default App;
