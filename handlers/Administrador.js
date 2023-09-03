// [Midellware] usuario autenticado
const administrador = (req, res, next) => {
    req.isAuthenticated() && req.user && req.user.admin ? next() : res.send(false);
};

export default administrador;
