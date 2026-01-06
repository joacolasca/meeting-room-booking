function obtenerSalas(req, res) {
    const salas = [
        { id: 1, nombre: 'Sala A', capacidad: 10 },
        { id: 2, nombre: 'Sala B', capacidad: 6 }
    ];

    res.json(salas);
}

function crearSala(req, res) {
    const nuevaSala = req.body;

    res.json({
        mensaje: 'Sala creada',
        sala: nuevaSala
    });
}

module.exports = {
    obtenerSalas,
    crearSala
};
