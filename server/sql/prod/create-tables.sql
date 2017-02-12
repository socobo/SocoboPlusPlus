\c socobo;

CREATE TABLE Socobo_User (
  ID SERIAL PRIMARY KEY,
  username VARCHAR NOT NULL UNIQUE,
  email VARCHAR NOT NULL UNIQUE,
  password VARCHAR NOT NULL,
  image VARCHAR NOT NULL,
  hasTermsAccepted BOOLEAN NOT NULL,
  role NUMERIC NOT NULL,
  provider INTEGER NOT NULL,
  created NUMERIC NOT NULL,
  lastModified NUMERIC NOT NULL CHECK (lastModified >= created)
);

CREATE TABLE recipes (
  ID SERIAL PRIMARY KEY,
  title varchar(100) NOT NULL,
  userId integer REFERENCES Socobo_User(id) NOT NULL,
  description text,
  imageUrl varchar(1000),
  created timestamp
);