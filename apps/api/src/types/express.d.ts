declare global {
  namespace Express {
    interface Request {
      /** Identifiant de l'utilisateur, extrait du JWT par le middleware requireAuth */
      userId?: string;
    }
  }
}

export {};
