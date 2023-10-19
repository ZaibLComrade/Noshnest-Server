const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb")
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

const database = client.db("NoshNest");

const productsCollection = database.collection("products");
const brandsCollection = database.collection("brands");
const usersCollection = database.collection("users");

app.post("/products", async(req, res) => {
	const product = req.body;
	const result = await productsCollection.insertOne(product);
	res.send(result);
})

app.post("/users", async(req, res) => {
	const userData = req.body;
	const result = await usersCollection.insertOne(userData)
	res.send(result);
})

app.patch("/users/:email", async(req, res) => {
	const email = req.params.email;
	const updatedData = req.body;
	const filter = { email };
	const doc = {
		$set: {
			lastSignInTime: updatedData.lastSignInTime,
			cart: updatedData?.cart,
		}
	}
	const result = await usersCollection.updateOne(filter, doc);
	res.send(result);
})

app.put("/products/:id", async(req, res) => {
	const id = req.params.id;
	const updatedProduct = req.body;
	const filter = { _id: new ObjectId(id) };
	const updatedDoc = {
		$set: {
			name: updatedProduct.name,
			type: updatedProduct.type,
			brand_name: updatedProduct.brand_name,
			price: updatedProduct.price,
			short_description: updatedProduct.short_description,
			rating: updatedProduct.rating,
			img: updatedProduct.img,
		}
	}
	const result = await productsCollection.updateOne(filter, updatedDoc)
	res.send(result);
})

app.get("/users", async(req, res) => {
	const users = await usersCollection.find().toArray();
	res.send(users);
})

app.get("/brands", async(req, res) => {
	const brands = await brandsCollection.find().toArray();
	res.send(brands);
})


app.get("/products/details/:id", async(req, res) => {
	const id = req.params.id;
	const query = { _id: new ObjectId(id) };
	const productDetails = await productsCollection.findOne(query);
	res.send(productDetails);
})

app.get("/products/brands/:brand", async(req, res) => {
	const brand_id = req.params.brand;
	const brandQuery = { id: brand_id }
	const brandInfo = await brandsCollection.findOne(brandQuery);
	const productQuery = { brand_name: brandInfo.brand_name };
	const productInfo = await productsCollection.find(productQuery).toArray();
	res.send(productInfo);
}) 


app.get("/", (req, res) => {
	res.send("Server is running");
})

app.listen(port)
