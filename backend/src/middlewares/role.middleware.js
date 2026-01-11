function roleMiddleware(rolesPermitidos = []) {
    return (req, res, next) => {
        const { role } = req.user;

        if (!rolesPermitidos.includes(role)) {
        return res.status(403).json({
            error: 'No tenés permisos para esta acción'
        });
        }

        next();
    };
}

module.exports = roleMiddleware;
