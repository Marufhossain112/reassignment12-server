const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
// middleware
app.use(cors());
app.use(express.json());
// port
const port = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("I am running on the home of the Server.");
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@cluster0.efpjwcu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const bikesCollections = client
      .db("bikesDatabase")
      .collection("bikesCollection");
    // get all bikes data from database
    app.get("/allbikes", async (req, res) => {
      const query = {};
      const cursor = await bikesCollections.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // get specific bikes category data from database
    app.get("/allbikes/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const cursor = await bikesCollections.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => {
  console.log(err);
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
