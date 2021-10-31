const express = require('express')

const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6shna.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)


async function run() {
    try {
        await client.connect();
        const database = client.db("Food-delivery");
        const serviceCollection = database.collection("serviceDetail");
        const addOrderCollection = database.collection("addOrder");
        // const user = { name: 'mahiya mahi', email: 'mahi@gmail.com', descriptio: 'lorem20' }
        // userCollection.insertOne(user)
        //GET API//FIND
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const users = await cursor.toArray();
            res.send(users)
        })

        // Update er joono specefic id find kora/single item er jonno
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const user = await serviceCollection.findOne(query)
            console.log('load user id', id);
            res.send(user);
        })
        //POST API /EXPRESS POST/user client to server to database/ INSERT DOC
        app.post('/services', async (req, res) => {
            //REQ.BODY WE GOT FROM CLIENT SIDE
            const newService = req.body;
            //DATABASE PUSH 
            const result = await serviceCollection.insertOne(newService)

            console.log('Got new user', req.body)
            console.log('added user', result)
            res.send(result)
        });

        //Add an user trying
        app.post('/addOrders', async (req, res) => {
            //REQ.BODY WE GOT FROM CLIENT SIDE
            const addOrder = req.body;
            //DATABASE PUSH 
            const result = await addOrderCollection.insertOne(addOrder)

            console.log('Got new user', req.body)
            console.log('added user', result)
            res.send(result)
        });

        //get an user
        app.get('/addOrders', async (req, res) => {
            const cursor = addOrderCollection.find({});
            const users = await cursor.toArray();
            res.send(users)
        })

        // Update API
        app.put('/addOrders/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: 'approved'
                },

            }
            const result = await addOrderCollection.updateOne(filter, updateDoc, options)
            console.log('updating user', req)
            res.json(result)
        })

        //DELETE API
        app.delete('/addOrders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await addOrderCollection.deleteOne(query)
            console.log('deleting user with id', result);
            res.json(result)
        })
    }



    finally {

    }
}
run().catch(console.dir);















app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log('Example app listening at http://localhost:', port)
})