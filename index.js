const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb")
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.send("Server is running");
})

app.listen(port)
