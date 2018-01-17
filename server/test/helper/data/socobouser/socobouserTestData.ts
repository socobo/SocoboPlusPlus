import { SocoboUser } from "../../../../src/socobouser/index";

const socobousers = [
  {
    _id : "59a2ee598ae9b7b45243d503",
    created: 1484401066602,
    email: "john-doe@test.test",
    hasTermsAccepted: true,
    imageUrl: "socobo_data/placeholder/tmp_user_image.png",
    lastModified: 1484401066602,
    password: "$2a$10$3Zmu33SdHvByHW5vdIJafu45eKybWeSe9lnL6EdSlDzTiWLCAHdUC", // SuperSecurePassword
    provider: "EMAIL",
    role: "USER",
    username: "john-doe@test.test"
  }, {
    _id : "59a2ee5be2c06ab513940b84",
    created: 1484401066602,
    email: "MaxMustermann",
    hasTermsAccepted: true,
    imageUrl: "socobo_data/placeholder/tmp_user_image.png",
    lastModified: 1484401066602,
    password: "$2a$10$CuivooymnRoJrfUQi6i3BOfRMGomihRxSymdhhkKmZLQubMjWglzK", // SuperMegaSecure
    provider: "USERNAME",
    role: "USER",
    username: "MaxMustermann"
  }, {
    _id : "59a2ee5d6b1ad6c629e9b2fc",
    created: 1484401066602,
    email: "admin",
    hasTermsAccepted: true,
    imageUrl: "socobo_data/placeholder/admin_image.png",
    lastModified: 1484401066602,
    password: "$2a$10$twfsBw9Ljl9kjFSvuhyAUOqpEJla0yHhVkeZo4VdTa03./KCjX5ga", // password
    provider: "USERNAME",
    role: "ADMIN",
    username: "admin"
  }, {
    _id : "59a5a4013eeef0c7a9d00640",
    created: 1484401066602,
    email: "admin2@test.test",
    hasTermsAccepted: true,
    imageUrl: "socobo_data/placeholder/admin_image.png",
    lastModified: 1484401066602,
    password: "$2a$10$twfsBw9Ljl9kjFSvuhyAUOqpEJla0yHhVkeZo4VdTa03./KCjX5ga", // password
    provider: "EMAIL",
    role: "ADMIN",
    username: "admin2@test.test"
  }
];

export const testSocoboUsers = [
  new SocoboUser().clone(socobousers[0]),
  new SocoboUser().clone(socobousers[1]),
  new SocoboUser().clone(socobousers[2]),
  new SocoboUser().clone(socobousers[3])
];
