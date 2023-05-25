const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("../utils/jwt");

const register = async (req, res) => {
  const { firstname, lastname, password, email } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);

  if (!email || !password) {
    return res.status(400).send({
      status: "error",
      message: "Faltan datos por enviar",
    });
  }

  const user = new User({
    firstname,
    lastname,
    password: hashPassword,
    email: email.toLowerCase(),
  });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({
        status: "error",
        message: "El correo electrónico ya está registrado",
      });
    }

    const savedUser = await user.save();
    return res.status(200).send({
      status: "success",
      message: "Usuario creado con exito",
      savedUser,
    });
  } catch (error) {
    return res.status(500).send({
      status: "success",
      message: "Error al registar el usuario",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({
      status: "error",
      message: "Faltan datos por enviar",
    });
  }
  const emailLowerCase = email.toLowerCase();

  try {
    const userStored = await User.findOne({ email: emailLowerCase });

    if (!userStored) {
      return res.status(500).send({
        status: "error",
        message: "Ocurrio un error al iniciar sesion",
      });
    }

    const check = await bcrypt.compare(password, userStored.password);

    if (!check) {
      return res.status(404).send({
        status: "error",
        message: " Credenciales incorrectos",
      });
    }

    return res.status(200).send({
      status: "success",
      message: " iniciar sesion correcto",
      access: jwt.createAccessToken(userStored),
      refresh: jwt.createRefreshToken(userStored),
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Ocurrio un error al iniciar sesion",
    });
  }
};

const refreshAccessToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).send({
      status: "error",
      message: "Token requerido",
    });
  }
  const { user_id } = jwt.decoded(token);

  try {
    const userStorage = await User.findOne({ _id: user_id });

    if (!userStorage) {
      return res.status(500).send({
        status: "error",
        message: "Error de servidor ",
      });
    }

    return res.status(200).send({
      status: "success",
      accessToken: jwt.createAccessToken(userStorage),
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error de servidor ",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  refreshAccessToken,
};
