const express = require('express');
const router = express.Router();
const Usuario = require('../../models/usuarios');
const Playlist= require('../../models/playlists');
const bcrypt = require('bcryptjs');


//-------------------usuario-----------------------------
router.get("/usuario/:username", function(req, res) {
    username = req.params.username
    Usuario.findOne({where: {username: username}}).then((usuario) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(usuario);
    })
});

router.get("/usuario/id/:id", function(req, res) {
    id = req.params.id
    Usuario.findOne({where: {id: id}}).then((usuario) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(usuario);
    })
});

router.post("/cadastrousuario", async function(req, res) {

    var novoUsuario = Usuario.build({
        username: req.body.username,
        email: req.body.email,
        nome: req.body.nome,
        password: req.body.password
    });

    bcrypt.genSalt(10, (erro, salt) => {
        bcrypt.hash(novoUsuario.password, salt, (erro, hash) => {
            if(erro) {
                console.log(erro)
                res.status(400).end('ERRO!')
            }
            novoUsuario.password = hash

            novoUsuario.save().then(() => {
                res.status(200).end('sucesso!')
            }).catch((erro) => {
                console.log(erro)
                res.status(400).end('ERRO!')
            });
        })
    });
}) 

router.delete("/deletarconta", function(req,res) {
    try {
        Usuario.destroy({
            where: {
                id: req.body.id
            }
        })
        res.status(200).end('sucesso!')
    } catch (error) {
        console.log(error)
        res.status(400).end('ERRO!')
    }
})

router.put('/mudarsenha', function(req,res) {
    try {
        Usuario.update({password: req.body.newpassword}, {where: {id: req.body.id}})

        res.status(200).end('sucesso!')
    } catch(error) {
        console.log(error)
        res.status(400).end('ERRO!')
    }

})
//--------------------------------------------

//-----------------Playlists---------------------
router.post("/cadastrarplaylist", function(req, res) {
    try {  
        if (Array.isArray(req.body.playlistGroup)) {
            req.body.playlistGroup.forEach(function saveplaylists(data) {
                playlist = data.split(",");
                var novaPlaylist = Playlist.build({
                    appid: playlist[0],
                    totaltracks: playlist[2],
                    collaborative: playlist[5],
                    name: playlist[4],
                    owner: playlist[3],
                    insertedby: req.body.userid,
                    imageURL: playlist[1],
                    appname: playlist[6]
                });
                novaPlaylist.save()
            })
        } else {
            playlist = req.body.playlistGroup.split(",");
            var novaPlaylist = Playlist.build({
                appid: playlist[0],
                totaltracks: playlist[2],
                name: playlist[4],
                collaborative: playlist[5],
                owner: playlist[3],
                insertedby: req.body.userid,
                imageURL: playlist[1],
                appname: playlist[6]
            });
            novaPlaylist.save()
        }

        res.status(200).end('sucesso!')
    } catch(error) {
        console.log(error)
        res.status(400).end('ERRO!')
    }
})

router.get("/playlists", async function(req, res) {
    try {
        playlists = await Playlist.findAll({
            attributes: ['imageURL','name', 'totaltracks', 'owner', 'collaborative', 'appname', 'appid', 'insertedby'],
            raw: true
        })
        res.json(playlists)
    } catch (erro){
        console.log(erro)
        res.status(400).end('ERRO!')
    }
})

router.get("/playlists/:userid", async function(req, res) {
    try {
        playlists = await Playlist.findAll({
            attributes: ['imageURL', 'name', 'totaltracks', 'owner', 'collaborative', 'appname', 'appid'],
            where: {insertedby: req.params.userid},
            include: [{
                model: Usuario,
                required: true
            }]
        })
        res.json(playlists)
    } catch (erro){
        console.log(erro)
        res.status(400).end('ERRO!')
    }
})

router.delete("/deletarplaylist", function(req, res) {
    try {
        Playlist.destroy({
            where: {
                appid: req.body.playlistid
            }
        })

        res.status(200).end('sucesso!')
    } catch (erro) {
        console.log(erro)
        res.status(400).end('ERRO!')
    }
})

router.delete("/deletarplaylistusuario", function(req, res) {
    try {
        Playlist.destroy({
            where: {
                appid: req.body.playlistid,
                insertedby: req.body.userid
            }
        })

        res.status(200).end('sucesso!')
    } catch (erro) {
        console.log(erro)
        res.status(400).end('ERRO!')
    }
})









//--------------------------------------------------

module.exports = router;