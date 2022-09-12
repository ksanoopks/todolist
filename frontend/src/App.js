import React from 'react';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Register from './components/Registration';


const App= () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/register" element={<Register/> }/>
    </Routes>
  </BrowserRouter>
  );
};

export default App;
