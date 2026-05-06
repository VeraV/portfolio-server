import { Application, Request, Response, NextFunction } from 'express';

interface HttpError extends Error {
  status?: number;
}

export default (app: Application) => {
  // 404 — runs when no route matched.
  app.use((req: Request, res: Response) => {
    res.status(404).json({ message: 'This route does not exist' });
  });

  // Centralised error handler.
  app.use((err: HttpError, req: Request, res: Response, _next: NextFunction) => {
    // Only log unexpected server errors, not expected client errors (401, 400, etc).
    if (!err.status || err.status >= 500) {
      console.error('ERROR', req.method, req.path, err);
    }

    if (!res.headersSent) {
      res.status(err.status || 500).json({
        message:
          err.message || 'Internal server error. Check the server console',
      });
    }
  });
};
