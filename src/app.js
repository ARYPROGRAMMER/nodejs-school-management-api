const express = require('express');
const schoolRoutes = require('./routes/schoolRoutes');

const app = express();

app.use(express.json());

app.use('/api/schools', schoolRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

module.exports = app;