
const dbUtils = require('./db-init');

//____________________________________________________________________________________________
//____________________________________________________________________________________________
//____________________________________________________________________________________________

    function addUser (client,newUser,callback){
        let sql = `INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4)`;
        client.query(sql,newUser,callback);
    }

//____________________________________________________________________________________________

    function getAllProducts (client , callback){
        let sql = "SELECT * from products";
        client.query(sql, callback);
    }
//____________________________________________________________________________________________

    function addProduct (client,newData,callback){
        let sql = `INSERT INTO products (name, description, price, stock) VALUES ($1, $2, $3, $4)`;
        client.query(sql,newData,callback);
    }
//____________________________________________________________________________________________

    function getProductById (client,id,callback){
        let sql = 'SELECT * from products WHERE id =$1';
        client.query(sql,id,callback);
    }
//____________________________________________________________________________________________

    function deleteProduct (client,id,callback){
        let sql = 'DELETE from products WHERE id =$1';
        client.query(sql,id,callback);
    }
//____________________________________________________________________________________________

    function updateProductById(client, newData,callback) {
    let sql = 'update products set name=$1,description=$2,price=$3,stock=$4 where id=$5';
    client.query(sql,newData,callback);
    }
//____________________________________________________________________________________________

module.exports.addUser = addUser
module.exports.getAllProducts = getAllProducts
module.exports.addProduct = addProduct
module.exports.getProductById= getProductById
module.exports.deleteProduct= deleteProduct
module.exports.updateProductById = updateProductById

