import React from 'react'
import { useState } from 'react';
import { Card,Button} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
 //recupération du token dans le localstorage
const token = localStorage.getItem('token');

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    function handleSubmit (event) {

      event.preventDefault();
      
      fetch("http://localhost:5000/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.json())    
      .then((data) => {
        if(data.token!==""){
          navigate("/products");
          console.log(data.token);
          // Récupération du token au login dans réact
          localStorage.setItem('token', data.token); 
          
        }
      })
      .catch((error) => alert("Erreur d'authentification!!!"));
  


    };

    return (
      <>
          <Card id='cardlogin' style={{ width: '30rem' }}>
            <form onSubmit={handleSubmit}>
                <Card.Header><h4>Login</h4></Card.Header>
                    <Card.Body>    
                       <div className="mb-3">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)} required
                        />
                        </div>
                        <div className="mb-3">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)} required
                        />
                        </div>
                        
                        <div className="d-grid">
                        <Button type="submit" className="btn btn-success">
                            Sign in
                        </Button>
                        </div>
                        <p className="forgot-password text-right">
                            <strong>Dont have account! <a href="/SignUp">Sign Up?</a></strong>
                        </p>
                  </Card.Body>
            </form>
        </Card>
      </>
    );

}

