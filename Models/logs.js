const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

// Model Users
module.exports = (sequelize, DataTypes) => {
    const Logs = sequelize.define('logs', {
        method: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        request: {
            type: DataTypes.STRING,
            allowNull: false
        },
        payload: {
            type: DataTypes.JSONB,
            allowNull: true
        },
        response: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });

    return Logs;
};
