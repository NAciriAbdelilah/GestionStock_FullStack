//___________________________________________________________________________________________
   const express = require('express');
    const app = express();
//___________________________________________________________________________________________
    const cors = require('cors')
    app.use(cors({
      credentials: true,
      origin: 'http://localhost:3000'
    }));
//___________________________________________________________________________________________
    const port = 5000
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
//___________________________________________________________________________________________
    const dbUtils = require('./db-init');
    const queryFile = require('./queryFile');
//___________________________________________________________________________________________
    app.use(express.json());  // Middleware qui permet de lire l'objet request.body
    app.use(express.urlencoded());   // Middleware pour remplir le requset . body avec url encodad et NON JSON 
//___________________________________________________________________________________________

//_____________Authentification : JWT _________________________________________________________

    const jwt = require('jsonwebtoken');
    const bodyParser = require('body-parser');
    const bcrypt = require('bcryptjs');
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    const secret = 'ma-cle-secrete';

//___________________________________________________________________________________________
    // un endpoint  POST : INSERT : "/register" => pour Créer un utilisateur

    app.post('/register', (req, res) => {
      let email = req.body.email;
      let password = req.body.password;
      console.log(email,password)
      
      // Verifier si un utilisateur avec cet email existe
      // sinon retourner une erreur
            
      let client = dbUtils.getClient()

      let sql = 'SELECT * FROM users WHERE email = $1';

      client.query(sql, [email], (error,result) =>{
            
            if (error){
              console.error("Error checking if user exists: ", error);
              return res.status(500).json({ message: 'Internal server error' });
            } 

            if (result.rows.length > 0) {
              return res.status(409).json({ message: "Email already registered" });
            }

          // si aucun utilisateur existe avec cet email alors
          // Hash du password

            bcrypt.hash(password, 10, (error, hashedPassword) => {
              if (error) {
                console.error("Error hashing password: ", error);
                return res.status(500).json({ message: "Internal server error" });
              }

            // On sauvegarde l'utilisateur avec le mot de pass hashé dans la base de donnée

              const newUser = [req.body.firstname, req.body.lastname, req.body.email, hashedPassword]

              queryFile.addUser(client, newUser, callback)
              
              function callback (error,data){
                      
                if (error) {
                  console.error("Error saving user: ", error);
                  return res.status(500).json({ message: "Internal server error" });
                }

                res.json({message:"User Added successfully"})

              }

            });
        }); 
    });

//___________________________________________________________________________________________

    async function checkCredentials(email, password) {
      let client = dbUtils.getClient()

      const sql = {
        text: 'SELECT * FROM users WHERE email = $1',
        values: [email],
      };
    
      const results = await client.query(sql);
    
      if (results.rows.length > 0) {
        const user = results.rows[0];
        const match = await bcrypt.compare(password, user.password);
    
        if (match) {
          return user;
        }
      }
    
      return null;
    }
//___________________________________________________________________________________________

    app.post('/login', async (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
        console.log(email,password)

        const user = await checkCredentials(email, password);
        
        console.log(user);
    
        if(!user){    
            res.status(403).send('Wrong credentials');
        }else {    
            
          const token = jwt.sign({ email }, secret);
          res.json({ message: "Login successful", token });
          
        }
    });
//___________________________________________________________________________________________
    // Middleware : la fonction pour authentifier l'utilisateur à chacune de ses requetes
    
    const authenticate = (req, res, next) => {

      const headerToken = req.headers.authorization;

      if (!headerToken) {
        return res.status(401).json({ message: 'Authorization header missing' });
      }
      const token = headerToken.split(' ')[1];
      try {
        const decodedToken = jwt.verify(token, secret);
        req.user = decodedToken;
        next();
      } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
      }
    };

//____________________________________________________________________________________________

//____________________________________________________________________________________________

//___________________________________________________________________________________________


//___GET ALL PRODUCTS_________________________________________________________________________________________

app.get('/products' , (req, res) => {

  let client = dbUtils.getClient()
  
  queryFile.getAllProducts(client, (error,data) =>{

      if (error){
        console.log(error)
      }
        res.json(data.rows)
        client.end()
  })
})

//____GET PRODUCT BY ID ________________________________________________________________________________________

    app.get('/products/:id', (req, res) => {
      let id = req.params.id
      let client = dbUtils.getClient()
      
      queryFile.getProductById(client, [id], (error,data) =>{

          if (error){
            console.log(error)
            return
          }
            res.json(data.rows)
            client.end()
      })
    })

