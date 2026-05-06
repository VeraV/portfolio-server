import 'dotenv/config';
import express from 'express';
import techCategoryRoutes from './routes/tech-category.routes';
import projectRoutes from './routes/project.routes';
import technologyRoutes from './routes/technology.routes';
import authRoutes from './routes/auth.routes';
import manualRoutes from './routes/manual.routes';
import stepRoutes from './routes/step.routes';
import indexRoutes from './routes/index.routes';
import configureMiddleware from './config';
import configureErrorHandling from './error-handling';

const app = express();

configureMiddleware(app);

app.use('/api/tech-category', techCategoryRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/technology', technologyRoutes);
app.use('/api/manuals', manualRoutes);
app.use('/api/steps', stepRoutes);
app.use('/api', indexRoutes);
app.use('/auth', authRoutes);

configureErrorHandling(app);

export default app;
