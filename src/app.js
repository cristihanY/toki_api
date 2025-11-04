// src/app.js
'use strict';

const express = require('express');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swaggerConfig');
const errorHandler = require("./middleware/error.handler");

const app = express();

// Middlewares globales
app.use(express.json());
app.use(errorHandler);

// Docs swaggerUI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', routes);

module.exports = app; // 👈 exporta la instancia de Express
