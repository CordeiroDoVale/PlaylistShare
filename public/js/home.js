async function listarPlaylists() {
    try {
        await fetch('http://localhost:8081/v1/playlists')
        .then(response => {
            response.json().then((data) => {
                data.forEach(function selectplaylists(playlist) {
                    if(playlist.appname == 'spotify') {
                        getPlaylistsSpotify(playlist.appid, playlist.imageURL, playlist.totaltracks, playlist.owner, playlist.name, playlist.collaborative, playlist.insertedby)
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

var textoBusca = ""

function buscarPlaylist() {
    textoBusca = document.getElementById("busca-playlist").value;

    document.getElementById("playlist_list").innerHTML = "";

    listarPlaylists();
}

listarPlaylists()

function getPlaylistsSpotify(appid, imageurl, tracksqnt, owner, name, collaborative, insertedby) {
    if (textoBusca != "" && name.search(textoBusca) === -1) {
        return;
    }

    var block = document.createElement('div');
    block.classList.add('playlist_block');

    block.innerHTML = "<img class=\"album_icon\" src=" + imageurl + " alt=\"Album Cover\">" 
    + "<div class=playlist_item>" + name + "</div>"
    + "<div class=playlist_item>Tracks: "+ tracksqnt +"</div>"
    + "<div class=playlist_item>" + owner +"</div>"
    + "<div class=playlist_item>Collab: "+ collaborative +"</div>"
    
    block.onclick = () => {
        showPlaylistDetails(appid, imageurl, tracksqnt, owner, name, collaborative, insertedby);
    };
    
    document.getElementById("playlist_list").insertBefore(block, document.getElementById("playlist_list").firstChild);
}

var appidAtual = "";
var insertedbyAtual = null;

function showPlaylistDetails(appid, imageurl, tracksqnt, owner, name, collaborative, insertedby) {
    var block = document.createElement("div");
    block.classList.add("playlist-details-background");
    block.id = "playlist-details";
    block.addEventListener("click", hidePlaylistDetails)
    
    let eAdmin = parseInt(localStorage.getItem("eAdmin"));
    let userId = parseInt(localStorage.getItem("userId"));
    
    // appidAtual = (' ' + appid).slice(1);
    appidAtual = appid;
    insertedbyAtual = insertedby;

    block.innerHTML = ""
    + "<div class=\"playlist-details-container\" onclick=\"dontHidePlaylistDetails(event)\">"
        + "<div class=\"playlist-details-top\">"
            + "<img src=\"" + imageurl + "\" alt=\"\" height=\"100%\" class=\"playlist-details-image\"/>"
            + "<div>"
                + "<h2>" + name + "</h2>"
                + "<h4>Nº de músicas: " + tracksqnt + "</h4>"
                + "<h4>Dono: " + owner + "</h4>"
                + ((collaborative === false) ? "<h4>Colaborativa? Não</h4>" : "<h4>Colaborativa? Sim</h4>")
            + "</div>"
            + "<div class=\"playlist-details-trash\">"
                + ((eAdmin >= 1 || userId === insertedby) ? "<button class=\"playlist-details-trash-button\" onclick=\"deletePlaylist()\"><img src=\"/assets/images/lixo.png\" alt=\"\" width=\"100%\"/></button>" : "")
            + "</div>"
        + "</div>"
        + "<div class=\"playlist-details-bottom\">"
            + "<a href=\"https://open.spotify.com/playlist/" + appid + "\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"playlist-details-goto-link\"><button class=\"playlist-details-goto-button\">Ir para a playlist!</button></a>"
        + "</div>"
        + "<button class=\"playlist-details-close-button\" onclick=\"hidePlaylistDetails(event)\">X</button>"
    + "</div>";

    document.getElementById("playlist-details-parent").insertBefore(block, document.getElementById("playlist-details-parent").firstChild);
    
    setTimeout(() => {
        document.getElementById("playlist-details").style.opacity = "1";
    }, 1);
}

function hidePlaylistDetails(event) {
    document.getElementById("playlist-details").style.opacity = "0";

    setTimeout(() => {
        document.getElementById("playlist-details").remove();
    }, 250);
}

function dontHidePlaylistDetails(event) {
    event.stopPropagation();
}

async function deletePlaylist() {
    let appid = appidAtual;
    let insertedby = insertedbyAtual;

    const deleteMethod = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({playlistid: appid, insertedby: insertedby})
    }

    try {
        await fetch('http://localhost:8081/v1/deletarplaylist', deleteMethod)
        .then(function(response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response;
        })
        .then(() => {
            location.reload()
        })
    } catch (error) {
        console.log(error)
    }
}