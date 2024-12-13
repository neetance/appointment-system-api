const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const app = express();
dotenv.config();

const port = process.env.PORT;

app.use(express.json());

const uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error(err));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
