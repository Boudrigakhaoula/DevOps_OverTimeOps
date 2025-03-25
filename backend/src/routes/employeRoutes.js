const express = require('express');
const router = express.Router();
const employeController = require('../controllers/employeController');

// Route pour obtenir la liste des employés
router.get('/', employeController.getAllEmployes);

// Route pour obtenir les heures supplémentaires d'un employé sur une période
router.get('/:employeId/heures-sup/:dateDebut/:dateFin', employeController.getHeuresSupByEmploye);

// Route pour obtenir un employé par ID
router.get('/:id', employeController.getEmployeById);

// Route pour créer un nouvel employé
router.post('/', employeController.createEmploye);

// Route pour mettre à jour un employé
router.put('/:id', employeController.updateEmploye);

// Route pour supprimer un employé
router.delete('/:id', employeController.deleteEmploye);

module.exports = router; 