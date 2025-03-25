const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tarif = sequelize.define('Tarif', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type_jour: {
        type: DataTypes.ENUM('weekend', 'jour ordinaire'),
        allowNull: false
    },
    tarif: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = Tarif; 