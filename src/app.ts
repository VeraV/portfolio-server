// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();
import techCategoryRoutes from "./routes/tech-category.routes";
import projectRoutes from "./routes/project.routes";
import technologyRoutes from "./routes/technology.routes";
import authRoutes from "./routes/auth.routes";
import manualRoutes from "./routes/manual.routes";
import stepRoutes from "./routes/step.routes";

// ℹ️ Connects to the database
//require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

app.use("/api/tech-category", techCategoryRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/technology", technologyRoutes);
app.use("/api/manuals", manualRoutes);
app.use("/api/steps", stepRoutes);

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

app.use("/auth", authRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
