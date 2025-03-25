const Tarif = require('../models/Tarif');

exports.getAllTarifs = async (req, res) => {
    try {
        const tarifs = await Tarif.findAll();
        res.json(tarifs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createTarif = async (req, res) => {
    try {
        const tarif = await Tarif.create(req.body);
        res.status(201).json(tarif);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateTarif = async (req, res) => {
    try {
        const tarif = await Tarif.findByPk(req.params.id);
        if (!tarif) {
            return res.status(404).json({ message: 'Tarif non trouvé' });
        }
        await tarif.update(req.body);
        res.json(tarif);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteTarif = async (req, res) => {
    try {
        const tarif = await Tarif.findByPk(req.params.id);
        if (!tarif) {
            return res.status(404).json({ message: 'Tarif non trouvé' });
        }
        await tarif.destroy();
        res.json({ message: 'Tarif supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 