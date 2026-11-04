import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');
const savedSettingsPath = join(process.cwd(), 'data', 'settings', 'saved.json');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(express.json({ limit: '32kb' }));

app.get('/api/settings', async (_req, res) => {
  try {
    const raw = await readFile(savedSettingsPath, 'utf8');
    res.type('json').send(raw);
  } catch (error) {
    console.error('Failed to read saved settings', error);
    res.status(500).json({ error: 'Failed to read saved settings' });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    const body = req.body;
    if (!body || typeof body !== 'object') {
      res.status(400).json({ error: 'Invalid settings payload' });
      return;
    }

    const payload = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await mkdir(dirname(savedSettingsPath), { recursive: true });
    await writeFile(savedSettingsPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
    res.json(payload);
  } catch (error) {
    console.error('Failed to write saved settings', error);
    res.status(500).json({ error: 'Failed to write saved settings' });
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
