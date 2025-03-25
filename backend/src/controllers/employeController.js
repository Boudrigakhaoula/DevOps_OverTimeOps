const Employe = require('../models/Employe');
const HeuresSup = require('../models/HeuresSup');
const Tarif = require('../models/Tarif');
const { Op } = require('sequelize');

// Récupérer la liste des employés
exports.getAllEmployes = async (req, res) => {
    try {
        const employes = await Employe.findAll();
        res.json(employes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getEmployeById = async (req, res) => {
    try {
        const employe = await Employe.findByPk(req.params.id);
        if (!employe) {
            return res.status(404).json({ message: 'Employé non trouvé' });
        }
        res.json(employe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createEmploye = async (req, res) => {
    try {
        const employe = await Employe.create(req.body);
        res.status(201).json(employe);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateEmploye = async (req, res) => {
    try {
        const employe = await Employe.findByPk(req.params.id);
        if (!employe) {
            return res.status(404).json({ message: 'Employé non trouvé' });
        }
        await employe.update(req.body);
        res.json(employe);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteEmploye = async (req, res) => {
    try {
        const employe = await Employe.findByPk(req.params.id);
        if (!employe) {
            return res.status(404).json({ message: 'Employé non trouvé' });
        }
        await employe.destroy();
        res.json({ message: 'Employé supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer les heures supplémentaires d'un employé sur une période
exports.getHeuresSupByEmploye = async (req, res) => {
    try {
        const { employeId, dateDebut, dateFin } = req.params;
        const heuresSup = await HeuresSup.findAll({
            where: {
                employe_id: employeId,
                date: {
                    [Op.between]: [dateDebut, dateFin]
                }
            },
            include: [{
                model: Employe,
                attributes: ['nom', 'prenom']
            }]
        });
        res.json(heuresSup);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 