\c socobo;

CREATE TABLE Socobo_User (
  ID SERIAL PRIMARY KEY,
  username VARCHAR,
  password VARCHAR
);

CREATE TABLE recipes (
  ID SERIAL PRIMARY KEY,
  title varchar(100)
);