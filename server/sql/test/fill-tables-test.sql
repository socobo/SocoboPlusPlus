\c socobo_test;

INSERT INTO Socobo_User_Role 
  (name, created, lastModified) 
VALUES 
  ('ADMIN', 1499517949916, 1499518187521),
  ('USER', 1499517949916 , 1499518187521);

INSERT INTO Socobo_User_Provider 
  (name, created, lastModified)
VALUES
  ('EMAIL', 1499517949916, 1499518187521),
  ('USERNAME', 1499517949916, 1499518187521);

INSERT INTO Socobo_User_Image 
  (url, created, lastModified)
VALUES
  ('socobo_data/placeholder/tmp_user_image.png', 1499517949916, 1499518187521);

INSERT INTO Socobo_User 
  (socoboUserRoleId, socoboUserProviderId, socoboUserImageId, username, email, password, hasTermsAccepted, created, lastModified) 
VALUES 
  (2, 1, 1, 'john-doe@test.test', 'john-doe@test.test', '$2a$10$3Zmu33SdHvByHW5vdIJafu45eKybWeSe9lnL6EdSlDzTiWLCAHdUC', true, 1484401066602, 1484401066602),
  (2, 2, 1, 'MaxMustermann', 'MaxMustermann', '$2a$10$CuivooymnRoJrfUQi6i3BOfRMGomihRxSymdhhkKmZLQubMjWglzK', true, 1484401066602, 1484401066602),
  (1, 1, 1,'admin@test.test', 'admin@test.test', '$2a$10$twfsBw9Ljl9kjFSvuhyAUOqpEJla0yHhVkeZo4VdTa03./KCjX5ga', true, 1484401066602, 1484401066602);