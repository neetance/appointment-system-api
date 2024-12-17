import express from 'express';
import { registerStudent, loginStudent, getStudentDetails, updateStudent, getAllStudents, deleteStudent, authenticateToken } from '../controllers/StudentController.js';
import { getStudentAppointments, bookAppointment, studentCancelAppointment } from '../controllers/AppointmentController.js';

const router = express.Router();

router.post('/register', registerStudent) // Register a student
router.post('/login', loginStudent) // Login a student
router.get('/details', authenticateToken, getStudentDetails) // Get details of a student
router.get('/', getAllStudents) // List all students
router.patch('/update', authenticateToken, updateStudent) // Update student details
router.delete('/delete', authenticateToken, deleteStudent) // Delete a student
router.get('/appointments', authenticateToken, getStudentAppointments) // Get all pending appointments of a student
router.post('/appointments', authenticateToken, bookAppointment) // Book an appointment with a professor
router.delete('/appointments', authenticateToken, studentCancelAppointment) // Cancel an appointment with a professor

export default router;
