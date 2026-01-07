const express = require('express');
const app = express();

app.use(express.json());

const salasRoutes = require('./routes/salas.routes');
const usersRoutes = require('./routes/users.routes');

app.use('/api/salas', salasRoutes);
app.use('/api/users', usersRoutes);

app.listen(3001, () => {
    console.log('Servidor corriendo en puerto 3001');
});
