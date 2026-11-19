import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { getEnv } from '../config/env.js';
import { HttpError } from '../lib/http-error.js';

/**
 * Vérifie le jeton d'accès (en-tête Authorization: Bearer) et place l'identifiant
 * de l'utilisateur dans req.userId. Toute requête sur les données doit ensuite filtrer
 * par req.userId : c'est la protection contre l'IDOR (risque R-01).
 */
export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    next(new HttpError(401, 'Authentification requise'));
    return;
  }

  try {
    const payload = jwt.verify(header.slice('Bearer '.length), getEnv().JWT_ACCESS_SECRET, {
      algorithms: ['HS256'],
    });
    if (typeof payload === 'string' || typeof payload.sub !== 'string') {
      throw new Error('Jeton sans sujet');
    }
    req.userId = payload.sub;
    next();
  } catch {
    next(new HttpError(401, 'Jeton invalide ou expiré'));
  }
};
