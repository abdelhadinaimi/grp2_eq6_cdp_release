module.exports.global = {
  app: {
    name: 'Nom de l\'Application'
  }
};

module.exports.errorMessages = {
  username: {
    exists: "Le nom d'utilisateur existe déjà.",
    max: "Le nom d'utilisateur ne doit pas dépasser 20 char.",
    min: "Le nom d'utilisateur doit avoir au moins 4 char."
  },
  email: {
    exists: "Cet email est déjà utilisé.",
    valid: "Cet email n'est pas valide.",
    max: "L'email ne doit pas dépasser 256 char."
  },
  password: {
    incorrect: "Le mot de passe est incorrect.",
    max: "Le mot de passe ne doit pas dépasser 32 char.",
    min: "Le mot de passe doit avoir au moins 8 char.",
    number: "Le mot de passe doit avoir au moins un chiffre.",
    upper: "Le mot de passe doit avoir au moins une majuscule.",
    lower: "Le mot de passe doit avoir au moins une minuscule."
  },
  user: {
    not_found: "Cet utilisateur n'existe pas."
  }
};
