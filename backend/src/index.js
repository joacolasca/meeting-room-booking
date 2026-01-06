const express = require('express');
const app = express();

app.use(express.json());

const salasRoutes = require('./routes/salas.routes');

app.use('/api/salas', salasRoutes);

app.listen(3001, () => {
    console.log('Servidor corriendo en puerto 3001');
});
