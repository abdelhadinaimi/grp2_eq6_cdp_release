module.exports.errorMessages = {
  username: {
    exists: "nom d'utilisateur exist déja",
    max: "doit etre au max 20 char",
    min: "doit etre au moin 4 char"
  },
  email: {
    exists: "email déja utilisé",
    valid: "doit etre un email valide",
    max: "email ne doit pas dépasser 256 char"
  },
  password: {
    incorrect: "mot de passe incorrect",
    min: "doit etre au moin 8 char",
    max: "doit etre au max 32 char",
    number: "doit avoir au moin un chiffre",
    upper: "doit avoir au moin une majuscule",
    lower: "doit avoir au moin une minuscule"
  },
  user: {
    not_found: "utilisateur n'existe pas"
  }
};
