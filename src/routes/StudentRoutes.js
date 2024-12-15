import express from 'express';
import { registerStudent, loginStudent, getStudentDetails, updateStudent, getAllStudents, deleteStudent, authenticateToken } from '../controllers/StudentController.js';
import { getStudentAppointments, bookAppointment, studentCancelAppointment } from '../controllers/AppointmentController.js';

const router = express.Router();

router.post('/register', registerStudent)
router.post('/login', loginStudent)
router.get('/details', authenticateToken, getStudentDetails)
router.get('/', getAllStudents)
router.patch('/update', authenticateToken, updateStudent)
router.delete('/delete', authenticateToken, deleteStudent)
router.get('/appointments', authenticateToken, getStudentAppointments)
router.post('/appointments', authenticateToken, bookAppointment)
router.delete('/appointments', authenticateToken, studentCancelAppointment)

export default router;
