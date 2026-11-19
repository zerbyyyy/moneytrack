import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from './app.js';

describe('application', () => {
  const app = createApp();

  it('répond à la sonde de vie', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('renvoie une 404 JSON sur une route inconnue', async () => {
    const res = await request(app).get('/api/inconnue');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Ressource introuvable' });
  });

  it('ajoute les en-têtes de sécurité et masque la technologie utilisée', async () => {
    const res = await request(app).get('/api/health');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-powered-by']).toBeUndefined();
  });

  it('renvoie une 400 sur un JSON mal formé', async () => {
    const res = await request(app)
      .post('/api/health')
      .set('Content-Type', 'application/json')
      .send('{ invalide');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Corps de requête JSON invalide' });
  });
});
