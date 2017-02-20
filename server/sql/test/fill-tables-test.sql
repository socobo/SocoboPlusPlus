\c socobo_test;

INSERT INTO Socobo_User (username, email, password, image, hasTermsAccepted, role, provider, created, lastModified) 
VALUES 
  ('john-doe@test.test', 'john-doe@test.test', '$2a$10$3Zmu33SdHvByHW5vdIJafu45eKybWeSe9lnL6EdSlDzTiWLCAHdUC', 
    'http://placehold.it/350x150', true, 1, 0, 
    1484401066602, 1484401066602),
  ('MaxMustermann', 'max-mustermann@test.test', '$2a$10$CuivooymnRoJrfUQi6i3BOfRMGomihRxSymdhhkKmZLQubMjWglzK', 
    'http://placehold.it/350x150', true, 1, 1, 
    1484401066602, 1484401066602),
  ('admin@test.test', 'admin@test.test', '$2a$10$twfsBw9Ljl9kjFSvuhyAUOqpEJla0yHhVkeZo4VdTa03./KCjX5ga', 
    'http://placehold.it/350x150', true, 0, 1, 
    1484401066602, 1484401066602);