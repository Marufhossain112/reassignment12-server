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
    const usersCollections = client.db("bikesDatabase").collection("users");
    const addProductCollections = client
      .db("bikesDatabase")
      .collection("addproducts");
    const advertiseProductCollections = client
      .db("bikesDatabase")
      .collection("advertiseProducts");
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
      const result = await bikesCollections.findOne(query);
      res.send(result);
    });
    // post users from client to database
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollections.insertOne(user);
      // console.log(result);
      res.send(result);
    });
    // get all users
    app.get("/users", async (req, res) => {
      const query = {};
      const result = await usersCollections.find(query).toArray();
      res.send(result);
    });

    // get all buyers
    app.get("/users/buyer/", async (req, res) => {
      const query = { role: "buyer" };
      const result = await usersCollections.find(query).toArray();
      res.send(result);
    });
    // get all seller
    app.get("/users/seller/", async (req, res) => {
      const query = { role: "seller" };
      const result = await usersCollections.find(query).toArray();
      res.send(result);
    });
    // create api for add a product
    app.post("/dashboard/addproduct", async (req, res) => {
      const user = req.body;
      const result = await addProductCollections.insertOne(user);
      // console.log(result);
      res.send(result);
    });
    // create api for get addproduct data
    app.get("/dashboard/addproduct", async (req, res) => {
      const query = {};
      const result = await addProductCollections.find(query).toArray();
      // console.log(result);
      res.send(result);
    });
    // create api for delete a  product data
    app.delete("/dashboard/addproduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await addProductCollections.deleteOne(query);
      res.send(result);
    });
    // create api for advertising unsold product
    app.get("/advertiseproduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await addProductCollections.findOne(query);
      console.log(result);
      res.send(result);
    });
    //create api for advertise data post
    app.post("/advertiseproduct", async (req, res) => {
      const user = req.body;
      const result = await advertiseProductCollections.insertOne(user);
      console.log(result);
      res.send(result);
    });
    app.get("/advertiseproduct", async (req, res) => {
      const query = {};
      const result = await advertiseProductCollections.find(query).toArray();
      console.log(result);
      res.send(result);
    });
    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollections.findOne(query);
      res.send({ isAdmin: user?.role === "admin" });
    });
    app.get("/users/seller/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollections.findOne(query);
      res.send({ isSeller: user?.role === "seller" });
    });
    app.get("/users/buyer/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollections.findOne(query);
      res.send({ isBuyer: user?.role === "buyer" });
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
