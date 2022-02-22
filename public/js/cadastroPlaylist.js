async function listarPlaylists() {
    userid = document.getElementById("userid").value
    app = document.getElementById("app").value
    
    if(app == "spotify") {
        try {
            playlist_list_cd.innerHTML = ''
            await fetch('http://localhost:8081/v1/spotifyplaylists/' + userid)
            .then(response => {
                response.json().then((data) => {
                    dados = JSON.parse(data)
                    dados.items.forEach(function selectplaylists(playlist) {
                        if(typeof(playlist.images[0]) == undefined){
                            playlisturl = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png"
                        }
                        else {
                            playlisturl = playlist.images[0].url
                        }
                        appname = "spotify"
                        getPlaylists(playlist.id, playlisturl, playlist.tracks.total, playlist.owner.display_name, playlist.name, playlist.collaborative, appname)
                    })
                })
            })
        } catch (error) {
            console.log(error)
        }
    }
}

function getPlaylists(id, imageurl, tracksqnt, owner, name, collaborative, appname) {
    payload = id+","+imageurl+","+tracksqnt+","+owner+","+name+","+collaborative+","+appname
    //"{" + "\"id\":"+ id + ", \"name\":"+ name + ", \"imageurl\":" + imageurl + ", \"owner\":" + owner + ", \"trackqnt\":" + tracksqnt + ", \"collaborative\":" + collaborative + "}"
    var block = document.createElement('div');
    block.classList.add('playlist_block');
    block.innerHTML = "<img class=\"album_icon\" src=" + imageurl + " alt=\"Album Cover\">" 
    + "<div class=playlist_item>" + name + "</div>"
    + "<div class=playlist_item>Tracks: "+ tracksqnt +"</div>"
    + "<div class=playlist_item>" + owner +"</div>"
    + "<div class=playlist_item>Collab: "+ collaborative +"</div>"
    + "<input type=\"checkbox\" name=\"playlistGroup\" value='" + payload + "' id=\"r1\">";
    
    playlist_list_cd.appendChild(block);
}
