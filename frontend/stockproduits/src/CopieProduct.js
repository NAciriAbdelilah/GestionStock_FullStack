import { useState, useEffect } from 'react';
import ProductForm from './ProductForm';

function Products(){

    //____________________________________________________________________________________________
    // Etat local pour stocker les données du formulaire

        const [products, setProducts] = useState([]);
        const [searchTerm, setSearchTerm] = useState("");
    //____________________________________________________________________________________________

        const [name, setName] = useState("");
        const [description, setDescription] = useState("");
        const [price, setPrice] = useState(0);
        const [stock, setStock] = useState(false);
    //____________________________________________________________________________________________
        const [updatedForm, setUpdatedForm] = useState(false);

    //____________________________________________________________________________________________

    // Cette useEffect permet de recuperer les données depuis l'API au chargement du composant products
        useEffect(() => {
            getAllProducts();
        }, []); 

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
    // Fonction SUBMIT : lorsque le formulaire est soumis
        function handleSubmit(event) {
        
            event.preventDefault();
    
            // Envoi des données à l'API avec la méthode POST
            fetch("http://localhost:5000/products", {
                method: "POST",
                body: JSON.stringify({name, description, price, stock}),
                headers: {
                "Content-Type": "application/json",
                },
            })
                .then((response) => response.json())
                .then((data) => console.log(data))
                .catch((error) => console.error(error));
            
                getAllProducts(); // afficher le produits aprés l'ajout
                // pour vider les champs
                setName('');
                setDescription('');
                setPrice(0);
                setStock(false);
            }

    //____________________________________________________________________________________________
    // function DELETE   
        function handleDelete(id) {

            fetch(`http://localhost:5000/products/${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    },
              })

              .then((response) => response.json())
              .then((data) => console.log(data))
              .catch((error) => console.error(error));

            getAllProducts() // actualiser la liste des produits aprés chauqe suppression effectué
        }


    //____________________________________________________________________________________________

        function handleUpdate(id) {
        
                let item = products.find(product => product.id==id);
                console.log(item , id)
                 setName(item.name);
                 setDescription(item.description);
                 setPrice(item.price);
                 setStock(item.stock);
                 setUpdatedForm(true);

                // onClick={()=>handleUpdated()}{!updatedForm?`Save`:`Update`}

        }

        function handleUpdated (id){
    
                 // Envoi des données à l'API avec la méthode POST
                 fetch(`http://localhost:5000/products:${id}`, {
                     method: "PUT",
                     body: JSON.stringify({name, description, price, stock}),
                     headers: {
                     "Content-Type": "application/json",
                     },
                 })
                     .then((response) => response.json())
                     .then((data) => console.log(data))
                     .catch((error) => console.error(error));
                 
                     getAllProducts(); // afficher le produits aprés l'ajout
                     // pour vider les champs
                     setName('');
                     setDescription('');
                     setPrice(0);
                     setStock(false);
        }        

        
    //____________________________________________________________________________________________
    //____________________________________________________________________________________________


    return(

            <div>
                    <div className="searchBar">
                        <input
                            type="text"
                            name="searchBar"
                            placeholder="Search.."
                            onChange={handleSearchTerm}
                        />
                    </div>
                    
                    <table id="products" >
                            <tbody>
                                <tr>
                                    <th>Id</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Action</th>
                                </tr>                            
                                {products.filter((product)=>{
                                    return product.name.toLowerCase().includes(searchTerm.toLowerCase())
                                }).map((product,index)=>(
                                    <tr key={index}>
                                        <td>{product.id}</td>
                                        <td>{product.name}</td>
                                        <td>{product.description}</td>
                                        <td>{product.price}</td>
                                        <td>{product.stock ? "En stock" : "Pas en stock"}</td>
                                        <td>
                                            <button className="button_tabel" onClick={() =>handleUpdate(product.id)}>Modifier</button>
                                            <button className="button_tabel" onClick={() =>handleDelete(product.id)}>Supprimer</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                    </table>
                    <br/>

                    <form onSubmit={handleSubmit}>
                        <fieldset className="field">
                            <legend><h2>Add Product:</h2></legend>
                            
                            <label htmlFor="name">Product Name:</label>
                            <input  
                                type="text" 
                                value={name} 
                                onChange={(event) => setName(event.target.value)} /><br/>
                            
                            <label htmlFor="description">Product Description:</label>
                            <textarea 
                                type ="textarea" rows="5" cols="33"
                                value={description} 
                                onChange={(event) => setDescription(event.target.value)} /><br/>
                
                            <label htmlFor="price">Product Price:</label>
                            <input 
                                type="number"   
                                value={price} 
                                onChange={(event) => setPrice(event.target.value)} /><br/>
                            
                            <label htmlFor="stock">Product Stock:</label>
                            <input 
                                type="checkbox" 
                                value={stock} 
                                onChange={(event) => setStock(event.target.checked)} />En Stock<br/><br/> 

                            <input type ="submit" value="Save"></input>
                             
                        </fieldset>
                    </form>                  

            </div>

    )


}



export default Products;



