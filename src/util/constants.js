const projects = "/projects/";

module.exports.global = {
  app: {
    name: "SixCess"
  },
  views: {
    error: {
      404: "error/404",
      500: "error/500"
    },
    index: {
      connected: "index/index-connected",
      nonConnected: "index/index-not-connected"
    },
    project: {
      project: "project/project",
      addEdit: "project/add-edit"
    },
    issue: {
      issues: "issue/issues",
      addEdit: "issue/add-edit-issue"
    },
    task: {
      tasks: "task/tasks",
      addEdit: "task/add-edit-task"
    },
    sprint: {
      sprints: "sprint/sprints",
      sprint: "sprint/sprint",
      addEdit: "sprint/add-edit-sprint"
    },
    release: {
      releases: "release/releases",
      addEdit: "release/add-edit-release"
    },
    doc: {
      doc: "doc/doc"
    },
    test: {
      tests: "test/tests"
    },
    user: {
      register: "user/register",
      login: "user/login",
      forgotPassword: "user/forgot-password",
      resetPassword: "user/reset-password",
      account: "user/account"
    }
  },
  titles: {
    error: {
      404: "Page Non Trouvée",
      500: "Erreur Interne"
    },
    index: "Accueil",
    project: {
      add: "Nouveau Projet",
      edit: "Éditer Projet"
    },
    issue: {
      issues: "Issues",
      add: "Nouvelle Issue",
      edit: "Éditer Issue"
    },
    task: {
      tasks: "Tâches",
      add: "Nouvelle Tâche",
      edit: "Éditer Tâche",
      mine: "Mes Tâches"
    },
    sprint: {
      sprints: "Sprints",
      sprint: "Sprint",
      add: "Nouveau Sprint",
      edit: "Éditer Sprint"
    },
    doc: {
      doc: "Documentation"
    },
    user: {
      register: "Créer un Compte",
      login: "Connexion",
      forgotPassword: "Mot de Passe Oublié",
      resetPassword: "Réinitialisation Mot de Passe",
      account: "Mon Compte"
    },
    release: {
      releases: "Releases",
      add: "Nouvelle Release",
      edit: "Éditer Release"
    },
    test: {
      tests: "Tests"
    }
  },
  routes: {
    error: {
      404: "/404",
      500: "/500"
    },
    index: "/",
    project: {
      project: projectId => projects + projectId
    },
    issue: {
      issues: projectId => projects + projectId + "/issues"
    },
    task: {
      tasks: (projectId, sprintId) => projects + projectId + "/sprints/" + sprintId + "/tasks"
    },
    sprint: {
      sprints: projectId => projects + projectId + "/sprints"
    },
    release: {
      releases: projectId => projects + projectId + "/releases"
    },
    doc: {
      docs: projectId => projects + projectId + "/doc"
    },
    user: {
      register: "/register",
      login: "/login",
      forgotPassword: "/forgot-password",
      account: "/account"
    }
  }
};

module.exports.errorGeneralMessages = {
  accessNotAuthorized: "Accès non-autorisé !",
  notAllowed: "Création non-autorisée !",
  modificationNotAllowed: "Modification non-autorisée !",
  deleteNotAllowed: "Suppression non-autorisée !"
};

module.exports.generaleValidationMessages = {
  description: {
    empty: "Il faut spécifier une description.",
    max: "La description ne doit pas dépasser 3000 char."
  }
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
    max: this.generaleValidationMessages.description.max
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
    max: "L'identifiant ne doit pas dépasser 20 caractères.",
    unique: "L'identifiant de l'issue doit être unique.",
    empty: "Il faut spécifier un identifiant."
  },
  difficulty: {
    empty: "Il faut spécifier une difficulté.",
    min: "La difficulté doit être supérieure ou égale à 1."
  }
};

module.exports.errorTaskMessages = {
  cost: {
    empty: "Il faut spécifier un coût.",
    min: "Le coût doit être supérieur à 0,5."
  },
  description: {
    empty: "Il faut spécifier une description.",
    max: this.generaleValidationMessages.description.max
  },
  definitionOfDone: {
    empty: "Il faut spécifier une Definition of Done.",
    max: "La Definition of Done ne doit pas dépasser 3000 char."
  },
  state: {
    match: "If faut spécifier un état valide."
  }
};

module.exports.errorSprintMessages = {
  id: {
    max: "L'identifiant ne doit pas dépasser 20 caractères.",
    empty: "Il faut spécifier un identifiant."
  },
  startDate: {
    format: "La date ne respecte pas le format (dd/mm/yyyy)."
  },
  endDate: {
    format: "La date ne respecte pas le format (dd/mm/yyyy)."
  },
  description: {
    max: this.generaleValidationMessages.description.max
  }
};

module.exports.errorReleaseMessages = {
  version: {
    max: "L'identifiant ne doit pas dépasser 20 caractères.",
    empty: "Il faut spécifier une version."
  },
  description: {
    max: this.generaleValidationMessages.description.max
  }
};

module.exports.errorDocsMessages = {
  success: "Documentation ajoutée !",
  failed: "La documentation n'a pas pu être ajoutée..."
};
