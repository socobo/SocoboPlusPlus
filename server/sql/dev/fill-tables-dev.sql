\c socobo_dev;

INSERT INTO Socobo_User (username, email, password, image, hasTermsAccepted, isAdmin, provider, created, lastModified) 
VALUES 
  ('john-doe@test.test', 'john-doe@test.test', '$2a$10$3Zmu33SdHvByHW5vdIJafu45eKybWeSe9lnL6EdSlDzTiWLCAHdUC', 
    'http://placehold.it/350x150', true, false, 0, 
    1484401066602, 1484401066602),
  ('MaxMustermann', 'MaxMustermann', '$2a$10$CuivooymnRoJrfUQi6i3BOfRMGomihRxSymdhhkKmZLQubMjWglzK', 
    'http://placehold.it/350x150', true, false, 1, 
    1484401066602, 1484401066602);