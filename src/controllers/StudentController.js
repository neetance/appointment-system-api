import Student from "../models/StudentModel.js";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import dotenv from 'dotenv';

dotenv.config();

export function authenticateToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token) 
        return res.status(401).send("Not authorized");
    
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) 
            return res.status(403).send("Invalid token");
        
        req.user = user;
        next();
    });
}

export async function registerStudent(req, res) {
    try {
        const {roll_no, name, email, password, branch, phone} = req.body;
        const studentExists = await Student.findOne({ roll_no });

        if (studentExists) 
            return res.status(400).send("Already registered");
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const student = new Student({
            roll_no,
            name,
            email,
            password: hashedPassword,
            branch,
            phone
        });
        await student.save();

        res.status(201).send("Registered successfully");
    }
    catch (err) {
        res.status(500).send(`error: ${err}`);
    }
}

export async function loginStudent(req, res) {
    try {
        const { roll_no, password } = req.body;
        const student = await Student.findOne({ roll_no });
        if (!student) 
            return res.status(400).json({ message: "Invalid roll number" });
        
        const isPasswordCorrect = await bcrypt.compare(password, student.password);
        if (!isPasswordCorrect)
            return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign({ roll_no: student.roll_no }, process.env.JWT_SECRET_KEY);
        res.status(200).json({message: "Logged in successfully", token});
    }
    catch (err) {
        res.status(500).send(`error: ${err}`);
    }
}

export async function getStudentDetails(req, res) {
    try {
        const roll_no = req.user.roll_no;
        const student = await Student.findOne({ roll_no});

        if (!student)
            return res.status(404).send("Invalid roll number");

        res.status(200).json(student);
    }
    catch (err) {
        res.status(500).send(`error: ${err}`);
    }
}

export async function updateStudent(req, res) {
    try {
        const roll_no = req.user.roll_no;
        const student = await Student.findOne({ roll_no });

        if (!student)
            return res.status(404).send("Invalid roll number");

        const { name, email, branch, phone } = req.body;
        if (name) student.name = name;
        if (email) student.email = email;
        if (branch) student.branch = branch;
        if (phone) student.phone = phone;

        await student.save();
        res.status(200).send("Updated successfully");
    }
    catch (err) {
        res.status(500).send(`error: ${err}`);
    }
}

export async function deleteStudent(req, res) {
    try {
        const roll_no = req.user.roll_no;
        const student = await Student.findOne({ roll_no });

        if (!student)
            return res.status(404).send("Invalid roll number");

        await student.delete();
        res.status(200).send("Deleted successfully");
    }
    catch (err) {
        res.status(500).send(`error: ${err}`);
    }
}

export async function getAllStudents(req, res) {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    }
    catch (err) {
        res.status(500).send(`error: ${err}`);
    }
}
