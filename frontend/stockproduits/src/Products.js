import { useState, useEffect } from 'react';
import ProductForm from './ProductForm';
import {Button } from 'react-bootstrap';
import { Search } from "react-bootstrap-icons";

function Products(){

    //____________________________________________________________________________________________
    
    // Etat local pour stocker les données du formulaire

        const [products, setProducts] = useState([]);
        const [searchTerm, setSearchTerm] = useState("");
    //____________________________________________________________________________________________
        const [inStock, setInStock] = useState(false);   
    //____________________________________________________________________________________________
        const [productToUpdate, setProductToUpdate] = useState({}); 
    //____________________________________________________________________________________________
        // Cette useEffect permet de recuperer les données depuis l'API au chargement du composant products
        useEffect(() => {
            getAllProducts();
        }, []); 
    //____________________________________________________________________________________________
        //recupération du token dans le localstorage
        const token = localStorage.getItem('token');
    //____________________________________________________________________________________________
       // function CHECKBOX IN STOCK SEARCH pour filter les produits
        
        const handleInStock = (event)=>{
            let checkValue = event.target.checked
            setInStock(checkValue)
        }
            console.log(inStock) 
    
    //____________________________________________________________________________________________
        // function SEARCH pour filter les produits
        
        const handleSearchTerm = (event)=>{
            let value = event.target.value
            setSearchTerm(value)
        }
            console.log(searchTerm) 

    //____________________________________________________________________________________________
        // function GET ALL PRODUCT :  permet de récuprer les produits avec GET

        function getAllProducts(){
            // Utilisation de la methode Fetch pour créer et envoyer la requete en "GET"
            fetch("http://localhost:5000/products",{
                method: "GET",
                headers: {
                "Content-Type": "application/json",
                },
            })
            // La méthode fetch renvoie une premiere promesse
            .then((response) => response.json())
            // La méthode fetch renvoie une deuxieme promesse
            .then((data) => setProducts(data))
            // Si il y a une erreur alors on l'affiche
            .catch((error) => console.error(error));
            
        }

    //____________________________________________________________________________________________
        // function DELETE : Permet de supprimer un produit par id 

        function handleDelete(id) {

            fetch(`http://localhost:5000/products/${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                    },
              })

                .then((response) => response.json())
                .then((data) => console.log(data))
                .then(alert("Product deleted successfully")) 
                .catch((error) => console.error(error));
                // pour actualiser la liste des produits aprés chaque suppression effectué 
                getAllProducts() 
        }

    //____________________________________________________________________________________________

        function handleUpdate(product) {

            setProductToUpdate(product)

        }        

    //____________________________________________________________________________________________
            
        const productFilter = [];

        if(products.length > 0) {
                products.forEach((product)=>{

                if(!product.name.toLowerCase().includes(searchTerm.toLowerCase())){
                    return;
                }
                if(inStock && !product.stock){
                    return;
                }
                    productFilter.push(product)
                })
        } else {
            console.log('Products array is empty!');
        }            
    //____________________________________________________________________________________________


    return(

        <> 
               <div>
                <h2 className='h2' >Formulaire Gestion Produits</h2><br/>
                <table id="mytable">
                    <tbody>
                    <tr>
                        <td>
                        <fieldset className="field">
                            <legend><h3><Search/> Search Form</h3></legend>
                            <strong>Keyword:   
                                    <input rows="5" size="45" maxLength="1000"
                                        type="text"
                                        name="searchBar"
                                        placeholder="Search.."
                                        onChange={handleSearchTerm}
                                    />
                                <p><br/>
                                    <input 
                                    className="larger" 
                                    onClick={handleInStock} 
                                    type="checkbox"/> Que les produits en Stock
                                </p>
                            </strong>
                        </fieldset>
                        </td>
                        <td>
                            {Object.keys(productToUpdate).length>0 ? (
                            <ProductForm 
                                productToFormProps = {productToUpdate}
                                getAllProducts={getAllProducts}/>
                            ) : (
                            <ProductForm 
                                getAllProducts = {getAllProducts} />
                            )} 

                        </td>
                    </tr> 
                    </tbody>   
                </table>  
                </div>

                <table id="mytable" >
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    { token && <th colSpan="2">Action</th> } 
                                    
                                </tr>
                            </thead>
                        <tbody>
                            {productFilter.map((product,index)=>(
                                <tr key={index}>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.description}</td>
                                    <td>{product.price}</td>
                                    <td>{product.stock ? ("En stock") : ("Pas en stock")}</td>
                            { token && <td align="center"><Button variant="warning" onClick={() =>handleUpdate(product)}>Modifier</Button></td>}
                            { token &&  <td align="center"><Button variant="danger" onClick={() =>handleDelete(product.id)}>Supprimer</Button></td>}
                        
                                </tr>
                            ))}
                        </tbody>
                </table>
                <br/>

        </>

    )

}


export default Products;



