import React from 'react'
import { useState, useEffect } from 'react';
import { Card, Container,Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import Alert from 'react-bootstrap/Alert';



export default function SignUp() {

    //____________________________________________________________________________________________
    // initialisation des champs dans l'Objet item{}
    const [newUser, setNewUser] = useState({
        firstname: "",
        lastname: "",
        email:"",
        password: ""
    });

    const [showAlert, setShowAlert] = useState(false);
    const navigate = useNavigate();

    //____________________________________________________________________________________________
  
    function handleSubmit (event) {

        event.preventDefault();

        fetch("http://localhost:5000/register", {
            method: "POST", 
            body: JSON.stringify({...newUser}),
            credentials: "include",
            headers: {
            "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if(data.message==="User Added successfully"){
                  alert("User Added successfully")
                  navigate("/login");
                  console.log(data.message);
                }else{
                    alert("Email already registered")
                }
              })    
            .catch((error) => console.error(error));
            
            setNewUser({
                firstname: "",
                lastname: "",
                email:"",
                password: ""
            })

           // setShowAlert(true);

    };


return (
    <>
        <Card style={{ width: '40rem' }}>
           <form onSubmit={handleSubmit}>
                    <div>
                        {showAlert && (
                        <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
                        <Alert.Heading>Your are Registered successfully!</Alert.Heading>
                        </Alert>)}
                    </div>
                <Card.Header><h4>Sign Up</h4></Card.Header>
                    <Card.Body>    

                        <div className="mb-0">
                        <label>First name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="First name"
                            value={newUser.firstname} 
                            onChange={(event) => 
                            setNewUser({...newUser, firstname: event.target.value})} required
                        />
                        </div>
                        <div className="mb-3">
                        <label>Last name</label>
                        <input type="text" 
                            className="form-control" 
                            placeholder="Last name"
                            value={newUser.lastname} 
                            onChange={(event) => 
                            setNewUser({...newUser, lastname: event.target.value})} required
                        />
                        </div>
                        <div className="mb-3">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter email"
                            value={newUser.email} 
                            onChange={(event) => 
                            setNewUser({...newUser, email: event.target.value})} required
                        />
                        </div>
                        <div className="mb-3">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter password"
                            value={newUser.password} 
                            onChange={(event) => 
                            setNewUser({...newUser, password: event.target.value})} required
                        />
                        </div>
                        <div className="d-grid">
                            <Button type="submit" className="btn btn-primary">Sign Up</Button>
                        </div>
                        <p className="forgot-password text-right">
                            <strong>Already registered <a href="/Login">Sign In?</a></strong>
                        </p> 
                    </Card.Body>
            </form>
           
        </Card>


    </>
    )
  
}