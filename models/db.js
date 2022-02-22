const dotenv = require('dotenv').config();
const Sequelize = require('sequelize');

const sequelize = new Sequelize (process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
    // desativa o loggin das queries:
    logging: false
});

sequelize.authenticate().then(function(){
    console.log("conectado com sucesso!")
}).catch(function(erro){
    console.log("Falha ao se conectar: "+erro)
});

module.exports = sequelize;