//_____ADD NEW PRODUCT_______________________________________________________________________________________

    app.post('/products', (req, res) => {
            
      const newData = [req.body.name, req.body.description, req.body.price, req.body.stock]

      let client = dbUtils.getClient()

      function callback (error,data){
        
        if (error){
          console.log(error)
          res.send("error in server")
          return
        }
        res.json({message:" ok : data inserted successfully"})
        client.end()
      }

      queryFile.addProduct(client, newData, callback)
      
    });
    
//____DELETE PRODUCT BY ID VERSION 1________________________________________________________________________________________

    app.delete('/products/:id', (req, res) => {
    
      let id = req.params.id
    
      let client = dbUtils.getClient()
    
      function callback (error,data){
        
        if (error){
          console.log(error)
          res.send("error in server")
          return
        }
        res.json({message:" ok : Product deleted successfully"})
        client.end()
      }

      queryFile.deleteProduct(client, [id], callback)
      
    }) 

//____UPDATE PRODUCT BY ID VERSION 1________________________________________________________________________________________

     app.put('/products/:id', (req, res) => {
      const id = req.params.id;
      console.log(id,req.body)
      const {name, description, price, stock} = req.body;
      
      let client = dbUtils.getClient()
      
      queryFile.updateProductById(client,[name, description, price, stock, id], (error, results) => {
            if (error) {
              console.log(error);
              res.status(500).json({ success: false, message: 'Error updating product' });
            } else if (results.rowCount === 0) {
              res.status(404).json({ success: false, message: 'Product not found' });
            } else {
              res.status(200).json({ success: true, message: 'Product updated successfully' });
            }
        }
      )
    }) 

//____DELETE PRODUCT BY ID VERSION 2________________________________________________________________________________________

    /*  app.delete('/products/:id', (req, res) => {
        let id = req.params.id
        let client = dbUtils.getClient()
        
        queryFile.deleteProduct(client, [id], (error,data) =>{
      
            if (error){
                console.log(error)
                res.send("error in server")
                return
            } 
              res.status(200).json({ success: true, message: 'Product deleted successfully' });
              res.json(data.rows)
              client.end()
                
        })
      }) */

//____UPDATE PRODUCT BY ID VERSION 2________________________________________________________________________________________

/* app.put('/products/:id', (req, res) => {
  console.log("updated with success")
      let id = req.params.id
      let name = req.body.name
      let description = req.body.description
      let price = req.body.price
      let stock = req.body.stock
      console.log(name)
      let sql = 'update products set name=$1,description=$2,price=$3,stock=$4 where id=$5'
      let client = dbUtils.getClient()
      client.query(sql,[name,description,price,stock,id],(error,data) => {
        if(error){
          console.log(error)
          return
        }
        res.json(data.rows)
      });
    }); */  
    /*   queryFile.updateProductById(client, [name,description,price,stock,id], (error, results) => {
          if (error){
            console.log(error)
            return
          }
          else if (error) {
              console.log(error);
              res.status(500).json({ success: false, message: 'Error updating product' });
              return;
          } else if (results.affectedRows === 0) {
              res.status(404).json({ success: false, message: 'Product not found' });
              return;
          } else {
              res.status(200).json({ success: true, message: 'Product updated successfully' });

          }

          console.log("id : " + id,req.body)
          client.end();

      }); */

//____________________________________________________________________________________________

  // un endpoint POST : SELECT : "/login" => pour le Login utilisateur
/*   app.post('/login', (req, res) => {
      // On vérifie si un utilisateur avec cet email exist
      // sinon on retourne une erreur

      let email = req.body.email
      let password = req.body.password
      let client = dbUtils.getClient()

        // Check if a user with this email exists in the database

        let sql = 'SELECT * FROM users WHERE email = $1';
  
        client.query(sql, [email], (error, results) => {
        
          if (error) {
            console.error("Error getting user from database: ", error);
            return res.status(500).json({ message: "Internal server error" });
          }
        
        // If no user with this email exists, return an error
         
          if (!results.rows.length) {
            console.log(results.rows.length)
            return res.status(401).json({ message: "Invalid email or password" });
          }

      // Si il exist on verifie que le mot de passe est juste
      // If the email is valid, check if the password is correct

        let user = results.rows[0];

        bcrypt.compare(password, user.password, (error, isMatch) => {
          if (error) {
            console.error("Error comparing passwords: ", error);
            return res.status(500).json({ message: "Internal server error" });
          }

         // Si le mot de passe est valide, alors on génère un token JWT et on le retourne dans la réponse

         if (!isMatch) {
          return res.status(401).json({ message: "Invalid email or password" });
        } 
         // on utilise ici comme parametre de création du token le "email" et la clé "secret"
         let token = jwt.sign({ email }, secret);
         res.json({ message: "Login successful", token });

        });
      });
   });  */
   //___________________________________________________________________________________________
//____________________________________________________________________________________________

//____________________________________________________________________________________________


