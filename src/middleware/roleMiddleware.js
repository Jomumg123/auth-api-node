const checkRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({
                message: 'No tienes permisos para acceder'
            });
        }
        next();
    };
};

module.exports = checkRole;
