\c socobo_dev;

CREATE TABLE Socobo_User (
  ID SERIAL PRIMARY KEY,
  username VARCHAR NOT NULL UNIQUE,
  email VARCHAR NOT NULL UNIQUE,
  password VARCHAR NOT NULL,
  image VARCHAR NOT NULL,
  hasTermsAccepted BOOLEAN NOT NULL,
  isAdmin BOOLEAN NOT NULL,
  provider VARCHAR NOT NULL,
  created NUMERIC NOT NULL,
  lastModified NUMERIC NOT NULL CHECK (lastModified >= created)
);