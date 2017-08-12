\c socobo_test;

--
--  SOCOBO USER
--

CREATE TABLE Socobo_User_Role (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE,
  created NUMERIC NOT NULL,
  lastModified NUMERIC NOT NULL CHECK (lastModified >= created)
);

CREATE TABLE Socobo_User_Provider (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE,
  created NUMERIC NOT NULL,
  lastModified NUMERIC NOT NULL CHECK (lastModified >= created)
);

CREATE TABLE Socobo_User_Image (
  id SERIAL PRIMARY KEY,
  url VARCHAR NOT NULL UNIQUE,
  created NUMERIC NOT NULL,
  lastModified NUMERIC NOT NULL CHECK (lastModified >= created)
);

CREATE TABLE Socobo_User (
  id SERIAL PRIMARY KEY,      
  socoboUserRoleId SERIAL REFERENCES Socobo_User_Role(id) NOT NULL,
  socoboUserProviderId SERIAL REFERENCES Socobo_User_Provider(id) NOT NULL,
  socoboUserImageId SERIAL REFERENCES Socobo_User_Image(id) NOT NULL, 
  username VARCHAR NOT NULL UNIQUE,
  email VARCHAR NOT NULL UNIQUE,
  password VARCHAR NOT NULL,
  hasTermsAccepted BOOLEAN NOT NULL,
  created NUMERIC NOT NULL,
  lastModified NUMERIC NOT NULL CHECK (lastModified >= created)
);

--
--  SOCOBO RECIPE
--

CREATE TABLE recipes (
  ID SERIAL PRIMARY KEY,
  title varchar(100) NOT NULL,
  userId integer REFERENCES Socobo_User(id) NOT NULL,
  description text,
  imageUrl varchar(1000),
  created timestamp
);