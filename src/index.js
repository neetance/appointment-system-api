import express, { json} from "express";
import dotenv from "dotenv";
import { connect} from "mongoose";
import studentRoutes from './routes/StudentRoutes.js';
import professorRoutes from './routes/ProfessorRoutes.js';

const app = express();
dotenv.config();

const port = process.env.PORT;

app.use(json());

const uri = process.env.MONGO_URI;
connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error(err));

app.use('/students', studentRoutes);
app.use('/professors', professorRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
