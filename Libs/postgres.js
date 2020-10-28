require('dotenv').config();

const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');
const postgres = {};

const sequelize = new Sequelize(process.env.POSTGRES_URL, { dialect: 'postgres', logging: false });

module.exports.authenticate = function () {
    sequelize.authenticate()
        .then(() => {})
        .catch((err) => {
            console.error('Unable to connect to the database:', err);
        });
}

sequelize.sync().then(() => { })


const modelsPath = __dirname + '/../Models';
fs
    .readdirSync(modelsPath)
    .forEach((file) => {
        let model = require(path.join(modelsPath, file))(sequelize, Sequelize.DataTypes);
        postgres[model.name] = model
    })

postgres.sequelize = sequelize
postgres.Sequelize = Sequelize

module.exports.postgres = postgres
