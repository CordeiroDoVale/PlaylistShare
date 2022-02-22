for (var i = 0; i < 4; i++) {
    var block = document.createElement('div');
    block.classList.add('playlist_block');
    block.innerHTML = "<img class=\"album_icon\" src=albumteste.jpg alt=\"Album Cover\">" 
    + "<div class=playlist_item>Musicas do Queen</div>"
    + "<div class=playlist_item>Tracks: 23</div>"
    + "<div class=playlist_item>Maicolabr</div>"
    + "<div class=playlist_item>Time: 1:32:23</div>";
 
    document.getElementById("playlist_list").appendChild(block);
}

