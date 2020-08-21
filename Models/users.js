const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');


// Generate new token
function newToken(user){
    const token = jwt.sign({ sub: user.id }, process.env.TOKEN_SECRET, { expiresIn: '7d' });
    user.token = token;
}

// Hash password
function hashPassword(user) {
    const password = user.password || user.attributes.password;
    const salt = bcrypt.genSaltSync();
    if (!user.changed('password')) return null;
    user.password = bcrypt.hashSync(password, salt);
}

// Compare password
function validPassword (password) {
    return bcrypt.compareSync(password, this.password);
}

// Model Users
module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('users', {
        firstname: {
            type: DataTypes.STRING,
            allowNull: true
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        token: {
            type: DataTypes.STRING,
            allowNull: true
        },
    });

    Users.beforeCreate(hashPassword);
    Users.beforeCreate(newToken);
    Users.beforeUpdate(hashPassword);
    Users.prototype.validPassword = validPassword;

    return Users;
};
