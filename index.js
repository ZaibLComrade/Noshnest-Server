const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb")
const port = process.env.PORT || 5000;
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.m7nddwt.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	}
})

const products = client.db("products_collection").collection("products")

app.post("/products", async(req, res) => {
	const product = req.body;
	const result = await products.insertOne(product);
	res.send(result);
})

app.get("/", (req, res) => {
	res.send("Server is running");
})

app.listen(port)
