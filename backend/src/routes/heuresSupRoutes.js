const express = require('express');
const router = express.Router();
const heuresSupController = require('../controllers/heuresSupController');

router.get('/', heuresSupController.getAllHeuresSup);
router.post('/', heuresSupController.createHeuresSup);
router.put('/:id', heuresSupController.updateHeuresSup);
router.delete('/:id', heuresSupController.deleteHeuresSup);
router.get('/calculer/:employeId/:dateDebut/:dateFin', heuresSupController.calculerMontantHeuresSup);

module.exports = router; 