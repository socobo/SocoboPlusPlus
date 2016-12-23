\c socobo;

CREATE TABLE Socobo_User (
  ID SERIAL PRIMARY KEY,
  username VARCHAR,
  password VARCHAR
);

CREATE TABLE recipes (
  ID SERIAL PRIMARY KEY,
  title varchar(100) NOT NULL,
  userId integer REFERENCES Socobo_User(id) NOT NULL,
  description text,
  imageUrl varchar(1000),
  created timestamp
);