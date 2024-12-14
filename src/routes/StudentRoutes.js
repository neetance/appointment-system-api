import express from 'express';
import { registerStudent, loginStudent, getStudentDetails, updateStudent, getAllStudents, deleteStudent, authenticateToken } from '../controllers/StudentController.js';

const router = express.Router();
router.post('/register', registerStudent)
router.post('/login', loginStudent)
router.get('/getStudent', authenticateToken, getStudentDetails)
router.get('/', getAllStudents)
router.patch('/updateStudent', authenticateToken, updateStudent)
router.delete('/deleteStudent', authenticateToken, deleteStudent)

export default router;
