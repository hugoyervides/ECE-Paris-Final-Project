var mongodb = require ('mongodb')
const MongoClient = mongodb.MongoClient
// Connection URL
const url: string = 'mongodb://localhost:27017';
// Database Name
const dbName: string = 'mydb';
// Create a new MongoClient
const client = new MongoClient(url, { useNewUrlParser: true });
//Declaracion de la interfaz para meter datos dentro de la base de datos MongoDb
interface Metric {
    timestamp: string;
    value: number;
}
// Funcion para establecer conexion con MongoDB
client.connect(function(err:any) {
  if(err){
    throw err
  }
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  // Do something ...
//INSERT DOCUMENT!!!
findDocuments(db, function() {client.close()});
//client.close();
});
//Funcion para insertar datos en la base de datos MongoDB
const insertDocument = function(db: any, callback: any) {
    // Get the documents collection
    const collection = db.collection('documents');
    // Insert some document
    const metric: Metric = {
      timestamp: new Date().getTime().toString(),
       value: 42
     }
    collection.insertOne(
      metric,
      function(err: any, result: any) {
        if(err)
          throw err
        console.log("Document inserted into the collection");
        callback(result);
    });
}
//Funcion para insertar muchos documentos en la base de datos
const insertManyDocuments = function(db: any, callback: any) {
    // Get the documents collection
    const collection = db.collection('documents');
    // Insert some documents
    const metrics: Metric[] = [
      { timestamp: new Date().getTime().toString(), value: 11},
      { timestamp: new Date().getTime().toString(), value: 22},
      { timestamp: new Date().getTime().toString(), value: 22},
    ]
    collection.insertMany(
      metrics,
      function(err: any, result: any) {
        if(err)
          throw err
        console.log("Document inserted into the collection");
        callback(result);
    });
}
//Funcion para sacar todos los elementos de la collection
const findDocuments = function(db: any, callback: any) {
    // Get the documents collection
    const collection = db.collection('documents');
    // Find some documents
    collection.find({}).toArray(function(err: any, docs: object) {
      if(err)
        throw err
      console.log("Found the following documents");
      console.log(docs)
      callback(docs);
    });
}