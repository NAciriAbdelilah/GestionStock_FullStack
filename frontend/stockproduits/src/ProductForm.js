import React, { useEffect, useState } from 'react'
import {Button } from 'react-bootstrap';


function ProductForm({productToFormProps = null, getAllProducts}) {

//____________________________________________________________________________________________
    // initialisation des champs dans l'Objet item{}
    const [item, setItem] = useState({
        name: "",
        description: "",
        price: 0,
        stock: false
    });

//____________________________________________________________________________________________
    const token = localStorage.getItem('token');    
//____________________________________________________________________________________________

    useEffect (()=> {
        if(productToFormProps){
            setItem(productToFormProps)
        }

    }, [productToFormProps]);

//____________________________________________________________________________________________
    // Fonction SUBMIT : lorsque le formulaire est soumis
    
    function handleSubmit(event) {
        
        event.preventDefault(); 

        // Envoi des données à l'API avec la méthode POST
        fetch("http://localhost:5000/products", {
            method: "POST",
            body: JSON.stringify({...item}),
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
            },
        })
            .then((response) => response.json())
            .then((data) => console.log(data))
            .then(alert("Product Added successfully"))
            .catch((error) => console.error(error));
            getAllProducts(); // afficher le produits aprés l'ajout
            setItem({
                name: "",
                description: "",
                price: 0,
                stock: false
            })
        }

//____________________________________________________________________________________________
    // Fonction UPDATE : lorsque le formulaire est soumis

    function handleUpdate (){
        
        // Envoi des données à l'API avec la méthode POST
        fetch(`http://localhost:5000/products/${item.id}`, {
            method: "PUT",
            body: JSON.stringify({...item}),
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
            },
        })
            .then((response) => response.json())
            .then((data) => console.log(data))
            .then(alert("Product Updated successfully"))
            .catch((error) => console.error(error));
        
            getAllProducts(); // afficher le produits aprés la Modification
    }        


//____________________________________________________________________________________________

  return (
    <div>
        
        <form onSubmit={productToFormProps ? handleUpdate : handleSubmit}>
                        <fieldset className="field">
                            <legend><h3>{!productToFormProps ? "Add Product:" : "Update Product:"}</h3></legend>
                            <strong>
                            <label htmlFor="name">Product Name:</label>
                            <input rows="5" size="44" maxLength="1000"
                                type="text" 
                                value={item.name} 
                                onChange={(event) => 
                                setItem({...item, name: event.target.value})} required /><br/>
                            
                            <label htmlFor="description">Product Description:</label>
                            <textarea 
                                type ="textarea" rows="4" cols="46"
                                value={item.description} 
                                onChange={(event) => 
                                setItem({...item, description: event.target.value})} required /><br/>
                
                            <label htmlFor="price">Product Price:</label>
                            <input rows="5" size="50" maxLength="1000"
                                type="number"   
                                value={item.price} 
                                onChange={(event) => 
                                setItem({...item, price: event.target.value})} required /><br/>
                            
                            <label htmlFor="stock">Product Stock:</label>
                            <input className="larger"
                                type="checkbox"
                                checked={item.stock}
                                value={item.stock}
                                onChange={(event) => 
                                setItem({...item, stock: event.target.checked})} /> En Stock<br/><br/> 
                            </strong>
                            {token && 
                            <div className="d-grid gap-2">
                            <Button variant="success" size="lg" type="submit">{!productToFormProps ? "Save" : "Update"}</Button >
                            </div>
                            }
                        </fieldset>
            </form>
    </div>
  )
}

export default ProductForm 