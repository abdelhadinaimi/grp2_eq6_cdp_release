module.exports.global = {
  app: {
    name: "Nom de l'Application"
  },
  viewRoutes: {
    addEdit: "project/add-edit",
    addEditIssue: "project/add-edit-issue",
    addEditTask: "project/add-edit-task"
  },
  appRoutes: {
    projectIssues: _id => `/projects/${_id}/issues`,
    projectTasks: _id => `/projects/${_id}/tasks`,
    projectId: _id => "/projects/" + _id,
    notFound: "/500"
  }
};

module.exports.errorGeneralMessages = {
  accessNotAuthorized: "Accès non-autorisé",
  notAllowed: "Vous n'êtes pas authorisés",
  modificationNotAllowed: "Modification non Autorisée !",
  deleteNotAllowed: "Suppression non Autorisée !"
};

module.exports.errorUserMessages = {
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
  confirmPassword: {
    same: "Vos mots de passe ne correspondent pas."
  },
  user: {
    not_found: "Cet utilisateur n'existe pas."
  }
};

module.exports.errorProjectMessages = {
  title: {
    empty: "Il faut spécifier un titre à ce projet.",
    max: "Le titre ne doit pas dépasser 128 char."
  },
  dueDate: {
    format: "La date ne respecte pas le format (dd/mm/yyyy)."
  },
  description: {
    max: "La description ne doit pas dépasser 3000 char."
  },
  role: {
    empty: "Il faut spécifier un role",
    values: "Le role doit être soit user soit PM"
  }
};

module.exports.errorIssueMessages = {
  userType: {
    empty: "Il faut spécifier un type d'utilisateur.",
    max: "Le type du user ne doit pas dépasser 1000 char."
  },
  userGoal: {
    empty: "Il faut spécifier un but ",
    max: "Le but ne doit pas dépasser 1000 char."
  },
  userReason: {
    empty: "Il faut spécifier une raison.",
    max: "La raison ne doit pas dépasser 1000 char."
  },
  storyId: {
    max: "l'identifiant ne doit pas dépasser 20 char."
  },
  difficulty: {
    empty: "Il faut spécifier une difficulté.",
    min: "La difficulté doit être > 1."
  }
};

module.exports.errorTaskMessages = {
  cost: {
    empty: "Il faut spécifier un coût.",
    min: "Le coût doit être supérieur à 0,5."
  },
  description: {
    empty: "Il faut spécifier une description.",
    max: "La description ne doit pas dépasser 3000 char."
  },
  definitionOfDone: {
    empty: "Il faut spécifier une Definition of Done.",
    max: "La Definition of Done ne doit pas dépasser 3000 char."
  },
  state: {
    match: "If faut spécifier un état valide"
  }
};
