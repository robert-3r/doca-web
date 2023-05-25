const jwt = require("../utils/jwt");

const asureAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).send({
      status: "error",
      message: "La peticion no tiene la cabecera de authenticacion",
    });
  }

  const token = req.headers.authorization.replace(/^Bearer\s*/i, "");

  try {
    const payload = jwt.decoded(token);
    const { exp } = payload;
    const currentData = new Date().getTime();

    if (exp <= currentData) {
      return res.status(400).send({
        status: "error",
        message: "El Token a expirado",
      });
    }

    req.user = payload;
    next();
  } catch (error) {
    return res.status(403).send({
      status: "error",
      message: "Token  invalido",
    });
  }
};

module.exports = {
  asureAuth,
};
