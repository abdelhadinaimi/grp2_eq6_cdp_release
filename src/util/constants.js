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
  accessNotAuthorized: "Accès non-autorisé !",
  notAllowed: "Création non-autorisée !",
  modificationNotAllowed: "Modification non-autorisée !",
  deleteNotAllowed: "Suppression non-autorisée !"
};
module.exports.errorUserMessages = {
  username: {
    exists: "Le nom d'utilisateur existe déjà.",
    max: "Le nom d'utilisateur ne doit pas dépasser 20 caractères.",
    min: "Le nom d'utilisateur doit avoir au moins 4 caractères."
  },
  email: {
    exists: "Cet email est déjà utilisé.",
    valid: "Cet email n'est pas valide.",
    max: "L'email ne doit pas dépasser 256 caractères."
  },
  password: {
    incorrect: "Le mot de passe est incorrect.",
    max: "Le mot de passe ne doit pas dépasser 32 caractères.",
    min: "Le mot de passe doit avoir au moins 8 caractères.",
    number: "Le mot de passe doit contenir au moins un chiffre.",
    upper: "Le mot de passe doit contenir au moins une majuscule.",
    lower: "Le mot de passe doit contenir au moins une minuscule."
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
    max: "Le titre ne doit pas dépasser 128 caractères."
  },
  dueDate: {
    format: "La date ne respecte pas le format (dd/mm/yyyy)."
  },
  description: {
    max: "La description ne doit pas dépasser 3000 caractères."
  },
  role: {
    empty: "Il faut spécifier un rôle.",
    values: "Le rôle doit être soit 'Developer' soit 'Project Manager'."
  }
};

module.exports.errorIssueMessages = {
  userType: {
    empty: "Il faut spécifier un type d'utilisateur.",
    max: "Le type de l'utilisateur ne doit pas dépasser 1000 caractères."
  },
  userGoal: {
    empty: "Il faut spécifier un objectif.",
    max: "L'objectif ne doit pas dépasser 1000 caractères."
  },
  userReason: {
    empty: "Il faut spécifier une raison.",
    max: "La raison ne doit pas dépasser 1000 caractères."
  },
  storyId: {
    max: "L'identifiant ne doit pas dépasser 20 caractères."
  },
  difficulty: {
    empty: "Il faut spécifier une difficulté.",
    min: "La difficulté doit être supérieure ou égale à 1."
  }
};

module.exports.errorTaskMessages = {
  state: {
    match: "If faut spécifier un état valide."
  }
}
