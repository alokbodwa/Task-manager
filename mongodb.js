// CRUD - Create, read, update and Delete

// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;
// const objectID = mongodb.objectID;


// Instead of these 3, we can simply destructure as 
const { MongoClient, ObjectID } = require('mongodb');


const connectionURL = 'mongodb://127.0.0.1:27017'
const database = 'task-manager'

const id = new ObjectID();
console.log(id);
console.log(id.getTimestamp());

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if(error){
        console.log('Unable to connect!!')
    }

    // console.log('Connected correctly');
    const db = client.db(database);
    // db.collection('users').insertOne({
    //     _id: id,
    //     name: 'Vikram',
    //     age: 20
    // }, (error, result) => {
    //     if(error){
    //         return console.log('Unable to connect');
    //     }

    //     console.log(result.ops);
    // })

    // db.collection('users').insertMany([
    //     {
    //         name: 'Alok1',
    //         age: 2354
    //     },
    //     {
    //         name: 'Aman',
    //         age: 56242
    //     }
    // ], (error, result) => {
    //     if(error){
    //         return console.log('Unable to connect');
    //     }
    //     console.log(result.ops);
    // })

    // db.collection('tasks').insertMany([
    //     {
    //         description: 'Exercise done',
    //         complete: true
    //     },
    //     {
    //         description: 'ESC201 assignment',
    //         complete: false
    //     },
    //     {
    //         description: 'Pingala pre-reg',
    //         complete: false
    //     },
    // ], (error, result) => {

    //     if(error){
    //         return console.log('Unable to connect');
    //     }

    //     console.log(result.ops);
    // })

    // // you have to use new ObjectID function to convert the id string to a valid ID that the system can understand
    // // db.collection('users').findOne({ _id: new ObjectID("60704d873aaea62b24fbdc07") }, (error, user) => {
    // //     if(error){
    // //         return console.log('Unable to connect');
    // //     }
    // //     console.log(user);
    // // })

    // db.collection('users').find({ age: 20 }).toArray((error, users) => {
    //     if(error){
    //         return console.log('Unable to connect');
    //     }
    //     console.log(users);
    // })
    // db.collection('users').find({ age: 20 }).count((error, users) => {
    //     if(error){
    //         return console.log('Unable to connect');
    //     }
    //     console.log(users);
    // })

    // find a document
    // db.collection('tasks').findOne({ _id: new ObjectID("6071da51aae47d383cb83b8d")}, (error, task) => {
    //     if(error){
    //         return console.log('Unable to connect');
    //     }
    //     console.log(task);
    // })

    // db.collection('tasks').find({ complete: false }).toArray((error, tasks) => {
    //     if(error){
    //         return console.log('Unable to connect');
    //     }
    //     console.log(tasks);
    // })

    // Update a document
    // const updatePromise = db.collection('users').updateOne({
    //     _id: new ObjectID("6070467ddce13a3690c11e34")
    // },{
    //     // $set: {
    //     //     name: "Alok"
    //     // }
    //     // increments the age by 1
    //     $inc: {
    //         age: 1
    //     }
    // })
    
    // updatePromise.then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // })

    // // Update many
    // const updateManypromise = db.collection('tasks').updateMany({
    //     complete: false
    // },{
    //     $set:{
    //         complete: true
    //     }
    // })

    // updateManypromise.then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // })


    // // deleteMany
    // db.collection('users').deleteMany({
    //     age: 20
    // }).then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // })

    // deleteOne
    // db.collection('tasks').deleteOne({
    //     description: "Pingala pre-reg"
    // }).then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // })


})

