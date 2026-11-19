import express from 'express';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { errorHandler } from './error-handler.js';
import { requireAuth } from './require-auth.js';

const SECRET = process.env.JWT_ACCESS_SECRET as string;

const app = express();
app.get('/protegee', requireAuth, (req, res) => {
  res.json({ userId: req.userId });
});
app.use(errorHandler);

describe('requireAuth', () => {
  it("laisse passer un jeton valide et expose l'identifiant de l'utilisateur", async () => {
    const token = jwt.sign({ sub: 'user-1' }, SECRET, { algorithm: 'HS256', expiresIn: '15m' });
    const res = await request(app).get('/protegee').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ userId: 'user-1' });
  });

  it('refuse une requête sans jeton', async () => {
    const res = await request(app).get('/protegee');
    expect(res.status).toBe(401);
  });

  it('refuse un jeton expiré', async () => {
    const token = jwt.sign({ sub: 'user-1', exp: Math.floor(Date.now() / 1000) - 10 }, SECRET);
    const res = await request(app).get('/protegee').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(401);
  });

  it('refuse un jeton signé avec un autre secret', async () => {
    const token = jwt.sign({ sub: 'user-1' }, 'un-autre-secret-de-plus-de-32-caracteres');
    const res = await request(app).get('/protegee').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(401);
  });

  it('refuse un jeton sans identifiant utilisateur', async () => {
    const token = jwt.sign({ role: 'admin' }, SECRET, { algorithm: 'HS256' });
    const res = await request(app).get('/protegee').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(401);
  });
});
