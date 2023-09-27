const express = require("express");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/error-handler");
const app = express();
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5000;
const cors = require("cors");

connectDb(); 
app.use(cors({
    origin: '*'
}));
app.use(express.json())
app.use('/api/contacts', require("../backend/routes/contacts"));
app.use('/api/users', require("../backend/routes/user"));
app.use(errorHandler)

app.listen(port, (req, res) => {
    console.log("APP started");
})