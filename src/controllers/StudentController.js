import Student from "../models/StudentModel.js";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import dotenv from 'dotenv';

dotenv.config();

/**
 * @dev Middleware function used for authentication of users using jsonWebToken
 * NOTE 1. The token must be passed in the header as 'authorization'
 *      2. Used in every request that requires authentication
 */

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

/**
 * @dev Used to register a student
 */

export async function registerStudent(req, res) {
    try {
        const {roll_no, name, email, password, branch} = req.body;
        const studentExists = await Student.findOne({ roll_no });

        if (studentExists) 
            return res.status(400).send("Already registered");
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const student = new Student({
            roll_no,
            name,
            email,
            password: hashedPassword,
            branch
        });
        await student.save();

        res.status(201).json({
            mesage: "Registered successfully",
            body: {
                roll_no: student.roll_no,
                name: student.name,
                email: student.email,
                branch: student.branch
            }
        });
    }
    catch (err) {
        res.status(500).send(`error: ${err}`);
    }
}

/**
 * @dev Used to login a student
 */

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

/**
 * @dev Used to get the details of a student
 * NOTE Requires authentication(can only be accessed by a student)
 */

export async function getStudentDetails(req, res) {
    try {
        const roll_no = req.user.roll_no;
        const student = await Student.findOne({ roll_no});

        if (!student)
            return res.status(404).send("Invalid roll number");

        res.status(200).json({
            roll_no: student.roll_no,
            name: student.name,
            email: student.email,
            branch: student.branch
        });
    }
    catch (err) {
        res.status(500).send(`error: ${err}`);
    }
}

/**
 * @dev Used to update the details of a student
 * NOTE Requires authentication(can only be accessed by a student)
 */

export async function updateStudent(req, res) {
    try {
        const roll_no = req.user.roll_no;
        const student = await Student.findOne({ roll_no });

        if (!student)
            return res.status(404).send("Invalid roll number");

        const { name, email, branch } = req.body;
        if (name) student.name = name;
        if (email) student.email = email;
        if (branch) student.branch = branch;

        await student.save();
        res.status(200).send("Updated successfully");
    }
    catch (err) {
        res.status(500).send(`error: ${err}`);
    }
}

/**
 * @dev Used to delete a student
 * NOTE Requires authentication(can only be accessed by a student)
 */

export async function deleteStudent(req, res) {
    try {
        const roll_no = req.user.roll_no;
        const student = await Student.findOne({ roll_no });

        if (!student)
            return res.status(404).send("Invalid roll number");

        await student.deleteOne();
        res.status(200).send("Deleted successfully");
    }
    catch (err) {
        res.status(500).send(`error: ${err}`);
    }
}

/**
 * @dev Used to list all students
 */

export async function getAllStudents(req, res) {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    }
    catch (err) {
        res.status(500).send(`error: ${err}`);
    }
}
