import express from 'express';
import { registerProfessor, loginProfessor, getProfessorDetails, getAllProfessors, updateProfessor, deleteProfessor } from '../controllers/ProfessorController.js';
import { authenticateToken } from '../controllers/StudentController.js';
import { addTimeSlot, getAllFreeTimeSlots, professorCancelAppointment, getProfessorAppointments } from '../controllers/AppointmentController.js';

const router = express.Router();

router.post('/register', registerProfessor)
router.post('/login', loginProfessor)
router.get('/details', authenticateToken, getProfessorDetails)
router.get('/', getAllProfessors)
router.patch('/update', authenticateToken, updateProfessor)
router.delete('/delete', authenticateToken, deleteProfessor)
router.post('/time-slots', authenticateToken, addTimeSlot)
router.get('/time-slots', getAllFreeTimeSlots)
router.delete('/appointments', authenticateToken, professorCancelAppointment)
router.get('/appointments', authenticateToken, getProfessorAppointments)

export default router;
