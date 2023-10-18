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

const productsCollection = client.db("NoshNest").collection("products");
const brandsCollection = client.db("NoshNest").collection("brands");

app.post("/products", async(req, res) => {
	const product = req.body;
	const result = await productsCollection.insertOne(product);
	res.send(result);
})

app.get("/brands", async(req, res) => {
	const brands = await brandsCollection.find().toArray();
	res.send(brands);
})

app.get("/products/:brand", async(req, res) => {
	const brand_id = req.params.brand;
	const brandQuery = { id: brand_id }
	const brandInfo = await brandsCollection.findOne(brandQuery);
	const productQuery = { brand: brandInfo.brand_name };
	const productInfo = await productsCollection.find(productQuery).toArray();
	res.send(productInfo);
}) 

app.get("/", (req, res) => {
	res.send("Server is running");
})

app.listen(port)
