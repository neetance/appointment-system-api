import express from 'express';
import { registerProfessor, loginProfessor, getProfessorDetails, getAllProfessors, updateProfessor, deleteProfessor } from '../controllers/ProfessorController.js';
import { authenticateToken } from '../controllers/StudentController.js';
import { addTimeSlot, getAllFreeTimeSlots, professorCancelAppointment, getProfessorAppointments } from '../controllers/AppointmentController.js';

const router = express.Router();

router.post('/register', registerProfessor) // Register a professor
router.post('/login', loginProfessor) // Login a professor
router.get('/details', authenticateToken, getProfessorDetails) // Get details of a professor
router.get('/', getAllProfessors) // List all professors
router.patch('/update', authenticateToken, updateProfessor) // Update professor details
router.delete('/delete', authenticateToken, deleteProfessor) // Delete a professor
router.post('/time-slots', authenticateToken, addTimeSlot) // Add a free time slot for appointments
router.get('/time-slots', getAllFreeTimeSlots) // Get all free time slots of a professor
router.delete('/appointments', authenticateToken, professorCancelAppointment) // Cancel an appointment with a student
router.get('/appointments', authenticateToken, getProfessorAppointments) // Get all pending appointments of a professor

export default router;
