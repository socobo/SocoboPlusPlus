\c socobo;

CREATE TABLE Socobo_User (
  ID SERIAL PRIMARY KEY,
  username VARCHAR,
  email VARCHAR,
  password VARCHAR,
  image VARCHAR,
  hasTermsAccepted BOOLEAN,
  isAdmin BOOLEAN,
  provider VARCHAR
);