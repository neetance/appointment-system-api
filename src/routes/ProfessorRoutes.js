const express = require('express');
import { registerProfessor, loginProfessor, getProfessorDetails, getAllProfessors, updateProfessor, deleteProfessor } from '../controllers/ProfessorController';
import { authenticateToken } from '../controllers/StudentController';

const router = express.Router();
router.post('/register', registerProfessor)
router.post('/login', loginProfessor)
router.get('/professor', authenticateToken, getProfessorDetails)
router.get('/', getAllProfessors)
router.patch('/professor', authenticateToken, updateProfessor)
router.delete('/professor', authenticateToken, deleteProfessor)
