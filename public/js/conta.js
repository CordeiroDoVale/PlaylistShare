async function encontrarPlaylistsUsuario() {
    try {
        var userid = localStorage.getItem('userid');

        await fetch('http://localhost:8081/v1/playlists/' + userid)
        .then(response => {
            response.json().then((data) => {
                data.forEach(function selectplaylists(playlist) {
                    if(playlist.appname == 'spotify') {
                        displayPlaylistsSpotify(playlist.appid, playlist.imageURL, playlist.totaltracks, playlist.owner, playlist.name, playlist.collaborative)
                    } else {
                        console.log("Outros aplicativos ainda não adicionados!") // Aqui entra um if else dos outros aplicativos
                    }
                })
            })
        })
    } catch (error) {
        console.log(error)
    }
}

encontrarPlaylistsUsuario()

function displayPlaylistsSpotify(appid, imageurl, tracksqnt, owner, name, collaborative) {
    var block = document.createElement('div');
    block.classList.add('playlist_block');

    block.innerHTML = ""
    + "<img class=\"album_icon\" src=" + imageurl + " alt=\"Album Cover\">" 
    + "<div class=playlist_item>" + name + "</div>"
    + "<div class=playlist_item>Tracks: "+ tracksqnt +"</div>"
    + "<div class=playlist_item>" + owner +"</div>"
    + "<div class=playlist_item>Collab: "+ ((collaborative === false) ? "Não" : "Sim") +"</div>"
    + "<button type=\"submit\" class=delete_btn><i class=\"fas fa-trash\" appid=\"" + appid.toString() + "\" onclick=\"deletePlaylist(event)\"></i></button>"

    document.getElementById("playlist_list").insertBefore(block, document.getElementById("playlist_list").firstChild);
}


//Botão de deletar:
var modal = document.getElementById("modal");

var deletarBtn = document.getElementById("deletarBtn");
var closeBtn = document.getElementById("close");

deletarBtn.onclick = function() {
    modal.style.display = "block";
}

closeBtn.onclick = function() {
    modal.style.display = "none";
}

async function deletarUsuario() {
    const deleteMethod = {
        method: 'DELETE',
        redirect: 'follow'
    }

    try {
        await fetch('http://localhost:8081/v1/deletarconta', deleteMethod)
        .then(function(response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response;
        })
        .then(() => {
            location.replace("http://localhost:8081/v1/home/sucessdelete")
        })
    } catch (error) {
        location.replace("http://localhost:8081/v1/conta/fail")
        console.log(error)
    }
}

//botão de mudar senha:
var modal2 = document.getElementById("modalmudar");

var mudarBtn = document.getElementById("mudarBtn");
var closemudarBtn = document.getElementById("closemudar");

mudarBtn.onclick = function() {
    modal2.style.display = "block";
}

closemudarBtn.onclick = function() {
    modal2.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    if (event.target == modal2) {
        modal2.style.display = "none";
    }
}

async function mudarSenhaUsuario() {
    novasenha = document.getElementById("password").value
    novasenhaconfirm = document.getElementById("passwordconfirm").value

    if(novasenha == novasenhaconfirm && novasenha != "") {
    
        const putMethod = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({password: novasenha })
        }
    
        try {
            await fetch('http://localhost:8081/v1/mudarsenha', putMethod)
            .then(function(response) {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response;
            })
            .then(() => {
                location.replace("http://localhost:8081/v1/conta/success")
            })
        } catch (error) {
            location.replace("http://localhost:8081/v1/conta/fail")
            console.log(error)
        }
    } else {
        location.replace("http://localhost:8081/v1/conta/fail")
    }

}

async function deletePlaylist(event) {
    let appid = event.target.attributes.appid.value;

    const deleteMethod = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({playlistid: appid})
    }

    try {
        await fetch('http://localhost:8081/v1/deletarplaylistusuario', deleteMethod)
        .then(function(response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response;
        })
        .then(() => {
            const delay = ms => new Promise(res => setTimeout(res, ms));
            delay(500);
            location.reload()
        })
    } catch (error) {
        console.log(error)
    }
}