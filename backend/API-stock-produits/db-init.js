const { Client } = require('pg')

function getClient (){

    const client = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'db-stockproduits',
      password: 'admin',
      port:5432
    });

    client.connect()
    return client
}

module.exports.getClient = getClient
   