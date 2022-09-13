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


const App= () => {
  return (
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Login/> }/>
    <Route path="/register" element={<Register/> }/>
    <Route path="/guest" element={<Guest/> }/>
    </Routes>
  </BrowserRouter>
  );
};

export default App;
