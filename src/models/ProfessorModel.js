import mongoose from "mongoose";

const professorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    professor_Id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    department: { type: String, required: true }
});

const Professor = mongoose.model('Professor', professorSchema);
export default Professor;
