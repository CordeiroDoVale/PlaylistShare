CREATE TABLE usuarios(
    id Serial,
    username VARCHAR(20),
    email VARCHAR(100),
    nome varchar(100),
    password varchar(30)
);

DROP TABLE usuarios;
DROP TABLE playlists;