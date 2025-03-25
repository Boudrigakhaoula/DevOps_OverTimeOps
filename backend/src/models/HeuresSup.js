const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Employe = require('./Employe');

const HeuresSup = sequelize.define('HeuresSup', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    employe_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Employe,
            key: 'id'
        }
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    nb_heures: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    timestamps: false
});

HeuresSup.belongsTo(Employe, { foreignKey: 'employe_id' });
Employe.hasMany(HeuresSup, { foreignKey: 'employe_id' });

module.exports = HeuresSup; 