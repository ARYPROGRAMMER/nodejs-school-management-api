const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const schoolRoutes = require("./routes/schoolRoutes");

const app = express();

app.use(express.json());

// Swagger API Documentation Route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/schools", schoolRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

module.exports = app;
