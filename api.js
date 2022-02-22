/* Este é o código inicial. dê "node app.js" em um terminal para começar a aplicação */

// Definição de variáveis e módulos necessários
const express = require('express');
const app = express();
const port = 8082;
const bodyParser = require('body-parser');
const api = require("./routes/api/v1.js");
const passport = require("passport");
require("./config/auth")(passport);

//---------------------------------------------------------

// Body Parser:
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Verifica as tabelas do banco de dados, cria elas se não existirem.
(async () => {
    const Usuario = require('./models/usuarios.js');
    const Playlist = require('./models/playlists.js');
    try {
        await Usuario.sync();
        await Playlist.sync();
        console.log("Database Iniciada!");
    } catch (error) {
        console.log(error);
    }
})();
//-------------------------------------------------------------------

//Rotas:
app.use('/api/v1', api);


app.listen(port, function() {
    console.log("servidor API rodando na url http://localhost:"+port);
});