\c socobo_dev;

INSERT INTO Socobo_User (username, email, password, image, hasTermsAccepted, isAdmin, provider) VALUES 
  ('JohnDoe', 'john-doe@test.test', '$2a$10$3Zmu33SdHvByHW5vdIJafu45eKybWeSe9lnL6EdSlDzTiWLCAHdUC', 'http://placehold.it/350x150', true, false, 'email'),
  ('MaxMustermann', 'max-mustermann@test.test', '$2a$10$CuivooymnRoJrfUQi6i3BOfRMGomihRxSymdhhkKmZLQubMjWglzK', 'http://placehold.it/350x150', true, false, 'email');