const express = require('express');
import { registerStudent, loginStudent, getStudentDetails, updateStudent, getAllStudents, authenticateToken } from '../controllers/StudentController';

const router = express.Router();
router.post('/register', registerStudent)
router.post('/login', loginStudent)
router.get('/student', authenticateToken, getStudentDetails)
router.get('/', getAllStudents)
router.patch('/student', authenticateToken, updateStudent)
