import './App.css';
import Products from "./Products"
import Login from './Login';
import SignUp from './SignUp';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MyNavbar from './MyNavbar';


function App() {
  return (
    <BrowserRouter>
      <MyNavbar />
        <Routes>
            <Route path="/" element={<Login />} /> 
            <Route path="/products" element={<Products />} />
            <Route path="/login" element={<Login />} />
            <Route path="/SignUp" element={<SignUp />} />
        </Routes>
    </BrowserRouter>

  );
}

export default App;
