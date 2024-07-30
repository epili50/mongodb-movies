/**
 * 1. Inicializa esta carpeta para que sea gobernada por NPM
2. Instala los módulos de terceros express, morgan, mongodb y ejs
3. Crea la estructura necesaria para levantar el servidor de Express.

 */
const express = require('express');
const morgan = require ('morgan');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { log } = require('console');

const uri = "mongodb+srv://epili50:epili50@cluster0.uimmq6n.mongodb.net/";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
}
);

// variable global para gestionar nuestra base de datos
let database;

const app = express();

app.set ('view engine', 'ejs');

app.use(morgan('dev'));

app.get('/',  async (req, res) => {
    const movies = database.collection('movies');

    const { title } = req.query;
    console.log("🚀 ~ app.get ~ title:", title)
  
    
    const query = {};

    const options = {
        limit: 10,
        projection: {_id: 0, title: 1, year: 1, poster: 1},
        sort: { year: -1 }
    }

    const documents = await movies.find(query, options).toArray();

    // console.log(documents);

    res.render('index', {
        documents
    })
});


app.listen (process.env. PORT || 3000, async () =>{
    console.log("Servidor escuchando correctamente");

    //cuando levantamos el servidor nos conectamos a mongoDB
    try{
        await client.connect();
        //seleccionamos nuestra bbdd
        database = client.db('sample_mflix')
        // Mensaje de confirmación de que nos hemos conectado a la base de datos
        console.log("Conexión a la base de datos OK.")

    }catch(err){
        console.error(err);
    }

})