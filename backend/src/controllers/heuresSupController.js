const HeuresSup = require('../models/HeuresSup');
const Tarif = require('../models/Tarif');
const { Op } = require('sequelize');

exports.getAllHeuresSup = async (req, res) => {
    try {
        const heuresSup = await HeuresSup.findAll();
        res.json(heuresSup);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createHeuresSup = async (req, res) => {
    try {
        const heuresSup = await HeuresSup.create(req.body);
        res.status(201).json(heuresSup);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateHeuresSup = async (req, res) => {
    try {
        const heuresSup = await HeuresSup.findByPk(req.params.id);
        if (!heuresSup) {
            return res.status(404).json({ message: 'Heures supplémentaires non trouvées' });
        }
        await heuresSup.update(req.body);
        res.json(heuresSup);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteHeuresSup = async (req, res) => {
    try {
        const heuresSup = await HeuresSup.findByPk(req.params.id);
        if (!heuresSup) {
            return res.status(404).json({ message: 'Heures supplémentaires non trouvées' });
        }
        await heuresSup.destroy();
        res.json({ message: 'Heures supplémentaires supprimées avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.calculerMontantHeuresSup = async (req, res) => {
    try {
        const { employeId, dateDebut, dateFin } = req.params;
        const heuresSup = await HeuresSup.findAll({
            where: {
                employe_id: employeId,
                date: {
                    [Op.between]: [dateDebut, dateFin]
                }
            }
        });

        const tarifs = await Tarif.findAll();
        let montantTotal = 0;

        for (const heure of heuresSup) {
            const jour = new Date(heure.date).getDay();
            const typeJour = jour === 0 || jour === 6 ? 'weekend' : 'jour ordinaire';
            const tarif = tarifs.find(t => t.type_jour === typeJour);
            
            if (tarif) {
                montantTotal += heure.nb_heures * tarif.tarif;
            }
        }

        res.json({ montantTotal });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 