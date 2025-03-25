const express = require('express');
const router = express.Router();
const tarifController = require('../controllers/tarifController');

router.get('/', tarifController.getAllTarifs);
router.post('/', tarifController.createTarif);
router.put('/:id', tarifController.updateTarif);
router.delete('/:id', tarifController.deleteTarif);

module.exports = router; 