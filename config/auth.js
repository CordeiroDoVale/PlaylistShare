const localStrategy = require("passport-local").Strategy
const bcrypt = require('bcryptjs');
const request = require('request');

module.exports = async function(passport) {
    await passport.use(new localStrategy({usernameField: 'username', passwordField: 'password'}, (username, password, done) =>{

        var requestOptions = {
            url: 'http://localhost:8082/api/v1/usuario/' + username
        };

        request.get(requestOptions, function(error, response, body) {
            usuario = JSON.parse(body)
            try {
                if(!error && response.statusCode === 200) {
                    if(!usuario) {
                        return done(null, false, {message: "essa conta não existe"})
                    }
        
                    bcrypt.compare(password, usuario.password, (erro, igual) => {
                        if(igual) {
                            return done(null, usuario)
                        } else {
                            return done(null, false, {message: "Senha incorreta"})
                        }
                    })
                }
                else {
                    console.log(response.statusCode)
                    return done(null, false, {message: "Falha na requisição!"})
                }
            } catch {
                console.log("Erro na requisição do usuario para autenticação, verifique que database está conectada e que a rota de request está correta!")
                return done(null, false, {message: "Erro do servidor! Tente novamente mais tarde!"})
            }
        })
    }))

    await passport.serializeUser((usuario, done) => {
        done(null, usuario)
    })

    await passport.deserializeUser((serialusuario, done) => {
        var requestOptions = {
            url: 'http://localhost:8082/api/v1/usuario/id/' + serialusuario.id
        };
        request.get(requestOptions, function(error, response, body) {
            usuario = JSON.parse(body)
            
            if(!error && response.statusCode === 200) {
                done(null, usuario)
            }
            else {
                console.log(response.statusCode)
                done(err, null, { message: 'Erro ao descerializar com API desconectada' });
            }
            
        })
    })
}