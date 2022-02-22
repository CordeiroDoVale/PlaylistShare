const Seq = require('sequelize');
const database = require('./db.js');

const Usuario = database.define('usuarios', {
    id: {
        type: Seq.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: Seq.STRING(20),
        allowNull: false
    },
    email: {
        type: Seq.STRING(100),
        allowNull: false
    },
    nome: {
        type: Seq.STRING(100),
        allowNull: false
    },
    eAdmin: {
        type: Seq.INTEGER,
        defaultValue: 0
    },
    password: {
        type: Seq.STRING,
        allowNull: false
    }
});

module.exports = Usuario;