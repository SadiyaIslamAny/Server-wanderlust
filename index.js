const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dotenv.config()


const uri = process.env.MONGODB_URI;
const app = express()
const port = process.env.PORT;

app.use(cors());
app.use(express.json());


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    await client.connect();
    const db = client.db("wanderlust")
    const destinationCollection = db.collection("destinations")
    const bookingCollection = db.collection("bookings")


    app.get('/destination', async (req, res) => {
      const result = await destinationCollection.find().toArray()
      res.json(result)
    })

    app.post('/destination', async (req, res) => {
      const destinationData = req.body;
      console.log(destinationData)
      const result = await destinationCollection.insertOne(destinationData)
      res.send(result);
    })

    app.get('/destination/:id', async (req, res) => {
      const id = req.params.id;

      const result = await destinationCollection.findOne({
        _id: new ObjectId(id)
      });

      res.send(result);
    });


    app.post('/booking', async(req,res)=>{
      const bookingData = req.body;
      console.log(bookingData);
      const result = await bookingCollection.insertOne(bookingData)
      res.send(result);
    })


    app.patch('/destination/:id', async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body
      console.log(updatedData)
      const result = await destinationCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      );
      res.send(result);
    })

    app.delete('/destination/:id', async (req, res) =>{
      const id = req.params.id;
      const result = await destinationCollection.deleteOne({ _id: new ObjectId(id) },)
      res.send(result)
    })



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


