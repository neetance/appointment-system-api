import express from 'express';
import { registerProfessor, loginProfessor, getProfessorDetails, getAllProfessors, updateProfessor, deleteProfessor } from '../controllers/ProfessorController.js';
import { authenticateToken } from '../controllers/StudentController.js';

const router = express.Router();
router.post('/register', registerProfessor)
router.post('/login', loginProfessor)
router.get('/getProf', authenticateToken, getProfessorDetails)
router.get('/', getAllProfessors)
router.patch('/updateProf', authenticateToken, updateProfessor)
router.delete('/deleteProf', authenticateToken, deleteProfessor)

export default router;
