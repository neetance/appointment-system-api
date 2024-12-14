import Professor from "../models/ProfessorModel";
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

export async function registerProfessor(req, res) {
    try {
        const {name, professor_Id, email, password, department, phone} = req.body;
        const professorExists = await Professor.findOne({ professor_Id });

        if (professorExists) 
            return res.status(400).send("Already registered" );
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const professor = new Professor({
            name,
            professor_Id,
            email,
            password: hashedPassword,
            department,
            phone
        });
        await professor.save();

        res.status(201).send("Registered successfully");
    }
    catch (err) {
        res.status(500).send(`error: ${err}`);
    }
}

export async function loginProfessor(req, res) {
    try {
        const { professor_Id, password } = req.body;
        const professor = await Professor.findOne({ professor_Id });    
        if (!professor) 
            return res.status(400).send("Invalid professor ID" );   

        const isPasswordCorrect = await bcrypt.compare(password, professor.password);
        if (!isPasswordCorrect)
            return res.status(400).json("Invalid password");

        const token = jwt.sign({ professor_Id: professor.professor_Id }, process.env.JWT_SECRET_KEY);
        res.status(200).json({message: "Logged in successfully", token});
    }
    catch (err) {
        res.status(500).send(`error: ${err}`);
    }
}

export async function getProfessorDetails(req, res) {
    try {
        const professor_Id = req.user.professor_Id;
        const professor = await Professor.findOne({ professor_Id });
        if (!professor) 
            return res.status(400).send("Invalid professor ID");

        res.status(200).json(professor);
    }
    catch (err) {
        res.status(500).send(`error: ${err}`);
    }
}

export async function updateProfessor(req, res) {
    try {
        const professor_Id = req.user.professor_Id;
        const professor = await Professor.findOne({ professor_Id });
        if (!professor) 
            return res.status(400).send("Invalid professor ID");

        const { name, email, department, phone } = req.body;
        if (name) professor.name = name;
        if (email) professor.email = email;
        if (department) professor.department = department;
        if (phone) professor.phone = phone;

        await professor.save();
        res.status(200).send("Updated successfully");
    }
    catch (err) {
        res.status(500).send(`error: ${err}`);
    }
}

export async function deleteProfessor(req, res) {
    try {
        const professor_Id = req.user.professor_Id;
        const professor = await Professor.findOne({ professor_Id });
        if (!professor) 
            return res.status(400).send("Invalid professor ID");

        await professor.delete();
        res.status(200).send("Deleted successfully");
    }
    catch (err) {
        res.status(500).send(`error: ${err}`);
    }
}

export async function getAllProfessors(req, res) {
    try {
        const professors = await Professor.find();
        res.status(200).json(professors);
    }
    catch (err) {
        res.status(500).send(`error: ${err}`);
    }
}
